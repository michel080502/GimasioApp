import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";

const FormRegistro = () => {
  const [beneficios, setBeneficios] = useState([""]); // Array para almacenar los beneficios

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando....");
    console.log(beneficios); // Aquí puedes enviar el array de beneficios a la base de datos
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

  return (
    <>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid">
            <label className="p-1 font-bold">Nombre de membresia</label>
            <input
              className="border p-2 rounded-lg"
              type="text"
              placeholder="Basica"
            />
          </div>
          {/* Iteración para agregar múltiples beneficios */}
          <div className="grid gap-2">
            <label className="p-1 font-bold">Beneficios</label>
            {beneficios.map((beneficio, index) => (
              <div key={index} >
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
                type="text"
                placeholder="30"
              />
            </div>
            <div className="grid">
              <label className="p-1 font-bold">Precio</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                placeholder="$400.00"
              />
            </div>
          </div>
        </div>

        <button className="bg-black text-white rounded-lg p-1 hover:bg-red-900 transition-colors duration-75 w-32 m-auto">
          Guardar
        </button>
      </form>
    </>
  );
};

export default FormRegistro;
