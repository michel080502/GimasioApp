import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const CardsPrincipales = ({
  typeView,
  view,
  membershipsClient,
  products,
  salesVisit,
  salesProduct,
  attendances,
}) => {
  const [count, setCount] = useState({
    memberships: 0,
    productos: 0,
    visit: 0,
    totalSales: 0.0,
    attendancesTotal: 0,
  });

  useEffect(() => {
    const today = new Date();
    const date = today.toLocaleDateString("es-ES"); // Fecha en formato local

    const filterSalesProduct = () => {
      return salesProduct
        .filter((sale) => {
          const saleDate = new Date(sale.fecha_venta).toLocaleDateString(
            "es-ES"
          );
          return saleDate === date;
        })
        .reduce((acc, sale) => acc + Number(sale.total), 0); // Suma los valores de `total`
    };

    const filterAttendances = () => {
      return attendances.filter((attendance) => {
        const attendanceDate = new Date(
          attendance.fecha_asistencia
        ).toLocaleDateString("es-ES");
        return attendanceDate === date;
      }).length;
    };

    const filterSalesVisit = () => {
      return salesVisit.filter((visit) => {
        const visitDate = new Date(visit.fecha_visita).toLocaleDateString(
          "es-ES"
        );
        return visitDate === date;
      }).length; // Devuelve la cantidad de visitas de hoy
    };

    const count = () => {
      const memberships = membershipsClient.filter(
        (membership) => membership.estado === "Vence hoy"
      ).length;

      const productos = products.filter(
        (product) => product.nivel_stock === "Bajo"
      ).length;

      const visit = filterSalesVisit();
      const totalSales = filterSalesProduct(); // Ahora devuelve la suma total
      const attendancesTotal = filterAttendances();
      setCount({ memberships, productos, visit, totalSales, attendancesTotal });
    };

    count();
  }, [membershipsClient, products, salesVisit, salesProduct, attendances]);
  return (
    <div className="p-3 overflow-x-auto md:overflow-hidden no-select">
      <div className="flex w-auto space-x-4 md:grid md:grid-cols-4 md:gap-1">
        <div
          className={`w-44 flex-shrink-0 md:w-auto  p-4 rounded-xl shadow-lg shadow-gray-500/50 cursor-pointer transition duration-300 ${
            view === "asistencias-dia" ? "bg-gray-900 text-white" : "bg-white"
          }`}
          onClick={() => {
            typeView("asistencias-dia");
          }}
        >
          <div className="flex justify-between items-center border-b-2 border-red-600 p-3 mb-2">
            <p className="font-semibold">Asistencias del día</p>
            <button
              className="text-2xl scale-hover"
              onClick={(e) => {
                e.stopPropagation();
              }}
            ></button>
          </div>
          <div className="p-2 grid gap-3 text-right">
            <h3 className="font-bold text-3xl">
              {count.visit + count.attendancesTotal}
            </h3>
            <p className="font-light text-sm">Hasta ahora</p>
          </div>
        </div>

        <div
          className={`w-44 flex-shrink-0 md:w-auto  p-4 rounded-xl shadow-lg shadow-gray-500/50 cursor-pointer transition duration-300 ${
            view === "renovaciones" ? "bg-gray-900 text-white" : "bg-white"
          }`}
          onClick={() => {
            typeView("renovaciones");
          }}
        >
          <div className="flex justify-between items-center border-b-2 border-red-600 p-3 mb-2">
            <p className="font-semibold">Vencen hoy</p>
            <button
              className="text-2xl scale-hover"
              onClick={(e) => {
                e.stopPropagation();
              }}
            ></button>
          </div>
          <div className="p-2 grid gap-3 text-right">
            <h3 className="font-bold text-3xl">{count.memberships}</h3>
            <p className="font-light text-sm">Necesitan ser renovadas hoy</p>
          </div>
        </div>

        <div
          className={`w-44 flex-shrink-0 md:w-auto  p-4 rounded-xl shadow-lg shadow-gray-500/50 cursor-pointer transition duration-300 ${
            view === "re-stock" ? "bg-gray-900 text-white" : "bg-white"
          }`}
          onClick={() => {
            typeView("re-stock");
          }}
        >
          <div className="flex justify-between items-center border-b-2 border-red-600 p-3 mb-2">
            <p className="font-semibold">Re-Stock</p>
            <button
              className="text-2xl scale-hover"
              onClick={(e) => {
                e.stopPropagation();
              }}
            ></button>
          </div>
          <div className="p-2 grid gap-3 text-right">
            <h3 className="font-bold text-3xl">{count.productos}</h3>
            <p className="font-light text-sm">
              Productos necesitan suministros
            </p>
          </div>
        </div>

        <div
          className={`w-44 flex-shrink-0 md:w-auto  p-4 rounded-xl shadow-lg shadow-gray-500/50 cursor-pointer transition duration-300 ${
            view === "productos" ? "bg-gray-900 text-white" : "bg-white"
          }`}
          onClick={() => {
            typeView("productos");
          }}
        >
          <div className="flex justify-between items-center border-b-2 border-red-600 p-3 mb-2 ">
            <p className="font-semibold">Ventas de productos de hoy</p>
            <button
              className="text-2xl scale-hover"
              onClick={(e) => {
                e.stopPropagation();
              }}
            ></button>
          </div>
          <div className="p-2 grid gap-3 text-right">
            <h3 className="font-bold text-3xl">${count.totalSales}</h3>
            <p className="font-light text-sm">Acumulados hasta el momento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

CardsPrincipales.propTypes = {
  typeView: PropTypes.func,
  view: PropTypes.string,
  membershipsClient: PropTypes.array,
  products: PropTypes.array,
  salesVisit: PropTypes.array,
  salesProduct: PropTypes.array,
  attendances: PropTypes.array,
};

export default CardsPrincipales;
