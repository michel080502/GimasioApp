import { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import Alerta from "../Alerta";

const GimnasioConfig = () => {
  const [alerta, setAlerta] = useState({ msg: "", error: false });
  const [activeEdit, setActiveEdit] = useState(null);
  const [setting, setSetting] = useState({
    nombre_gimnasio: "",
    horario_apertura: "",
    horario_cierre: "",
    precio_visita: 0,
    email_envio_reportes: "",
    direccion: "",
    telefono: "",
  });

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const toggleEdit = () => {
    setActiveEdit((prev) => !prev);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "telefono") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setSetting((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setSetting((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validarForm = (data) => {
    const hayVacios = Object.values(data).some(
      (valor) =>
        valor === "" || valor === null || valor === undefined || valor === 0
    );
    if (hayVacios) return "No puede haber campos sin llenar";
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validarForm(setting);
    if (errorMsg) {
      return mostrarAlerta(errorMsg, true);
    }
    try {
      const { data } = await clienteAxios.put(
        "/admin/gym-info/actualizar",
        setting
      );
      mostrarAlerta(data.msg, false);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  useEffect(() => {
    const getSettingInfo = async () => {
      try {
        const { data } = await clienteAxios.get("/admin/gym-info");
        setSetting(data);
      } catch (error) {
        console.log(error.response.data.error);
        setSetting({ nombre_gimnasio: "" });
      }
    };

    getSettingInfo();
  }, []);

  const { msg } = alerta;

  return (
    <div className="border border-gray-500 rounded-lg px-4 py-2">
      <div className="flex justify-between m-2">
        <h2 className="text-2xl font-semibold">Gimnasio</h2>
        {activeEdit ? (
          <button
            className="bg-red-400 text-white  mx-3 rounded-lg hover:bg-red-600 p-2"
            onClick={toggleEdit}
            type="button"
          >
            Cancelar
          </button>
        ) : (
          <button
            className="bg-orange-400 text-white mx-3 rounded-lg hover:bg-orange-600 p-2"
            type="button"
            onClick={toggleEdit}
          >
            Editar configuración
          </button>
        )}
      </div>

      <form
        className={`py-1 px-5 relative bg-white rounded-lg grid grid-cols-2 gap-1 ${
          activeEdit ? "" : "opacity-50 pointer-events-none"
        }`}
      >
        {msg && <Alerta alerta={alerta} />}
        <div className="grid gap-1 p-1">
          <label className="font-semibold">Nombre gimnasio:</label>
          <input
            className="border rounded-lg px-2 py-1"
            name="nombre_gimnasio"
            value={setting.nombre_gimnasio || ""}
            onChange={handleInput}
            type="text"
          />
        </div>

        <div className="grid gap-1 p-1">
          <label className="font-semibold">Telefono:</label>
          <input
            className="border rounded-lg px-2 py-1"
            name="telefono"
            value={setting.telefono || ""}
            onChange={handleInput}
            type="tel"
            max={10}
          />
        </div>
        <div className="grid gap-1 p-1 col-span-2">
          <label className="font-semibold">Dirección:</label>
          <input
            className="border rounded-lg px-2 py-1"
            name="direccion"
            value={setting.direccion || ""}
            onChange={handleInput}
            type="text"
          />
        </div>

        <div className="grid gap-1 p-1">
          <label className="font-semibold">Hora apertura:</label>
          <input
            className="border rounded-lg px-2 py-1"
            name="horario_apertura"
            value={setting.horario_apertura || ""}
            onChange={handleInput}
            type="time"
          />
        </div>
        <div className="grid gap-1 p-1">
          <label className="font-semibold">Hora cierre:</label>
          <input
            className="border rounded-lg px-2 py-1"
            name="horario_cierre"
            value={setting.horario_cierre || ""}
            onChange={handleInput}
            type="time"
          />
        </div>
        <div className="grid gap-1 p-1">
          <label className="font-semibold">Email para envio reportes:</label>
          <input
            className="border rounded-lg px-2 py-1"
            name="email_envio_reportes"
            value={setting.email_envio_reportes || ""}
            onChange={handleInput}
            type="email"
          />
        </div>

        <div className="grid gap-1 p-1">
          <label className="font-semibold">Precio visita:</label>
          <input
            className="border rounded-lg px-2 py-1"
            name="precio_visita"
            value={setting.precio_visita || 0}
            onChange={handleInput}
            type="number"
          />
        </div>
        <div className="grid gap-1 p-1">
          {activeEdit ? (
            <div className="flex ">
              <button
                className="bg-green-600 text-white  m-auto rounded-lg hover:bg-green-700 p-2"
                type="button"
                onClick={handleSubmit}
              >
                Guardar cambios
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  );
};

export default GimnasioConfig;
