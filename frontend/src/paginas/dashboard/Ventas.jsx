import { BsFillCaretDownFill } from "react-icons/bs";
import { useState } from "react";
import ProductosVentas from "../../components/ventas/ProductosVentas";
import MembresiasVentas from "../../components/ventas/MembresiasVentas";
import VisitasVentas from "../../components/ventas/VisitasVentas";
const Ventas = () => {
  const [optionsFilter, setOptionsFilter] = useState(null);
  const [filter, setFilter] = useState("productos");



  const toggleOptionsFilter = () => {
    setOptionsFilter((prev) => !prev);
  };

  return (
    <div className="p-6 grid gap-2">
      <div className=" flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <span className="text-gray-600">Reportes /</span> Ventas
        </h1>
        <button
          className={`m-2 bg-black rounded-lg text-white font-bold hover:bg-red-900  hover:scale-110 p-2 transition-all duration-300 flex items-center gap-2 ${optionsFilter ? "scale-110 bg-red-600" : ""}`}
          onClick={toggleOptionsFilter}
        >
          <BsFillCaretDownFill />
          Filtros
        </button>
        {/* RECUADRO CON OPCIONES DE TIPO DE REPORTES */}
        {optionsFilter && (
          <>
            <div className="absolute mt-40 bg-white border border-gray-300 rounded shadow-lg w-48 right-3 ">
              <div>
                <ul className="divide-y divide-gray-500">
                  <li className="p-2 bg-gray-700 bg-opacity-25 hover:bg-opacity-30 font-semibold hover:font-bold hover:cursor-pointer"
                  onClick={() => {setFilter("productos")}}>
                    Productos
                  </li>
                  <li className="p-2 bg-gray-700 bg-opacity-25 hover:bg-opacity-30 font-semibold hover:font-bold hover:cursor-pointer"
                  onClick={() => {setFilter("membresias")}}>
                    Membresias
                  </li>
                  <li className="p-2 bg-gray-700 bg-opacity-25 hover:bg-opacity-30 font-semibold hover:font-bold hover:cursor-pointer"
                  onClick={() => {setFilter("visitas")}}>
                    Visitas / Asistencias
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
       
      </div>
      {filter === "productos" && (
        <ProductosVentas />
      )}
      {filter === "membresias" && (
        <MembresiasVentas />
      )}
      {filter === "visitas" && (
        <VisitasVentas />
      )}
      
    </div>
  );
};

export default Ventas;
