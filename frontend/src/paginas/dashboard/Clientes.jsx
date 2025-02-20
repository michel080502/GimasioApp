import { IoMdAddCircle, IoMdCloseCircle } from "react-icons/io";
import Modal from "../../components/Modal";
import TablaClientes from "../../components/clientes/TablaClientes";
import { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import FormRegistro from "../../components/clientes/FormRegistro";
import FormUpdate from "../../components/clientes/FormUpdate";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [reload, setReload] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  // Traer los clientes al cargar componente
  useEffect(() => {
    const getClientes = async () => {
      try {
        const { data } = await clienteAxios.get("/cliente/");
        setClientes(data);
      } catch (error) {
        console.log("Error al obtener clientes", error);
        setClientes([]); // tabla no quede indefinida
      }

      setLoading(false);
    };

    getClientes();
  }, [reload]);

  const dataUpdate = (client) => {
    setClientes((prev) =>
      prev.map((item) =>
        item.id === client.id ? { ...item, ...client } : item
      )
    );
  };

  const reloadContent = () => {
    setReload((prev) => !prev);
  };

  const dataDeleted = (id) => {
    setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
  };
  const openModal = (modalName, client = null) => {
    setActiveModal(modalName), setSelectedClient(client);
  };
  const closeModal = () => setActiveModal(null);
  if (loading) return <p>Cargando....</p>;
  return (
    <div className="p-5">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <span className="text-gray-600">Lista /</span> Clientes
        </h1>
        <button
          className="text-lg bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 flex items-center gap-2 "
          onClick={() => openModal("registrar")}
        >
          {" "}
          <IoMdAddCircle />
          Agregar
        </button>
      </div>

      {/* <div className="grid grid-cols-3 gap-4 ">
         <CardInforme clientes={clientes} typeData={handleFilterChange} /> 
      </div> */}
      <TablaClientes
        clientes={clientes}
        setClientes={setClientes}
        openModal={openModal}
        dataDeleted={dataDeleted}
      />

      {/* Modal de registro */}
      {activeModal === "registrar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-3xl font-semibold">Registrar cliente</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>

          <FormRegistro reloadContent={reloadContent} />
        </Modal>
      )}
      {/* Modal de registro */}
      {activeModal === "editar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-3xl font-semibold">Editar cliente</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>

          <FormUpdate selectedClient={selectedClient} dataUpdate={dataUpdate} />
        </Modal>
      )}
    </div>
  );
};

export default Clientes;
