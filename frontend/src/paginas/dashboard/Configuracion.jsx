import AdministradorConfig from "../../components/configuracion/AdministradorConfig"
import GimnasioConfig from "../../components/configuracion/GimnasioConfig";

const Configuracion = () => {
  return (
	<div className="p-6 grid gap-2">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">
        Configuración
      </h1>
    </div>
    <AdministradorConfig />
    <GimnasioConfig />
  </div>
  )
}

export default Configuracion;