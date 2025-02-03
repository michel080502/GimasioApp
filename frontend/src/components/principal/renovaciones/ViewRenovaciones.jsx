import { RiFileExcel2Fill } from "react-icons/ri";
import { BsBootstrapReboot } from "react-icons/bs";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ModalRenovacion from "../../membresias/ModalRenovacion";
import PropTypes from "prop-types";
import Modal from "../../Modal";

const ViewRenovaciones = ({ membershipsClient }) => {
  const [renewalClient, setRenewalClient] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const dataFilter = () => {
    // Verificar que membershipsClient sea un arreglo
    if (!Array.isArray(membershipsClient)) {
      return [];
    }

    // Filtrar los datos con el estado 'Vence hoy'
    const resultado = membershipsClient.filter(
      (membership) => membership.estado === "Vence hoy"
    );

    // Retornar el resultado (vacío si no hay coincidencias)
    return resultado;
  };
  const openModal = (item) => {
    setRenewalClient(item);
    setActiveModal(item.compra_id);
  };

  const closeModal = () => setActiveModal(null);
  return (
    <div className="px-4 grid gap-2">
      <h1 className="text-2xl font-bold">Membresias que vencen hoy</h1>
      <p>
        Hoy dejan de tener acceso los siguientes clientes, pidele que renueve
      </p>

      <div className="bg-white p-3 rounded-lg shadow-lg">
        <div className="px-10 flex justify-between">
          <div className=" grid grid-cols-3 items-center md:flex  justify-between">
            <div className="col-span-2 gap-2">
              <h1 className=" font-bold text-xl">Vencieron hoy</h1>
              <p>
                <span>{dataFilter().length}</span> membresias
              </p>
            </div>

            <div className="flex md:hidden w-full md:w-0 items-center">
              <button className="w-full m-2 bg-black rounded-lg text-white hover:bg-red-900  hover:scale-110 p-2 transition-all duration-300">
                <RiFileExcel2Fill className="m-auto text-2xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
            <thead className="bg-gray-100 text-xs ">
              <tr className="text-center">
                <th className="px-5 py-2 text-gray-700 uppercase">#</th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Foto cliente
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Nombre cliente
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">Telefono</th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Tipo membresia
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Fecha de compra
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">Precio</th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Acciones rapidas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
              {dataFilter().length != 0 ? (
                dataFilter().map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100 ">
                    <td className="px-6 py-2 text-sm  text-gray-700">
                      <p>{index + 1}</p>
                    </td>

                    <td className="px-6 py-2 text-sm  text-gray-700">
                      <img
                        className="w-16 h-16 rounded-full ring-2 ring-red-800 m-auto"
                        src={item.cliente_img_secure_url}
                        alt="profile"
                      />
                    </td>
                    <td className="px-6 py-2 text-sm  text-gray-700">
                      <p>{`${item.cliente_nombre} ${item.cliente_apellido_paterno} ${item.cliente_apellido_materno}`}</p>
                    </td>
                    <td className="px-6 py-2 text-sm  text-gray-700">
                      <p>{item.cliente_telefono}</p>
                    </td>
                    <td className="px-6 py-2 text-sm  text-gray-700">
                      <p>{item.membresia_nombre}</p>
                    </td>
                    <td className="px-6 py-2 text-sm  text-gray-700">
                      <p>
                        {format(
                          new Date(item.fecha_compra),
                          "dd 'de' MMMM, yyyy",
                          { locale: es }
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-2 text-sm  text-gray-700">
                      <p>${item.membresia_precio}</p>
                    </td>
                    <td className="px-6 py-2 text-sm  text-gray-700">
                      <button
                        className="text-blue-400 hover:text-blue-700 transition-colors duration-300"
                        onClick={() => openModal(item)}
                      >
                        <BsBootstrapReboot className="text-3xl" />
                      </button>
                      {/* MODAL RENOVACION */}
                      {activeModal === item.compra_id && ( // Verifica si el modal es para este item
                        <Modal closeModal={closeModal}>
                          <ModalRenovacion
                            closeModal={closeModal}
                            renewalClient={renewalClient}
                          />
                        </Modal>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-2 text-sm  text-gray-700">
                    No se encontraron datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

ViewRenovaciones.propTypes = {
  membershipsClient: PropTypes.array,
};

export default ViewRenovaciones;
