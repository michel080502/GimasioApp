import { MdSell } from "react-icons/md";
import { IoMdCloseCircle  } from "react-icons/io";
import CardInforme from "../../components/productos/CardInforme";
import Modal from "./Modal";
import { useState } from "react";
import FormRegistro from "../../components/productos/FormRegistro";
import TablaClientes from "../../components/clientes/TablaClientes";
const Productos = () => {
  const [ activeModal, setActiveModal ] = useState(null);
  
  const openModal = (modalName) =>{
    setActiveModal(modalName);
  }
  const closeModal = () => setActiveModal(null);

  return (
	<div className="p-5">
    <div className="p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold"><span className="text-gray-600">Lista /</span> Productos</h1>
      <button 
        className="button flex gap-2 items-center text-lg "
        onClick={() => openModal("registrar")}
      >
        <MdSell />
        Agregar producto
      </button>
    </div>

    <div className="grid grid-cols-3 gap-4 ">
      <CardInforme />
    </div>
    <TablaClientes openModal={openModal}/>
    {/* Modal de agregar productos */}
    {activeModal === "registrar" && (
      <Modal closeModal={closeModal} >
        <div className="flex justify-between pb-3">
          <h2 className="text-3xl font-semibold">Agregar producto</h2>
          <button
            className="text-red-700"
            onClick={closeModal}>
            <IoMdCloseCircle className="text-3xl" />
          </button>
        </div>
        <FormRegistro />
      </Modal>
    )};

  </div>
  )
}


export default Productos