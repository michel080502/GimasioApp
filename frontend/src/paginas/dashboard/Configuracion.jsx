import AdministradorConfig from "../../components/configuracion/AdministradorConfig";
import GimnasioConfig from "../../components/configuracion/GimnasioConfig";

import useAuth from "../../hooks/useAuth";
const Configuracion = () => {
  const { auth, cargando } = useAuth();
  if (cargando) return "cargando....";
  return (
    <div className="p-6 grid gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configuración</h1>
      </div>
      <AdministradorConfig auth={auth} />
      <GimnasioConfig />
    </div>
  );
};

export default Configuracion;
