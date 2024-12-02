import { BsCreditCard2FrontFill } from "react-icons/bs";
import { PiIdentificationCardFill } from "react-icons/pi";
import PropTypes from "prop-types";

const CardInforme = ({ typeTable }) => {
  return (
    <>
      <div className="p-2 bg-white rounded-md shadow-lg shadow-gray-500/50 col-span-2">
        <div className="p-2 border-b-2 border-red-700 text-lg font-semibold flex justify-between items-center">
          <h1>Informe de membresias</h1>
          <BsCreditCard2FrontFill />
        </div>

        <div className="grid grid-cols-3">
          <div className=" py-2 border-r-2 text-center items-center  font-semibold">
            <h2 className="text-2xl">34</h2>
            <button
              type="button"
              className="hover:scale-125 transition-all ease-out duration-300 "
              onClick={() => typeTable("activos")}
            >
              <p className="grid justify-center text-center  text-sm items-center text-green-600 p-1">
                {" "}
                <PiIdentificationCardFill className="m-auto text-2xl" /> activas
              </p>
            </button>
          </div>
          <div className="py-2 border-r-2 text-center items-center  font-semibold">
            <h2 className="text-2xl">34</h2>
            <button
              type="button"
              className="hover:scale-125 transition-all ease-out duration-300"
              onClick={() => typeTable("porVencer")}
            >
              <p className="grid text-center justify-center text-sm  items-center text-orange-600 p-1">
                {" "}
                <PiIdentificationCardFill className="m-auto text-2xl" />{" "}
                proximas a vencer
              </p>
            </button>
          </div>
          <div className="py-2  text-center items-center  font-semibold">
            <h2 className="text-2xl">34</h2>
            <button
              type="button"
              className="hover:scale-125 transition-all ease-out duration-300"
              onClick={() => typeTable("vencenHoy")}
            >
              <p className="grid text-center justify-center text-sm items-center text-red-800 p-1">
                {" "}
                <PiIdentificationCardFill className="text-2xl m-auto" /> vencen
                hoy
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
