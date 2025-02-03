import { format } from "date-fns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const AsistenciasMembresia = ({ attendances }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const today = new Date();
    const date = today.toLocaleDateString("es-ES"); // Fecha en formato local
  
    const filterData = () => {
      return attendances.filter((e) => {
        const eDate = new Date(e.fecha_asistencia).toLocaleDateString("es-ES");
        return eDate === date;
      });
    };
  
    setData(filterData());
  }, [attendances]);
  
  return (
    <div className="bg-white p-2 rounded-lg shadow-lg">
      <div>
        <h1 className="font-medium text-xl p-2">Asistencias con membresia</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
          <thead className="bg-gray-100 text-xs ">
            <tr className="text-center">
              <th className="px-3 py-2 text-gray-700 uppercase">#</th>
              <th className="px-3 py-2 text-gray-700 uppercase">
                Foto cliente
              </th>
              <th className="px-3 py-2 text-gray-700 uppercase">
                Nombre cliente
              </th>
              <th className="px-3 py-2 text-gray-700 uppercase">Telefono</th>
              <th className="px-3 py-2 text-gray-700 uppercase">Matricula</th>
              <th className="px-3 py-2 text-gray-700 uppercase">Hora</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm  text-gray-700">
                  No hay visitas hasta ahora
                </td>
              </tr>
            ) : (
              data.map((asistencia, index) => (
                <tr key={index} className="hover:bg-gray-100 ">
                  <td className="px-3 py-2 text-sm  text-gray-700">
                    <p>{index + 1}</p>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700">
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
  );
};

AsistenciasMembresia.propTypes = {
  attendances: PropTypes.array,
};

export default AsistenciasMembresia;
