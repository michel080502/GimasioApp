import { useState } from "react";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import { PiIdentificationCardFill } from "react-icons/pi";
import PropTypes from "prop-types";

const CardInforme = ({ typeTable }) => {
  const [activeButton, setActiveButton] = useState(null);

  // Manejar el clic en los botones
  const handleButtonClick = (type) => {
    setActiveButton((prev) => (prev === type ? null : type)); // Alterna el estado
    typeTable(type);
  };

  return (
    <>
      <div className="p-2 bg-white rounded-md shadow-lg shadow-gray-500/50 col-span-2">
        <div className="p-2 border-b-2 border-red-700 text-lg font-semibold flex justify-between items-center">
          <div>
            <h1>Informe de membresias</h1>
            <p className={` text-sm font-normal ${activeButton !== null ? "": "hidden"}`}>
              Para visualizar todos los tipos de membresia de click al filtro (<span className="font-semibold">{activeButton}</span>) de nuevo
            </p>
          </div>
          <BsCreditCard2FrontFill />
        </div>

        <div className="grid grid-cols-4">
          {/* Botón Activas */}
          <div className="py-2 border-r-2 text-center items-center font-semibold">
            <h2 className="text-2xl">34</h2>
            <button
              type="button"
              className={`transition-all ease-out duration-300 ${
                activeButton === "Activas" ? "scale-125" : ""
              }`}
              onClick={() => handleButtonClick("Activas")}
            >
              <p className="grid justify-center text-center text-sm items-center text-green-600 p-1">
                <PiIdentificationCardFill className="m-auto text-2xl" /> activas
              </p>
            </button>
          </div>

          {/* Botón Próximas a vencer */}
          <div className="py-2 border-r-2 text-center items-center font-semibold">
            <h2 className="text-2xl">34</h2>
            <button
              type="button"
              className={`transition-all ease-out duration-300 ${
                activeButton === "Proximas a vencer" ? "scale-125" : ""
              }`}
              onClick={() => handleButtonClick("Proximas a vencer")}
            >
              <p className="grid text-center justify-center text-sm items-center text-orange-600 p-1">
                <PiIdentificationCardFill className="m-auto text-2xl" />{" "}
                próximas a vencer
              </p>
            </button>
          </div>

          {/* Botón Vencen hoy */}
          <div className="py-2 border-r-2 text-center items-center font-semibold">
            <h2 className="text-2xl">34</h2>
            <button
              type="button"
              className={`transition-all ease-out duration-300 ${
                activeButton === "Vencen hoy" ? "scale-125" : ""
              }`}
              onClick={() => handleButtonClick("Vencen hoy")}
            >
              <p className="grid text-center justify-center text-sm items-center text-red-800 p-1">
                <PiIdentificationCardFill className="text-2xl m-auto" /> vencen
                hoy
              </p>
            </button>
          </div>

          {/* Botón Vencidas */}
          <div className="py-2 text-center items-center font-semibold">
            <h2 className="text-2xl">34</h2>
            <button
              type="button"
              className={`transition-all ease-out duration-300 ${
                activeButton === "Vencidas" ? "scale-125" : ""
              }`}
              onClick={() => handleButtonClick("Vencidas")}
            >
              <p className="grid text-center justify-center text-sm items-center text-gray-800 p-1">
                <PiIdentificationCardFill className="text-2xl m-auto" />{" "}
                vencidas
              </p>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-2 shadow-lg shadow-gray-500/50">
        <h1 className="text-lg p-2 border-b-2 border-red-700 ">
          Tipos de membresia
        </h1>
        <div className="text-right p-2 grid gap-1 md:gap-3 items-center">
          <h2 className="text-3xl font-bold">5</h2>
          <p>membresias en sistema</p>
        </div>
      </div>
    </>
  );
};

CardInforme.propTypes = {
  typeTable: PropTypes.func,
};

export default CardInforme;
