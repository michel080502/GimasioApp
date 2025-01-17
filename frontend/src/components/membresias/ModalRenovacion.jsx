import Modal from "../../components/Modal";
import Alerta from "../Alerta";
import { IoMdCloseCircle } from "react-icons/io";
import { useState } from "react";
import PropTypes from "prop-types";

const ViewRenovacion = ({ closeModal }) => {
  const [vista, setVista] = useState("opciones");
  const [alerta, setAlerta] = useState({ msg: "", error: false });
  const [seleccionada, setSeleccionada] = useState(null);

  // Seleccionar membresia nueva
  const handleSeleccionar = (id) => {
    setSeleccionada(seleccionada === id ? null : id); // Alternar selección
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!seleccionada) {
      setAlerta({
        msg: "Selecciona una membresia antes de renovar",
        error: true,
      });
      return;
    }
    try {
      // Logica para la renovación
      setVista("mensaje");
    } catch {
      setAlerta({
        msg: "Error al renovar",
        error: true,
      });
    }
  };
  const { msg } = alerta;
  // Lista ficticia de membresías
  const membresias = [
    {
      id: 1,
      nombre: "Mensual Básica",
      beneficios: ["Acceso al gimnasio", "Clases grupales"],
      duracion_dias: 30,
      precio: 500.0,
      disponible: true,
    },
    {
      id: 2,
      nombre: "Mensual Premium",
      beneficios: ["Acceso total", "Entrenador personal"],
      duracion_dias: 30,
      precio: 800.0,
      disponible: true,
    },
    {
      id: 3,
      nombre: "Anual Básica",
      beneficios: ["Acceso al gimnasio", "Clases grupales"],
      duracion_dias: 365,
      precio: 5000.0,
      disponible: false,
    },
    {
      id: 4,
      nombre: "Anual Premium",
      beneficios: ["Acceso total", "Entrenador personal"],
      duracion_dias: 365,
      precio: 8000.0,
      disponible: true,
    },
  ];

  return (
    <>
      <Modal closeModal={closeModal}>
        {vista === "opciones" && (
          <div>
            <div className="flex justify-between pb-3">
              <h2 className="text-lg font-semibold">Opciones de renovación</h2>
              <button className="text-red-700" onClick={closeModal}>
                <IoMdCloseCircle className="text-2xl" />
              </button>
            </div>

            <div className="grid gap-3 justify-center">
              <h1>Datos del cliente</h1>
              <div className="flex gap-6">
                <button
                  className="bg-gray-700 text-sm text-white py-1 px-2 rounded-lg hover:bg-black transform duration-200 m-auto"
                  onClick={() => setVista("mensaje")}
                >
                  Misma membresia
                </button>
                <button
                  className="bg-blue-700 text-sm text-white py-1 px-2 rounded-lg hover:bg-blue-900 transform duration-200 m-auto"
                  onClick={() => setVista("formulario")}
                >
                  Elegir nueva membresia
                </button>
              </div>
            </div>
          </div>
        )}

        {vista === "formulario" && (
          <div>
            <div className="flex justify-between pb-3">
              <h2 className="text-lg font-semibold">Otras membresías</h2>
              <button className="text-red-700" onClick={closeModal}>
                <IoMdCloseCircle className="text-2xl" />
              </button>
            </div>
            {msg && <Alerta alerta={alerta} />}
            <div className="grid gap-3 py-2">
              <h1>Lista de membresías disponibles</h1>
              <div className="grid font-normal gap-3">
                {membresias
                  .filter((m) => m.disponible) // Filtra solo disponibles
                  .map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleSeleccionar(m.id)}
                      className={`p-3 grid grid-cols-2 gap-5 border rounded-md cursor-pointer ${
                        seleccionada === m.id
                          ? "bg-green-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="text-left">
                        <h3 className="text-base font-semibold">{m.nombre}</h3>
                        <p className="font-semibold">Beneficios:</p>
                        <ul className="list-disc ml-5">
                          {m.beneficios.map((b, index) => (
                            <li key={index}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid gap-1 items-center">
                        <p>
                          <span className="font-semibold">Duración:</span>{" "}
                          {m.duracion_dias} días
                        </p>
                        <p>
                          {" "}
                          <span className="font-semibold">Precio:</span> $
                          {m.precio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <form
                className="flex gap-6 justify-center"
                onSubmit={handleSubmit}
              >
                <button
                  className="bg-stone-800 bg-opacity-80 text-white p-2 rounded-md hover:bg-opacity-100"
                  type="submit"
                >
                  Renovar membresía
                </button>
                <button
                  className="bg-orange-500 bg-opacity-80 text-white p-2 rounded-md hover:bg-opacity-100"
                  onClick={() => setVista("opciones")}
                >
                  Regresar a opciones
                </button>
              </form>
            </div>
          </div>
        )}

        {vista === "mensaje" && (
          <div>
            <div className="flex justify-between pb-3">
              <h2 className="text-lg font-semibold">Mensaje de renovación</h2>
              <button className="text-red-700" onClick={closeModal}>
                <IoMdCloseCircle className="text-2xl" />
              </button>
            </div>

            <div className="grid gap-3 justify-center">
              <h1>Membresía actualizada correctamente</h1>
              <p>Datos cliente</p>
              <p>Datos membresía</p>
              <div className="flex justify-center">
                <button
                  className="bg-green-600 bg-opacity-80 text-white p-2 rounded-md hover:bg-opacity-100"
                  onClick={closeModal}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

ViewRenovacion.propTypes = {
  closeModal: PropTypes.func,
};

export default ViewRenovacion;
