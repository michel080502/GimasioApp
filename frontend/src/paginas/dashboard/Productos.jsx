import { IoMdAddCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

import CardInforme from "../../components/productos/CardInforme";
import Modal from "../../components/Modal";
import FormRegistro from "../../components/productos/FormRegistro";
import TablaProductos from "../../components/productos/TablaProductos";
import FormUpdate from "../../components/productos/FormUpdate";

import { useState } from "react";

const Productos = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [dataType, setDataType] = useState("");

  const typeTable = (type) => {
    setDataType((prev) => (prev === type ? "" : type));
  };
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
        <div className="flex gap-3">
          <button
            className="button flex gap-2 items-center text-lg "
            onClick={() => openModal("registrar")}
          >
            <IoMdAddCircle />
            Agregar producto
          </button>
          <button
            className="button flex gap-2 items-center text-lg "
            onClick={() => openModal("categoria")}
          >
            <IoMdAddCircle />
            Agregar categoria
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 ">
        <CardInforme typeTable={typeTable} />
      </div>
      <TablaProductos openModal={openModal} dataType={dataType} />
      {/* Modal de agregar productos */}
      {activeModal === "registrar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Agregar producto</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-2xl" />
            </button>
          </div>
          <FormRegistro />
        </Modal>
      )}
      {/* Modal de registro */}
      {activeModal === "editar" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Editar producto</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-2xl" />
            </button>
          </div>

          <FormUpdate />
        </Modal>
      )}
      {/* Modal de registro */}
      {activeModal === "categoria" && (
        <Modal closeModal={closeModal}>
          <div className="flex justify-between pb-3">
            <h2 className="text-2xl font-semibold">Agregar categoria</h2>
            <button className="text-red-700" onClick={closeModal}>
              <IoMdCloseCircle className="text-2xl" />
            </button>
          </div>

          <form className="grid p-3 ">
            <label className=" m-1 font-bold">Nombre categoria</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              placeholder="ejm: Proteina"
            />
            <button type="submit" className="mt-4 button w-32 m-auto">Guardar</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Productos;
