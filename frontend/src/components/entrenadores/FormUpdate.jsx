import Alerta from "../Alerta";

import { useState } from "react";
import PropTypes from "prop-types";
import clienteAxios from "../../config/axios";

const FormUpdate = ({ selectedTrainer, dataUpdate }) => {
  const [trainer, setTrainer] = useState(selectedTrainer);
  const [alerta, setAlerta] = useState({ msg: "", error: false });
  const [showOptions, setShowOptions] = useState(null);

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefono") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setTrainer((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setTrainer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validarActualizacion = (data) => {
    const empty = Object.values(data).some(
      (valor) => valor === "" || valor === null || valor === undefined
    );
    if (
      data.nombre === selectedTrainer.nombre &&
      data.apellido_paterno === selectedTrainer.apellido_paterno &&
      data.apellido_materno === selectedTrainer.apellido_materno &&
      data.especialidad === selectedTrainer.especialidad &&
      data.telefono === selectedTrainer.telefono &&
      data.email === selectedTrainer.email
    )
      return "No hay cambios";
    if (empty) return "No pueden ir valores vacios";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validarActualizacion(trainer);
    if (errorMsg) {
      return mostrarAlerta(errorMsg, true);
    }

    try {
      const { data } = await clienteAxios.put(
        `/entrenador/actualizar/${trainer.id}`,
        trainer
      );
      dataUpdate(trainer);
      mostrarAlerta(data.msg, false);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };
  const { msg } = alerta;
  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" border pb-2 grid justify-center max-w-screen-sm  overflow-y-auto"
      >
        {msg && <Alerta alerta={alerta} />}
        <div className="m-5 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 relative">
          <div className="grid grid-cols-1 md:grid-rows-3 order-2 ">
            <button
              type="button"
              className="w-20 md:w-3/4 md:h-3/4 m-auto cursor-pointer row-span-2"
              onClick={toggleOptions}
            >
              <img
                src={trainer.img_secure_url}
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </button>
            <p className="text-center font-medium">Foto del entrenador</p>
            {/* Opcion para cargar imagen */}
            {/* Opcion para cargar imagen */}
            {showOptions && (
              <div className="absolute  mt-2 bg-rose-300 border border-red-900 rounded-lg shadow-lg w-48 z-10">
                <p className=" px-4 py-2 cursor-pointer text-white">
                  ¡Aun no disponible opcion para editar imagen¡
                </p>
              </div>
            )}
          </div>

          <div className="order-1 col-span-2 grid gap-2 grid-cols-2">
            <div className=" grid col-span-2">
              <label className=" font-bold">Nombre</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="nombre"
                value={trainer.nombre || ""}
                onChange={handleInputChange}
                placeholder="ejm: Carlos Belcast"
              />
            </div>
            <div className=" grid ">
              <label className=" p-1 font-bold">Apellido Paterno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="apellido_paterno"
                value={trainer.apellido_paterno || ""}
                onChange={handleInputChange}
                placeholder="Carlos Belcast"
              />
            </div>
            <div className=" grid">
              <label className=" p-1 font-bold">Apellido Materno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="apellido_materno"
                value={trainer.apellido_materno || ""}
                onChange={handleInputChange}
                placeholder="Carlos Belcast"
              />
            </div>
            <div className=" grid col-span-2">
              <label className=" p-1 font-bold">Especialidad</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="especialidad"
                value={trainer.especialidad || ""}
                onChange={handleInputChange}
                placeholder="ejm: Carlos Belcast"
              />
            </div>
            <div className=" grid">
              <label className=" p-1 font-bold">Telefono</label>
              <input
                className="border p-2 rounded-lg"
                type="tel"
                maxLength={10}
                pattern="[0-9]{10}"
                name="telefono"
                value={trainer.telefono || ""}
                onChange={handleInputChange}
                placeholder="ejm: Carlos Belcast"
              />
            </div>
            <div className=" grid">
              <label className=" p-1 font-bold">Email</label>
              <input
                className="border p-2 rounded-lg"
                type="email"
                name="email"
                value={trainer.email || ""}
                onChange={handleInputChange}
                placeholder="ejm: Carlos Belcast"
              />
            </div>
          </div>
        </div>
        <button className="text-sm bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 flex items-center gap-2 m-auto ">
          Guardar
        </button>
      </form>
    </>
  );
};

FormUpdate.propTypes = {
  selectedTrainer: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    apellido_paterno: PropTypes.string,
    apellido_materno: PropTypes.string,
    especialidad: PropTypes.string,
    telefono: PropTypes.string,
    email: PropTypes.string,
    activo: PropTypes.bool,
    img_secure_url: PropTypes.string,
  }),
  dataUpdate: PropTypes.func,
};

export default FormUpdate;
