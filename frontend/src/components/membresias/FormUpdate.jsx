import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import Alerta from "../Alerta";

import PropTypes from "prop-types";
import clienteAxios from "../../config/axios";

const FormUpdate = ({ selectedMembership, dataUpdate }) => {
  const [membresia, setMembresia] = useState(selectedMembership);
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const handleAddBeneficio = () => {
    setMembresia((prev) => ({
      ...prev,
      beneficios: [...prev.beneficios, ""],
    }));
  };

  const handleRemoveBeneficio = (index) => {
    setMembresia((prev) => ({
      ...prev,
      beneficios: prev.beneficios.filter((_, i) => i !== index),
    })); // al arreglo de beneficios se le hace un filtrado donde nos retornara los elementos que cumplan la condicion, "_" es el elemento actual del array, "i" es el indice del elemento en ese array, itera sobre el array para crear uno nuevo agregando quienes cumplan la condicion, que el i no sea igual al index que le estamos pasando
  };

  const handleBenefitChange = (index, value) => {
    setMembresia((prev) => {
      const updateBeneficios = [...prev.beneficios]; // creamos una copia de beneficios
      updateBeneficios[index] = value; // creamos un nuevo beneficio en el indice que se le paso y le damos el valor
      return {
        ...prev,
        beneficios: updateBeneficios, // cambiamos los beneficios antereriores por los nuevos cambios
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMembresia((prev) => ({
      ...prev,
      [name]:
        name === "precio" || name === "duracion_dias"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const validarActualizacion = (data) => {
    if (
      data.nombre === selectedMembership.nombre &&
      JSON.stringify(data.beneficios) ===
        JSON.stringify(selectedMembership.beneficios) &&
      data.duracion_dias === selectedMembership.duracion_dias &&
      data.precio === selectedMembership.precio
    ) {
      return "No se realizaron cambios";
    }
    if (data.precio <= 0) return "El precio no puede ser 0 o negativo";
    if (data.duracion_dias <= 6)
      return "La duración no puede ser menor a 7 días";
    if (
      data.beneficios.some((beneficio) => beneficio === "") ||
      data.beneficios.length === 0
    )
      return "No pueden ir vacíos los beneficios";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validarActualizacion(membresia);
    if (errorMsg) {
      mostrarAlerta(errorMsg, true);
      return;
    }
    try {
      const { data } = await clienteAxios.put(
        `/membresia/actualizar/${membresia.id}`,
        membresia
      );
      mostrarAlerta(data.msg, false);
      dataUpdate(membresia);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const { msg } = alerta;

  return (
    <>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {msg && <Alerta alerta={alerta} />}
        <div className="grid gap-2">
          <div className="grid">
            <label className="p-1 font-bold">Nombre de membresia</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              name="nombre"
              value={membresia.nombre || ""}
              onChange={handleChange}
              placeholder="Basica"
            />
          </div>
          {/* Iteración para agregar múltiples beneficios */}
          <div className="grid gap-2">
            <label className="p-1 font-bold">Beneficios</label>
            {membresia.beneficios.map((beneficio, index) => (
              <div key={index}>
                <div className="flex gap-3 items-center">
                  <input
                    className="border p-2 rounded-lg w-full"
                    type="text"
                    value={beneficio}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder={`Beneficio ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="bg-red-600 rounded-full w-6 h-6 text-white text-xs font-bold"
                    onClick={() => handleRemoveBeneficio(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="text-white m-auto rounded-lg px-2 py-1 text-sm flex gap-4 justify-center items-center bg-green-600 w-"
              onClick={handleAddBeneficio}
            >
              <IoMdAddCircle />
              Agregar beneficio
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid">
              <label className="p-1 font-bold">Duración en días</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="duracion_dias"
                value={membresia.duracion_dias || ""}
                onChange={handleChange}
                placeholder="30"
              />
            </div>
            <div className="grid">
              <label className="p-1 font-bold">Precio</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  className="border p-2 pl-8 rounded-lg w-full"
                  type="number"
                  min="0"
                  step="any"
                  name="precio"
                  value={membresia.precio || ""}
                  onChange={handleChange}
                  placeholder="ejm: 100.00"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="text-sm bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 flex items-center gap-2 m-auto "
        >
          Actualizar datos
        </button>
      </form>
    </>
  );
};

FormUpdate.propTypes = {
  selectedMembership: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string,
    beneficios: PropTypes.array,
    duracion_dias: PropTypes.number,
    precio: PropTypes.number,
  }),
  dataUpdate: PropTypes.func,
};

export default FormUpdate;
