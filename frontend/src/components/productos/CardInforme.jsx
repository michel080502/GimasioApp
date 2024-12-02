import { VscDebugBreakpointUnsupported } from "react-icons/vsc";
import { CgEditBlackPoint } from "react-icons/cg";
import { TbPointFilled } from "react-icons/tb";
import { MdSell } from "react-icons/md";
const CardInforme = () => {
  return (
    <>
      <div className="p-2 bg-white rounded-md shadow-lg shadow-gray-500/50 col-span-2">
        <div className="p-2 border-b-2 border-red-700 text-lg font-semibold flex justify-between items-center">
          <h1>Informe de stock de productos</h1>
          <MdSell />
        </div>

        <div className="grid grid-cols-3">
          <div className=" py-2 border-r-2 text-center items-center  font-semibold">
            <h2 className="text-2xl">34</h2>
            <p className="grid justify-center text-center  text-sm items-center text-green-600 p-1">
              {" "}
              <CgEditBlackPoint className="m-auto text-xl" /> suficiente stock
            </p>
          </div>
          <div className="py-2 border-r-2 text-center items-center  font-semibold">
            <h2 className="text-2xl">34</h2>
            <p className="grid text-center justify-center text-sm  items-center text-orange-600 p-1">
              {" "}
              <VscDebugBreakpointUnsupported className="m-auto text-2xl" />{" "}
              stock medio
            </p>
          </div>
          <div className="py-2  text-center items-center  font-semibold">
            <h2 className="text-2xl">34</h2>
            <p className="grid text-center justify-center text-sm items-center text-red-800 p-1">
              {" "}
              <TbPointFilled className="text-2xl m-auto" /> sin stock
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-2 shadow-lg shadow-gray-500/50">
        <h1 className="text-lg p-2 border-b-2 border-red-700 ">
          Total Productos
        </h1>
        <div className="text-right p-2 grid gap-1 md:gap-3 items-center">
          <h2 className="text-3xl font-bold">300</h2>
          <p>productos en sistema</p>
        </div>
      </div>
    </>
  );
};

export default CardInforme;
