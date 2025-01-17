import { FaMoneyCheck } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import Modal from "./Modal";

import PropTypes from "prop-types";
import { useState } from "react";
import PointSellMembership from "./puntoVenta/membership/PointSellMembership";
import PointSellProducts from "./puntoVenta/productos/PointSellProducts";
import Checker from "./check-in/Checker";

const Header = ({ admin }) => {
  const [sellState, setSellState] = useState({ isOpen: false, option: null });

  const toggleOptionsSell = () =>
    setSellState((prev) => ({ ...prev, isOpen: !prev.isOpen }));

  const openOption = (option) => setSellState({ isOpen: false, option });

  const closeModal = () => setSellState({ isOpen: false, option: null });

  return (
    <div className=" hidden md:flex justify-between  bg-zinc-900 ">
      <h1 className=" text-white p-4 text-3xl font-semibold">
        Buenos días, <span className="font-bold">{`${admin.nombre}`}</span>
      </h1>
      <div className=" flex font-semibold text-xl items-center gap-4 px-5 divide-x">
        <button
          className={`flex gap-2 items-center p-1 text-white  hover:text-opacity-100 ${
            sellState.isOpen ? "text-opacity-100" : "text-opacity-50"
          } transform duration-150 `}
          onClick={toggleOptionsSell}
        >
          {" "}
          <FaShop /> Punto de venta
        </button>
        {sellState.isOpen && (
          <div className="absolute top-16 bg-white border border-gray-300 rounded shadow-lg w-52 z-10 -ml-7">
            <div className="flex flex-col divide-y divide-gray-400 text-lg">
              <button
                className=" p-2 text-left bg-gray-200  hover:bg-gray-600 hover:bg-opacity-20"
                onClick={() => {
                  openOption("membresias");
                }}
              >
                Membresias
              </button>
              <button
                className=" p-2 text-left bg-gray-200 hover:bg-gray-600 hover:bg-opacity-20"
                onClick={() => {
                  openOption("productos");
                }}
              >
                Productos
              </button>
            </div>
          </div>
        )}
        {sellState.option && (
          <Modal closeModal={closeModal}>
            <div className="flex justify-between  pb-3">
              <h2 className="text-2xl font-semibold">
                {sellState.option === "membresias"
                  ? "Punto de venta de membresias"
                  : sellState.option === "productos"
                  ? "Punto de venta de productos"
                  : "Acceso al gym"}
              </h2>
              <button className="text-red-700" onClick={closeModal}>
                <IoMdCloseCircle className="text-3xl" />
              </button>
            </div>
            {sellState.option === "membresias" && <PointSellMembership />}
            {sellState.option === "productos" && <PointSellProducts />}
            {sellState.option === "acceso" && <Checker />}
          </Modal>
        )}

        <button
          className="  flex  gap-2 items-center justify-center p-2 text-white text-opacity-50 hover:text-opacity-100 w-48  "
          onClick={() => {
            openOption("acceso");
          }}
        >
          {" "}
          <FaMoneyCheck /> Acceso
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  admin: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
  }).isRequired,
};

export default Header;
