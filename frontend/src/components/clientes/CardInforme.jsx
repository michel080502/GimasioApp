import PropTypes from "prop-types";
import {
  BsFillPersonLinesFill,
  BsFillPersonCheckFill,
  BsFillPersonDashFill,
} from "react-icons/bs";
import { HiMiniUsers } from "react-icons/hi2";
import { useState } from "react";

const CardInforme = ({ clientes, typeData }) => {
  const [activeFilter, setActiveFilter] = useState("");

  const nuevos = clientes.filter((cliente) => cliente.estado === "nuevo");
  const activos = clientes.filter((cliente) => cliente.estado === "activo");
  const vencidos = clientes.filter((cliente) => cliente.estado === "vencido");

  const handleButtonClick = (filter) => {
    if (activeFilter === filter) {
      setActiveFilter("");
      typeData("");
    } else {
      setActiveFilter(filter);
      typeData(filter);
    }
  };
  return (
    <>
      <div className="p-2 bg-white rounded-md shadow-lg shadow-gray-500/50 col-span-2">
        <div className="p-2 border-b-2 border-red-700 text-lg font-semibold flex justify-between items-center">
          <h1>Informe de clientes</h1>
          <HiMiniUsers />
        </div>

        <div className="grid grid-cols-3">
          <div className="py-3 border-r-2 text-center items-center  font-semibold">
            <h2 className="text-2xl">{nuevos.length}</h2>
            <button
              type="button"
              className="hover:scale-125 transition-all ease-out duration-300 "
              onClick={() => handleButtonClick("nuevo")}
            >
              <p className="grid justify-center text-center  text-sm items-center text-blue-600 p-1">
                <BsFillPersonLinesFill className="m-auto text-2xl" /> Nuevos
              </p>
            </button>
          </div>
          <div className="py-3 border-r-2 text-center items-center  font-semibold">
            <h2 className="text-2xl">{activos.length}</h2>
            <button
              type="button"
              className="hover:scale-125 transition-all ease-out duration-300 "
              onClick={() => handleButtonClick("activo")}
            >
              <p className="grid justify-center text-center  text-sm items-center  text-green-600 p-1">
                <BsFillPersonCheckFill className="m-auto text-2xl" /> Activos
              </p>
            </button>
          </div>
          <div className="py-3  text-center items-center  font-semibold">
            <h2 className="text-2xl">{vencidos.length}</h2>
            <button
              type="button"
              className="hover:scale-125 transition-all ease-out duration-300 "
              onClick={() => handleButtonClick("vencido")}
            >
              <p className="grid justify-center text-center  text-sm items-center text-red-800 p-1">
                <BsFillPersonDashFill className="m-auto text-2xl" /> Vencido
              </p>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-3 shadow-lg shadow-gray-500/50">
        <h1 className="text-2xl p-2 border-b-2 border-red-700 ">
          Total clientes
        </h1>
        <div className="text-right p-2">
          <h2 className="text-4xl font-bold">{clientes.length}</h2>
          <p>clientes registrados</p>
        </div>
      </div>
    </>
  );
};

CardInforme.propTypes = {
  typeData: PropTypes.func,
  clientes: PropTypes.array,
};

export default CardInforme;
