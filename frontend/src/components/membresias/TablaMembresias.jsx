import { MdDelete } from "react-icons/md";
import { BsPencilFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { useState } from "react";
import ToggleSwitch from "../ui/ToggleSwitch";
import clienteAxios from "../../config/axios";
import Alerta from "../Alerta";
const TablaMembresias = ({
  openModal,
  membresias,
  formatoPrecio,
  dataDeleted,
}) => {
  const [deleteMembresia, setDeleteMembresia] = useState(null);
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
        `/membresia/actualizar-disponible/${id}`,
        { disponible: newValue }
      );
      mostrarAlerta(data.msg, false);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };
  const toggleDelete = (id) => {
    setDeleteMembresia(deleteMembresia === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await clienteAxios.delete(`/membresia/eliminar/${id}`);
      mostrarAlerta(data.msg, false);
      dataDeleted(id);
      setDeleteMembresia(null);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const { msg } = alerta;

  return (
    <div className="my-4 p-3 bg-white rounded-lg">
      <div className="p-2 grid md:flex justify-between gap-2 md:gap-5">
        <div className=" grid grid-cols-3 items-center md:flex  justify-between">
          <h1 className="col-span-2 gap-2 font-bold text-xl">
            Tipos membresia
          </h1>
        </div>
      </div>
      <div className="relative grid overflow-x-auto">
        {msg && <Alerta alerta={alerta} />}

        <table className=" min-w-full border border-gray-200 divide-y divide-gray-300 ">
          <thead className="bg-gray-100 text-xs ">
            <tr className="text-center">
              <th className="px-5 py-2 text-gray-700 uppercase">#</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Tipo</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Beneficios</th>
              <th className="px-5 py-2 text-gray-700 uppercase">
                Días de duración
              </th>
              <th className="px-5 py-2 text-gray-700 uppercase">Precio</th>

              <th className="px-5 py-2 text-gray-700 uppercase">Disponible</th>

              <th className="px-5 py-2 text-gray-700 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
            {membresias.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-4 text-center text-gray-600 text-lg font-semibold"
                >
                  No hay datos que mostrar!
                </td>
              </tr>
            ) : (
              membresias.map((membresia, index) => (
                <tr key={index} className="hover:bg-gray-100 ">
                  <td className="px-6 py-4 text-sm  text-gray-700">
                    <p>{index + 1}</p>
                  </td>

                  <td className="px-6 py-4 text-sm  text-gray-700">
                    <p>{membresia.nombre}</p>
                  </td>
                  <td className="px-6 py-4 text-sm  text-gray-700">
                    <ul className="list-inside list-disc">
                      {membresia.beneficios.map((beneficio, index) => (
                        <li key={index}>{beneficio}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-sm  text-gray-700">
                    <p>{membresia.duracion_dias}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p>{formatoPrecio.format(membresia.precio)}</p>
                  </td>

                  <td className="px-6 py-4 text-sm  text-gray-700">
                    {/*Este es el boton para decir si está disponible o no, en onToggle, enviamos el valor de newValue para poder ejecutar el handleToggle en el parent component y que haga la validacion dentro de esa funcion, dentro de esa funcion se ejecutara handleAvaliable que esta aqui para cambiar la DB */}
                    <ToggleSwitch
                      avaliable={membresia.disponible}
                      onToggle={(newValue) => {
                        handleAvaliable(membresia.id, newValue);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 h-full">
                    <div className="flex items-center justify-center gap-4 h-full">
                      <button
                        className=" text-yellow-400 hover:text-yellow-600 transition-colors duration-300"
                        onClick={() => {
                          openModal("editar", membresia);
                        }}
                      >
                        <BsPencilFill className="text-2xl scale-hover" />
                      </button>
                      <button
                        className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
                        onClick={() => {
                          toggleDelete(membresia.id);
                        }}
                      >
                        <MdDelete className="text-3xl scale-hover" />
                      </button>
                      {/* Muestra recuadro de confirmacion */}
                      {deleteMembresia === membresia.id && (
                        <div className="absolute  mt-2 bg-white border rounded-lg shadow-lg w-56 z-10 p-4   right-10">
                          <h1 className="text-base text-gray-700 mb-2">
                            ¿Seguro que deseas eliminar membresia{" "}
                            <span className="font-bold">
                              {membresia.nombre}
                            </span>
                            ?
                          </h1>
                          <div className="flex justify-between">
                            <button
                              className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
                              onClick={() => setDeleteMembresia(null)}
                            >
                              Cancelar
                            </button>
                            <button
                              className="bg-rose-500 text-white py-1 px-3 rounded hover:bg-rose-600"
                              onClick={() => {
                                handleDelete(membresia.id);
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TablaMembresias.propTypes = {
  openModal: PropTypes.func,
  membresias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string,
      beneficios: PropTypes.array,
      duracion_dias: PropTypes.number,
      precio: PropTypes.number,
      disponible: PropTypes.bool,
    })
  ),
  formatoPrecio: PropTypes.instanceOf(Intl.NumberFormat),
  dataDeleted: PropTypes.func,
};
export default TablaMembresias;
