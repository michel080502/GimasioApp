import PropTypes from "prop-types";
import { BsCloudArrowDownFill, BsEnvelopeArrowUpFill } from "react-icons/bs";

const MenuExport = ({ onDownload, onSendReport }) => {
  return (
    <div className="absolute mt-28 right-32 bg-white border border-gray-300 rounded shadow-lg w-48 z-10 ">
      <div className="flex flex-col divide-y divide-gray-400 text-base">
        <button
          className="flex justify-between text-center items-center bg-gray-200 py-1 px-3  hover:bg-gray-600 hover:bg-opacity-20"
          onClick={onDownload}
        >
          <BsCloudArrowDownFill />
          Descargar
        </button>
        <button
          className=" flex justify-between text-center items-center bg-gray-200 py-1 px-3  hover:bg-gray-600 hover:bg-opacity-20"
          onClick={onSendReport}
        >
          <BsEnvelopeArrowUpFill />
          Enviar reporte a admin
        </button>
      </div>
    </div>
  );
};

MenuExport.propTypes = {
  onDownload: PropTypes.func,
  onSendReport: PropTypes.func,
};

export default MenuExport;
