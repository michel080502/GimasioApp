import { useEffect, useState } from "react";
import Alerta from "../Alerta";
import clienteAxios from "../../config/axios";
import PropTypes from "prop-types";

const FormUpdate = ({ selectedClient, dataUpdate }) => {
  const [client, setClient] = useState(selectedClient);
  const [showOptions, setShowOptions] = useState(false);
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  useEffect(() => {
    generarMatricula();
  }, [client.nombre, client.apellido_paterno, client.apellido_materno, client.telefono]);

  const generarMatricula = () => {
    if (
      client.nombre &&
      client.apellido_paterno &&
      client.apellido_materno &&
      client.telefono
    ) {
      const nombreIniciales = client.nombre.slice(0, 2).toUpperCase(); // Primeras 2 letras del nombre
      const apellidoP = client.apellido_paterno.slice(0, 1).toUpperCase(); // Primera letra del apellido paterno
      const apellidoM = client.apellido_materno.slice(0, 1).toUpperCase(); // Primera letra del apellido materno
      const telefonoFinal = client.telefono.slice(-4); // Últimos 4 dígitos del teléfono

      const nuevaMatricula = `${nombreIniciales}${apellidoP}${apellidoM}-${telefonoFinal}`;
      setClient((prev) => ({
        ...prev,
        matricula: nuevaMatricula,
      }));
    } else {
      mostrarAlerta(
        "Completa todos los campos para generar la matrícula",
        true
      );

      return;
    }
  };
  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefono") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setClient((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    }
    setClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await clienteAxios.put(
        `/cliente/update/${client.id}`,
        client
      );
      mostrarAlerta(data.msg, false);
      dataUpdate(client);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };
  const { msg } = alerta;

  return (
    <form
      className=" border pb-2 grid justify-center max-w-screen-sm  overflow-y-auto"
      onSubmit={handleSubmit}
    >
      {msg && <Alerta alerta={alerta} />}
      {client && (
        <div className="grid grid-cols-3 gap-6 relative">
          {/* Botón para cargar o tomar foto */}
          <div className="p-3 grid grid-rows-2  justify-center items-center">
            <button
              className="hover:bg-black hover:bg-opacity-10"
              type="button"
              onClick={toggleOptions}
            >
              <img
                className="rounded-lg shadow-lg"
                src={client.img_secure_url}
                alt="profile"
              />
            </button>
            {/* Opciones para imagen */}
            {showOptions && (
              <div className="absolute  mt-2 bg-rose-300 border border-red-900 rounded-lg shadow-lg w-48 z-10">
                <p className=" px-4 py-2 cursor-pointer text-white">
                  ¡Aun no disponible opcion para editar imagen¡
                </p>
              </div>
            )}
            <button type="button" onClick={generarMatricula}>
              <input
                className="text-center text-3xl w-48 m-auto font-extrabold "
                type="text"
                value={client.matricula || ""}
                placeholder="2020394"
                disabled
              />
              <p className="text-sm py-2 text-gray-500 hover:text-gray-600">
                Presiona para crear matricula
              </p>
            </button>
          </div>

          <div className="col-span-2 grid gap-2 grid-cols-2">
            {/* Nombre */}
            <div className="grid col-span-2">
              <label className="p-1 font-bold">Nombre(s)</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="nombre"
                value={client.nombre || ""}
                onChange={handleChange}
                placeholder="Nombre"
              />
            </div>

            {/* Apellido Paterno */}
            <div className="grid">
              <label className="p-1 font-bold">Apellido Paterno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="apellido_paterno"
                value={client.apellido_paterno || ""}
                onChange={handleChange}
                placeholder="Apellido"
              />
            </div>

            {/* Apellido Materno */}
            <div className="grid">
              <label className="p-1 font-bold">Apellido Materno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="apellido_materno"
                value={client.apellido_materno || ""}
                onChange={handleChange}
                placeholder="Apellido"
              />
            </div>

            {/* Teléfono */}
            <div className="grid">
              <label className="p-1 font-bold">Teléfono</label>
              <input
                className="border p-2 rounded-lg"
                type="tel"
                name="telefono"
                maxLength={10}
                value={client.telefono || ""}
                onChange={handleChange}
                placeholder="2222345632"
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div className="grid">
              <label className="p-1 font-bold">Nacimiento</label>
              <input
                className="border p-2 rounded-lg"
                type="date"
                name="nacimiento"
                value={client.nacimiento || ""}
                onChange={handleChange}
              />
            </div>

            {/* Correo */}
            <div className="grid col-span-2">
              <label className="p-1 font-bold">Correo</label>
              <input
                className="border p-2 rounded-lg"
                type="email"
                name="email"
                value={client.email || ""}
                onChange={handleChange}
                placeholder="exp@ejemplo.com"
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="text-base bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 m-auto"
      >
        Actualizar datos
      </button>
    </form>
  );
};

FormUpdate.propTypes = {
  selectedClient: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    apellido_paterno: PropTypes.string,
    apellido_materno: PropTypes.string,
    telefono: PropTypes.string,
    nacimiento: PropTypes.string,
    email: PropTypes.string,
    matricula: PropTypes.string,
    img_secure_url: PropTypes.string,
  }),
  dataUpdate: PropTypes.func,
};

export default FormUpdate;
