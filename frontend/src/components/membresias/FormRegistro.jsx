import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";

import Alerta from "../Alerta";
import clienteAxios from "../../config/axios";
const FormRegistro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    duracion: 0,
    precio: 0.0,
  });

  const [alerta, setAlerta] = useState({ msg: "", error: false });
  const [beneficios, setBeneficios] = useState([""]); // Array para almacenar los beneficios

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "duracion" || name === "precio"
          ? value === ""
            ? ""
            : parseFloat(value) || 0
          : value,
    }));
  };

  const handleAddBeneficio = () => {
    setBeneficios([...beneficios, ""]); // Agregar un nuevo campo de beneficio
  };

  const handleRemoveBeneficio = (index) => {
    const newBeneficios = beneficios.filter((_, i) => i !== index); // Eliminar el beneficio seleccionado
    setBeneficios(newBeneficios);
  };

  const handleBenefitChange = (index, value) => {
    const newBeneficios = [...beneficios];
    newBeneficios[index] = value; // Actualizar el valor del beneficio
    setBeneficios(newBeneficios);
  };

  const validarFormData = (data) => {
    if (!data.nombre.trim()) return "El nombre es obligarorio";
    if (data.duracion < 7)
      return "La duración es obligatoria y debe ser mayor a 6";
    if (data.precio <= 0) return "El precio no es valido";
    if (beneficios.length === 0 || beneficios.includes(""))
      return "Los beneficios no pueden estar vacios";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const alertMsg = validarFormData(formData);
    if (alertMsg) {
      mostrarAlerta(alertMsg, true);
      return;
    }

    try {
      const { nombre, duracion, precio } = formData;
      const { data } = await clienteAxios.post("/membresia/crear", {
        nombre,
        beneficios,
        duracion,
        precio,
      });
      mostrarAlerta(data.msg, false);
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
              value={formData.nombre || ""}
              onChange={handleInputChange}
              placeholder="Basica"
            />
          </div>
          {/* Iteración para agregar múltiples beneficios */}
          <div className="grid gap-2">
            <label className="p-1 font-bold">Beneficios</label>
            {beneficios.map((beneficio, index) => (
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
              className="text-white w-48 m-auto rounded-lg p-1 flex gap-4 justify-center items-center bg-green-600 w-"
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
                name="duracion"
                value={formData.duracion || ""}
                onChange={handleInputChange}
                type="number"
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
                  value={formData.precio || ""}
                  onChange={handleInputChange}
                  placeholder="ejm: 100.00"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-black text-white rounded-lg p-1 hover:bg-red-900 transition-colors duration-75 w-32 m-auto"
        >
          Guardar
        </button>
      </form>
    </>
  );
};

export default FormRegistro;
