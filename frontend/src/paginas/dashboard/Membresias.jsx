import { IoMdAddCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { useState } from "react";
import Modal from "../../components/Modal";
import CardInforme from "../../components/membresias/CardInforme";
import Activas from "../../components/membresias/tablasEstado/Activas";
import ProximasVencer from "../../components/membresias/tablasEstado/ProximasVencer";
import VencenHoy from "../../components/membresias/tablasEstado/VencenHoy";
import TablaMembresias from "../../components/membresias/TablaMembresias";

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
      {tablaDatos === "" && <TablaMembresias />}
      {tablaDatos === "activos" && <Activas />}
      {tablaDatos === "porVencer" && <ProximasVencer />}
      {tablaDatos === "vencenHoy" && <VencenHoy />}

      {/* Modal de agregar productos */}
      {activeModal === "registrar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Agregar membresia</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>
          {/* Espacio para form */}
        </Modal>
      )}
      {/* Modal de registro */}
      {activeModal === "editar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Editar cliente</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>

          {/* Form Update */}
        </Modal>
      )}
    </div>
  );
};

export default Membresias;
