import { MdSell } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import Modal from "../../components/Modal";
import { useEffect, useState } from "react";
import TablaEntrenadores from "../../components/entrenadores/TablaEntrenadores";
import FormRegistro from "../../components/entrenadores/FormRegistro";
import FormUpdate from "../../components/entrenadores/FormUpdate";
import clienteAxios from "../../config/axios";

const Entrenadores = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [reload, setReload] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName, trainer = null) => {
    setActiveModal(modalName), setSelectedTrainer(trainer);
  };
  const closeModal = () => setActiveModal(null);

  const dataReload = () => {
    setReload((prev) => !prev);
  };

  const dataUpdate = (trainer) => {
    setTrainers((prev) =>
      prev.map((item) =>
        item.id === trainer.id ? { ...item, ...trainer } : item
      )
    );
  };

  const dataDeleted = (id) => {
    setTrainers((prev) => prev.filter((trainer) => trainer.id !== id));
  };

  useEffect(() => {
    const getTrainers = async () => {
      const { data } = await clienteAxios.get("/entrenador/");
      setTrainers(data);
    };

    getTrainers();
  }, [reload]);
  return (
    <div className="p-5">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <span className="text-gray-600">Lista /</span> Entrenadores
        </h1>
        <button
          className="text-lg bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 flex items-center gap-2  "
          onClick={() => openModal("registrar")}
        >
          <MdSell />
          Agregar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Cards informes en caso de existir */}
      </div>
      <TablaEntrenadores
        openModal={openModal}
        trainers={trainers}
        dataDeleted={dataDeleted}
      />
      {/* Modal de agregar productos */}
      {activeModal === "registrar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Agregar entrenador</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>
          <FormRegistro dataReload={dataReload} />
        </Modal>
      )}
      {/* Modal de registro */}
      {activeModal === "editar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Editar entrenador</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>
          <FormUpdate
            selectedTrainer={selectedTrainer}
            dataUpdate={dataUpdate}
          />
        </Modal>
      )}
    </div>
  );
};

export default Entrenadores;
