import { useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import Alerta from "../Alerta";
import clienteAxios from "../../config/axios";

const AdministradorConfig = ({ auth }) => {
  const [admin, setAdmin] = useState(auth);
  const [activeEdit, setActiveEdit] = useState(null);
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const toggleEdit = () => {
    setActiveEdit((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefono") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setAdmin((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setAdmin((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validarForm = (data) => {
    if (
      data.nombre === auth.nombre &&
      data.apellidoPaterno === auth.apellidoPaterno &&
      data.apellidoMaterno === auth.apellidoMaterno &&
      data.email === auth.email &&
      data.telefono === auth.telefono
    ) {
      return "No se realizaron cambios";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validarForm(admin);
    if (errorMsg) {
      return mostrarAlerta(errorMsg, true);
    }
    try {
      const { data } = await clienteAxios.put(
        `/admin/actualizar/${admin.id}`,
        admin
      );
      mostrarAlerta(data.msg, false);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const { msg } = alerta;

  return (
    <div className="border border-gray-500 rounded-lg px-4 py-2">
      <div className="flex justify-between m-2">
        <h2 className="text-2xl font-semibold">Administrador</h2>
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
            Editar datos
          </button>
        )}
      </div>

      <form
        className={`py-1 px-5 relative bg-white rounded-lg grid grid-cols-3 gap-1 ${
          activeEdit ? "" : "opacity-50 pointer-events-none"
        }`}
        onSubmit={handleSubmit}
      >
        {msg && <Alerta alerta={alerta} />}
        <div className="grid gap-1 p-1">
          <label className="font-semibold">Nombre(s):</label>
          <input
            className="border rounded-lg px-2 py-1"
            type="text"
            name="nombre"
            value={admin.nombre}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-1 p-1">
          <label className="font-semibold">Apellido paterno:</label>
          <input
            className="border rounded-lg px-2 py-1"
            type="text"
            name="apellidoPaterno"
            value={admin.apellidoPaterno}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-1 p-1">
          <label className="font-semibold">Apellido materno:</label>
          <input
            className="border rounded-lg px-2 py-1"
            type="text"
            name="apellidoMaterno"
            value={admin.apellidoMaterno}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-1 p-1">
          <label className="font-semibold">Email:</label>
          <input
            className="border rounded-lg px-2 py-1"
            type="email"
            name="email"
            value={admin.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-1 p-1">
          <label className="font-semibold">Telefono:</label>
          <input
            className="border rounded-lg px-2 py-1"
            type="tel"
            maxLength={10}
            pattern="[0-9]{10}"
            name="telefono"
            value={admin.telefono || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-1 p-1">
          <label className="font-semibold">Fecha de creación:</label>
          <input
            className="border rounded-lg px-2 py-1"
            type="text"
            value={format(
              new Date(admin.fecha_creacion),
              "dd 'de' MMMM, yyyy",
              { locale: es }
            )}
            disabled
          />
        </div>
        <div className="flex justify-between col-span-3  p-1">
          <p>
            Si desea cambiar la contraseña hágalo desde recuperar contraseña{" "}
            {":))"}
          </p>
          {activeEdit ? (
            <div className="flex ">
              <button
                className="text-base bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 m-auto"
                type="submit"
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

AdministradorConfig.propTypes = {
  auth: PropTypes.object,
};

export default AdministradorConfig;
