import { VscDebugBreakpointUnsupported } from "react-icons/vsc";
import { CgEditBlackPoint } from "react-icons/cg";
import { TbPointFilled } from "react-icons/tb";
import { MdSell } from "react-icons/md";

import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const CardInforme = ({ typeTable, productos }) => {
  const [activeButton, setActiveButton] = useState(null);
  const [count, setCount] = useState({
    suficiente: 0,
    medio: 0,
    bajo: 0,
    total: 0,
  });

  useEffect(() => {
    const countStocks = () => {
      const suficiente = productos.filter(
        (producto) => producto.nivel_stock === "Suficiente"
      ).length;
      const medio = productos.filter(
        (producto) => producto.nivel_stock === "Medio"
      ).length;
      const bajo = productos.filter(
        (productos) => productos.nivel_stock === "Bajo"
      ).length;
      const total = productos.length;
      setCount({ suficiente, medio, bajo, total });
    };

    countStocks();
  }, [productos]);
  const handleButtonClick = (type) => {
    setActiveButton((prev) => (prev === type ? null : type));
    typeTable(type);
  };
  return (
    <>
      <div className="p-2 bg-white rounded-md shadow-lg shadow-gray-500/50 col-span-2">
        <div className="p-2 border-b-2 border-red-700 text-lg font-semibold flex justify-between items-center">
          <div>
            <h1>Informe de stock productos</h1>
            <p
              className={` text-sm font-normal ${
                activeButton !== null ? "" : "hidden"
              }`}
            >
              Para visualizar todos los tipos de productos de click al filtro de
              stock (<span className="font-semibold">{activeButton}</span>) de
              nuevo
            </p>
          </div>
          <MdSell />
        </div>

        <div className="grid grid-cols-3">
          <div className=" py-2 border-r-2 text-center items-center  font-semibold">
            <h2 className="text-2xl">{count.suficiente}</h2>
            <button
              type="button"
              className={`transition-all ease-out duration-300 hover:scale-110 ${
                activeButton === "suficiente" ? "scale-125" : ""
              }`}
              onClick={() => handleButtonClick("suficiente")}
            >
              <p className="grid justify-center text-center  text-sm items-center text-green-600 p-1">
                <CgEditBlackPoint className="m-auto text-xl" /> suficiente
              </p>
            </button>
          </div>
          <div className="py-2 border-r-2 text-center items-center  font-semibold">
            <h2 className="text-2xl">{count.medio}</h2>
            <button
              type="button"
              className={`transition-all ease-out duration-300 hover:scale-110 ${
                activeButton === "medio" ? "scale-125" : ""
              }`}
              onClick={() => handleButtonClick("medio")}
            >
              <p className="grid text-center justify-center text-sm  items-center text-orange-600 p-1">
                {" "}
                <VscDebugBreakpointUnsupported className="m-auto text-2xl" />
                medio
              </p>
            </button>
          </div>
          <div className="py-2  text-center items-center  font-semibold">
            <h2 className="text-2xl">{count.bajo}</h2>
            <button
              type="button"
              className={`transition-all ease-out duration-300 hover:scale-110 ${
                activeButton === "bajo" ? "scale-125" : ""
              }`}
              onClick={() => handleButtonClick("bajo")}
            >
              <p className="grid text-center justify-center text-sm items-center text-red-600 p-1">
                {" "}
                <TbPointFilled className="text-2xl m-auto" /> bajo
              </p>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-2 shadow-lg shadow-gray-500/50">
        <h1 className="text-lg p-2 border-b-2 border-red-700 ">
          Total Productos
        </h1>
        <div className="text-right p-2 grid gap-1 md:gap-3 items-center">
          <h2 className="text-3xl font-bold">{count.total}</h2>
          <p>productos en sistema</p>
        </div>
      </div>
    </>
  );
};

CardInforme.propTypes = {
  typeTable: PropTypes.func,
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
      marca: PropTypes.string,
      categoria: PropTypes.string,
      stock: PropTypes.number,
      precio: PropTypes.number,
      descuento: PropTypes.number,
      total: PropTypes.number,
      img_public_id: PropTypes.string,
      img_secure_url: PropTypes.string,
      disponible: PropTypes.bool,
      nivel_stock: PropTypes.string,
    })
  ),
};

export default CardInforme;
