import { RiFileExcel2Fill } from "react-icons/ri";
const CardsPrincipales = () => {
  return (
    <div className="p-3 overflow-x-auto md:overflow-hidden">
      <div className="flex w-auto space-x-4 md:grid md:grid-cols-4 md:gap-1">
        <div className="w-44 flex-shrink-0 md:w-auto bg-white p-4 rounded-xl shadow-lg shadow-gray-500/50">
          <div className="flex justify-between items-center border-b-2 border-red-600 p-3 mb-2">
            <p className="font-semibold">Ingresos del día</p>
            <button className="text-2xl scale-hover">
              <RiFileExcel2Fill />
            </button>
          </div>
          <div className="p-2 grid gap-3 text-right">
            <h3 className="font-bold text-3xl">$3000.00</h3>
            <p className="font-light text-sm">Acumulados hasta el momento</p>
          </div>
        </div>

        <div className="w-44 flex-shrink-0 md:w-auto bg-white p-4 rounded-xl shadow-lg shadow-gray-500/50">
          <div className="flex justify-between items-center border-b-2 border-red-600 p-3 mb-2">
            <p className="font-semibold">Visitas del día</p>
            <button className="text-2xl scale-hover">
              <RiFileExcel2Fill />
            </button>
          </div>
          <div className="p-2 grid gap-3 text-right">
            <h3 className="font-bold text-3xl">50</h3>
            <p className="font-light text-sm">Hasta ahora</p>
          </div>
        </div>

        <div className="w-44 flex-shrink-0 md:w-auto bg-white p-4 rounded-xl shadow-lg shadow-gray-500/50">
          <div className="flex justify-between items-center border-b-2 border-red-600 p-3 mb-2">
            <p className="font-semibold">Clientes activos</p>
            <button className="text-2xl scale-hover">
              <RiFileExcel2Fill />
            </button>
          </div>
          <div className="p-2 grid gap-3 text-right">
            <h3 className="font-bold text-3xl">60</h3>
            <p className="font-light text-sm">Membresías activas</p>
          </div>
        </div>

        <div className="w-44 flex-shrink-0 md:w-auto bg-white p-4 rounded-xl shadow-lg shadow-gray-500/50">
          <div className="flex justify-between items-center border-b-2 border-red-600 p-3 mb-2">
            <p className="font-semibold">Re-Stock</p>
            <button className="text-2xl scale-hover">
              <RiFileExcel2Fill />
            </button>
          </div>
          <div className="p-2 grid gap-3 text-right">
            <h3 className="font-bold text-3xl">40</h3>
            <p className="font-light text-sm">
              Productos necesitan suministros
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsPrincipales;
