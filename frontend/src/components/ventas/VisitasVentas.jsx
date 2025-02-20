import { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const VisitasVentas = () => {
  const [visits, setVisits] = useState([]);
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    const getAttendances = async () => {
      try {
        const { data } = await clienteAxios("/cliente/asistencias");
        setAttendances(data);
      } catch (error) {
        console.error(error);
        setAttendances([]);
      }
    };
    const getVisits = async () => {
      try {
        const { data } = await clienteAxios("/compra/ventas-visitas");
        setVisits(data);
      } catch (error) {
        console.error(error);
        setVisits([]);
      }
    };
    getAttendances();
    getVisits();
  }, []);

  return (
    <div className="grid grid-cols-5 gap-3 ">
      <div className="col-span-2 bg-white p-2 rounded-lg shadow-lg">
        <div>
          <h1 className="font-medium text-xl p-2">Visitas</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
            <thead className="bg-gray-100 text-xs ">
              <tr className="text-center">
                <th className="px-2 py-2 text-gray-700 uppercase">#</th>
                <th className="px-2 py-2 text-gray-700 uppercase">
                  Nombre cliente
                </th>
                <th className="px-2 py-2 text-gray-700 uppercase">Fecha</th>
                <th className="px-2 py-2 text-gray-700 uppercase">
                  Hora visita
                </th>
                <th className="px-2 py-2 text-gray-700 uppercase">Precio</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
              {visits.length > 0 ? (
                visits.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100 ">
                    <td className="px-2 py-3 text-sm  text-gray-700">
                      <p>{index + 1}</p>
                    </td>

                    <td className="px-2 py-3 text-sm  text-gray-700">
                      <p>{`${item.cliente.nombre} ${
                        item.cliente.apellidoPaterno || ""
                      } ${item.cliente.apellidoMaterno || ""}`}</p>
                    </td>
                    <td className="px-2 py-3 text-sm  text-gray-700">
                      <p>
                        {format(
                          new Date(item.fecha_visita),
                          "dd 'de' MMMM, yyyy",
                          {
                            locale: es,
                          }
                        )}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-sm  text-gray-700">
                      <p>
                        {format(new Date(item.fecha_visita), "hh:mm a", {
                          locale: es,
                        })}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-sm  text-gray-700">
                      <p>${item.precio}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-2 py-3 text-sm  text-gray-700">
                    No hay visitas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-span-3 bg-white p-2 rounded-lg shadow-lg">
        <div>
          <h1 className="font-medium text-xl p-2">Asistencias con membresia</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
            <thead className="bg-gray-100 text-xs ">
              <tr className="text-center">
                <th className="py-2 text-gray-700 uppercase">#</th>
                <th className=" py-2 text-gray-700 uppercase">Foto cliente</th>
                <th className="px-3 py-2 text-gray-700 uppercase">
                  Nombre cliente
                </th>
                <th className="px-3 py-2 text-gray-700 uppercase">Telefono</th>
                <th className="px-3 py-2 text-gray-700 uppercase">Matricula</th>
                <th className="px-3 py-2 text-gray-700 uppercase">Fecha</th>
                <th className="px-3 py-2 text-gray-700 uppercase">Hora</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-sm  text-gray-700">
                    No hay visitas hasta ahora
                  </td>
                </tr>
              ) : (
                attendances.map((asistencia, index) => (
                  <tr key={index} className="hover:bg-gray-100 ">
                    <td className="px-3 py-2 text-sm  text-gray-700">
                      <p>{index + 1}</p>
                    </td>
                    <td className=" py-2 text-sm text-gray-700">
                      <img
                        className="w-12 rounded-full ring-2 ring-red-800 m-auto"
                        src={asistencia.img_secure_url}
                        alt={"persona"}
                      />
                    </td>
                    <td className="px-3 py-4 text-sm  text-gray-700">
                      <p>{`${asistencia.nombre} ${asistencia.apellido_paterno} ${asistencia.apellido_paterno}`}</p>
                    </td>
                    <td className="px-3 py-4 text-sm  text-gray-700">
                      <p>{asistencia.telefono}</p>
                    </td>
                    <td className="px-3 py-4 text-sm  text-gray-700">
                      <p>{asistencia.matricula}</p>
                    </td>
                    <td className="px-3 py-4 text-sm  text-gray-700">
                      <p>
                        {format(
                          new Date(asistencia.fecha_asistencia),
                          "dd 'de' MMMM, yyyy",
                          { locale: es }
                        )}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-sm  text-gray-700">
                      <p>
                        {format(
                          new Date(asistencia.fecha_asistencia),
                          "hh:mm a",
                          { locale: es }
                        )}
                      </p>
                    </td>
                    {/* <td className="px-3 py-2 text-sm  text-gray-700">
                <button className="bg-gray-700 text-white rounded-lg hover:bg-black p-2 transform duration-300">Ver membresia</button>
              </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitasVentas;
