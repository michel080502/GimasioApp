import { IoMdAddCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

import Modal from "../../components/Modal";
import CardInforme from "../../components/membresias/CardInforme";
import TablaCompras from "../../components/membresias/TablaCompras";
import TablaMembresias from "../../components/membresias/TablaMembresias";
import FormRegistro from "../../components/membresias/FormRegistro";
import FormUpdate from "../../components/membresias/FormUpdate";

import { useState } from "react";

const Membresias = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [tablaDatos, setTablaDatos] = useState("");

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };
  const typeTable = (type) =>
    setTablaDatos((prev) => (prev === type ? "" : type));
  const closeModal = () => setActiveModal(null);
  return (
    <div className="p-5">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <span className="text-gray-600">Lista /</span> Membresias
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
        <CardInforme typeTable={typeTable} />
      </div>
      {/* Tablas informes */}
      {tablaDatos === "" && <TablaMembresias openModal={openModal} />}
      {tablaDatos !== "" && <TablaCompras tipo ={tablaDatos} openModal={openModal}/>}

      {/* Modal de agregar productos */}
      {activeModal === "registrar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Agregar membresia</h2>
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
            <h2 className="text-2xl font-semibold">Editar membresia</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>

          <FormUpdate />
        </Modal>
      )}
      
    </div>
  );
};

export default Membresias;
