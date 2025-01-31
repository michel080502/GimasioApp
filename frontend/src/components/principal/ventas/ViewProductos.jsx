import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
const ViewProductos = ({ salesProduct }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const date = new Date().toISOString().split("T")[0]; // Fecha actual en formato 'YYYY-MM-DD'
    const filterData = () => {
      return salesProduct.filter((sale) => {
        const saleDate = new Date(sale.fecha_venta).toISOString().split("T")[0];
        return saleDate === date;
      });
    };

    setData(filterData());
  }, [salesProduct]);
  return (
    <div className="px-4 grid gap-2">
      <h1 className="text-2xl font-bold">Ventas de productos de hoy</h1>

      <div className="bg-white p-3 rounded-lg shadow-lg">
        <div className="relative overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-300 ">
            <thead className="bg-gray-100 text-xs ">
              <tr className="text-center">
                <th className="px-5 py-2 text-gray-700 uppercase">#</th>

                <th className="px-5 py-2 text-gray-700 uppercase">
                  Nombre cliente
                </th>

                <th className="px-5 py-2 text-gray-700 uppercase">Productos</th>

                <th className="px-5 py-2 text-gray-700 uppercase">
                  Hora de compra
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className=" text-sm text-gray-700">
                    No hay ventas aún
                  </td>
                </tr>
              ) : (
                data.map((venta, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className=" text-sm text-gray-700">{index + 1}</td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {`${venta.cliente.nombre} ${
                        venta.cliente.apellido_paterno || ""
                      } ${venta.cliente.apellido_materno || ""}`}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      <ul className="">
                        {venta.detalles_productos.map((producto, i) => (
                          <li key={i}>{producto.nombre_producto}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {format(new Date(venta.fecha_venta), "hh:mm a", {
                        locale: es,
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ${venta.total}
                    </td>
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

ViewProductos.propTypes = {
  salesProduct: PropTypes.array,
};

export default ViewProductos;
