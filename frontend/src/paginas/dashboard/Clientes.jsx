import { IoMdPersonAdd, IoMdCloseCircle  } from "react-icons/io";
import Modal from "./Modal";
import CardInforme from "../../components/clientes/CardInforme";
import TablaClientes from "../../components/clientes/TablaClientes";
import { useState } from "react";
import FormRegistro from "../../components/clientes/FormRegistro";
import FormUpdate from "../../components/clientes/FormUpdate";

const Clientes = () => {

  const [ activeModal, setActiveModal ] = useState(null);
  const [ selectedId, setSelectedId ] = useState(null);
  const openModal = (modalName, id = null) => {
    setActiveModal(modalName),
    setSelectedId(id);
  };
  const closeModal = () => setActiveModal(null);

  return (
	<div className="p-5">

    <div className="p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold"><span className="text-gray-600">Lista /</span> Clientes</h1>
      <button 
        className="button flex gap-2 items-center text-lg "
        onClick={() => openModal("registrar")}> <IoMdPersonAdd /> Registrar cliente</button>
    </div>

    <div className="grid grid-cols-3 gap-4 ">
      <CardInforme />
    </div>
    <TablaClientes openModal={openModal} />


    {/* Modal de registro */}
    {activeModal === "registrar" && (
      <Modal closeModal={closeModal}>
        <div className="flex justify-between pb-3">
          <h2 className="text-3xl font-semibold">Registrar cliente</h2>
          <button
            className="text-red-700"
            onClick={closeModal}>
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
          <h2 className="text-3xl font-semibold">Editar cliente</h2>
          <button
            className="text-red-700"
            onClick={closeModal}>
            <IoMdCloseCircle className="text-3xl" />
          </button>
        </div>
        
          <FormUpdate id={selectedId} />
        
      </Modal>
    )}
  </div>
  )
}



export default Clientes