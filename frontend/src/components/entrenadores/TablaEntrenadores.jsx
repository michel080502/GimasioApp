import { MdDelete } from "react-icons/md";
import { BsPencilFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { useState } from "react";
import ToggleSwitch from "../ui/ToggleSwitch";
import Alerta from "../Alerta";
import clienteAxios from "../../config/axios";

const TablaEntrenadores = ({ openModal, trainers, dataDeleted }) => {
  const [deleteTrainer, setDeleteTrainer] = useState(false);
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const handleAvaliable = async (id, newValue) => {
    try {
      const { data } = await clienteAxios.put(
        `/entrenador/actualizar-activo/${id} `,
        {
          activo: newValue,
        }
      );
      mostrarAlerta(data.msg, false);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const toggleDelete = (id) => {
    setDeleteTrainer(deleteTrainer === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await clienteAxios.delete(`/entrenador/eliminar/${id}`);
      mostrarAlerta(data.msg, false);
      dataDeleted(id);
      setDeleteTrainer(null);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const { msg } = alerta;
  return (
    <>
      <div className="my-4 p-3 bg-white rounded-lg">
        <div className="p-2 grid  md:grid-cols-5 md:gap-5 items-center">
          <div className=" grid grid-cols-3 items-center md:flex  justify-between">
            <h1 className="col-span-2 gap-2 font-bold text-xl">Entrenadores</h1>
          </div>
        </div>
        <div className="relative grid overflow-x-auto">
          {msg && <Alerta alerta={alerta} />}
          <table className="min-w-full border border-gray-200 divide-y divide-gray-300 relative">
            <thead className="bg-gray-100 text-xs ">
              <tr className="text-center">
                <th className="p-2 text-gray-700 uppercase">#</th>
                <th className=" p-2 text-gray-700 uppercase">Foto</th>
                <th className=" p-2 text-gray-700 uppercase">Nombre</th>
                <th className=" p-2 text-gray-700 uppercase">Especialidad</th>
                <th className=" p-2 text-gray-700 uppercase">Telefono</th>
                <th className=" p-2 text-gray-700 uppercase">Email</th>
                <th className=" p-2 text-gray-700 uppercase">Activo</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
              {trainers.length > 0 ? (
                trainers.map((trainer, index) => (
                  <tr key={index} className="hover:bg-gray-100 ">
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 ">
                      <img
                        className="w-16 h-16 rounded-full ring-2 ring-red-800 "
                        src={trainer.img_secure_url}
                        alt="profile"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm  text-gray-700">
                      {`${trainer.nombre}  ${trainer.apellido_paterno} ${trainer.apellido_materno}`}
                    </td>
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      {trainer.especialidad}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {trainer.telefono}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-700">
                      {trainer.email}
                    </td>

                    <td className="px-6 py-3 text-sm  text-gray-700">
                      {/*Este es el boton para decir si está disponible o no, en onToggle, enviamos el valor de newValue para poder ejecutar el handleToggle en el parent component y que haga la validacion dentro de esa funcion, dentro de esa funcion se ejecutara handleAvaliable que esta aqui para cambiar la DB */}
                      <ToggleSwitch
                        avaliable={trainer.activo}
                        onToggle={(newValue) => {
                          handleAvaliable(trainer.id, newValue);
                        }}
                      />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 h-full">
                      <div className="flex items-center justify-center gap-4 h-full">
                        <button
                          className=" text-yellow-400 hover:text-yellow-600 transition-colors duration-300"
                          onClick={() => {
                            openModal("editar", trainer);
                          }}
                        >
                          <BsPencilFill className="text-2xl scale-hover" />
                        </button>
                        <button
                          className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
                          onClick={() => {
                            toggleDelete(trainer.id);
                          }}
                        >
                          <MdDelete className="text-3xl scale-hover" />
                        </button>
                        {/* Muestra recuadro de confirmacion */}
                        {deleteTrainer === trainer.id && (
                          <div className="absolute  mt-2 bg-white border rounded-lg shadow-lg w-56 z-10 p-4   right-10">
                            <h1 className="text-base  text-gray-700 mb-2">
                              ¿Seguro que deseas eliminar a
                              <span className="font-bold">
                                {" "}
                                {trainer.nombre}
                              </span>
                              ?
                            </h1>
                            <div className="flex justify-between">
                              <button
                                className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
                                onClick={() => setDeleteTrainer(false)}
                              >
                                Cancelar
                              </button>
                              <button
                                className="bg-rose-500 text-white py-1 px-3 rounded hover:bg-rose-600"
                                onClick={() => {
                                  handleDelete(trainer.id);
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-600 text-lg font-semibold"
                  >
                    No hay datos que mostrar!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

TablaEntrenadores.propTypes = {
  openModal: PropTypes.func,
  trainers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
      apellido_paterno: PropTypes.string,
      apellido_materno: PropTypes.string,
      especialidad: PropTypes.string,
      telefono: PropTypes.string,
      email: PropTypes.string,
      activo: PropTypes.bool,
      img_secure_url: PropTypes.string,
    })
  ),
  dataDeleted: PropTypes.func,
};

export default TablaEntrenadores;
