import AsistenciasMembresia from "./AsistenciasMembresia";
import Visitas from "./Visitas";

const ViewAsistenciasHoy = () => {
  return (
    <>
      <div className="p-4 grid gap-2">
        <h1 className="text-3xl font-bold">Asistencias del día de hoy</h1>

        <div className="grid gap-3 grid-cols-5">
          <div className="col-span-2">
            <Visitas />
          </div>
          <div className="col-span-3">
            <AsistenciasMembresia />
          </div>
        </div>
        
      </div>
    </>
  );
};

export default ViewAsistenciasHoy;
