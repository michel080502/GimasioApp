
import { IoMdAddCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import CardInforme from "../../components/productos/CardInforme";
import Modal from "../../components/Modal";
import { useState } from "react";
import FormRegistro from "../../components/productos/FormRegistro";
import TablaProductos from "../../components/productos/TablaProductos";
import FormUpdate from "../../components/productos/FormUpdate";
const Productos = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };
  const closeModal = () => setActiveModal(null);

  return (
    <div className="p-5">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <span className="text-gray-600">Lista /</span> Productos
        </h1>
        <button
          className="button flex gap-2 items-center text-lg "
          onClick={() => openModal("registrar")}
        >
          <IoMdAddCircle />
          Agregar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 ">
        <CardInforme />
      </div>
      <TablaProductos openModal={openModal} />
      {/* Modal de agregar productos */}
      {activeModal === "registrar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Agregar producto</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>
          <FormRegistro />
        </Modal>
      )}
      {/* Modal de registro */}
    {activeModal === "editar" && (
      <Modal closeModal={closeModal}>
        <div className="flex justify-between pb-3">
          <h2 className="text-2xl font-semibold">Editar cliente</h2>
          <button
            className="text-red-700"
            onClick={closeModal}>
            <IoMdCloseCircle className="text-3xl" />
          </button>
        </div>
        
          <FormUpdate />
        
      </Modal>
    )}
    </div>
  );
};

export default Productos;
