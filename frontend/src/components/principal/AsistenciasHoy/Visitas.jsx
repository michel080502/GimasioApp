import { format } from "date-fns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
const Visitas = ({ salesVisit }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const filterSalesVisit = () => {
      const date = new Date().toISOString().split("T")[0]; // Obtiene la fecha actual en formato 'YYYY-MM-DD'
      return salesVisit.filter((visit) => {
        const visitDate = new Date(visit.fecha_visita)
          .toISOString()
          .split("T")[0]; // Convierte la fecha de la visita
        return visitDate === date; // Compara solo la parte de la fecha sin la hora
      });
    };

    const info = filterSalesVisit() || [];
    setData(info);
  }, [salesVisit]);
  return (
    <div className="bg-white p-2 rounded-lg shadow-lg">
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
              <th className="px-2 py-2 text-gray-700 uppercase">Hora visita</th>

              <th className="px-2 py-2 text-gray-700 uppercase">Precio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
            {data.length > 0 ? (
              data.map((item, index) => (
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
                  No hay visitas de hoy
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Visitas.propTypes = {
  salesVisit: PropTypes.array,
};
export default Visitas;
