import { useState } from "react";

const GimnasioConfig = () => {
    const [activeEdit, setActiveEdit] = useState(null);

    const toggleEdit = () => {
      setActiveEdit((prev) => !prev);
    };
  
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
          className={`py-1 px-5 bg-white rounded-lg grid grid-cols-2 gap-1 ${
            activeEdit ? "" : "opacity-50 pointer-events-none"
          }`}
        >
          <div className="grid gap-1 p-1">
            <label className="font-semibold">Nombre gimnasio:</label>
            <input className="border rounded-lg px-2 py-1" type="text" />
          </div>
         
          <div className="grid gap-1 p-1">
            <label className="font-semibold">Telefono:</label>
            <input className="border rounded-lg px-2 py-1" type="email" />
          </div>
          <div className="grid gap-1 p-1 col-span-2">
            <label className="font-semibold">Dirección:</label>
            <input className="border rounded-lg px-2 py-1" type="text" />
          </div>
          
          <div className="grid gap-1 p-1">
            <label className="font-semibold">Hora apertura:</label>
            <input className="border rounded-lg px-2 py-1" type="date"  />
          </div>
          <div className="grid gap-1 p-1">
            <label className="font-semibold">Hora cierre:</label>
            <input className="border rounded-lg px-2 py-1" type="date"  />
          </div>
          <div className="grid gap-1 p-1">
            <label className="font-semibold">Email para envio reportes:</label>
            <input className="border rounded-lg px-2 py-1" type="tel" />
          </div>
          <div className="grid gap-1 p-1">
            <label className="font-semibold">Hora para envio reportes:</label>
            <input className="border rounded-lg px-2 py-1" type="tel" />
          </div>
          <div className="grid gap-1 p-1">
            <label className="font-semibold">Precio visita:</label>
            <input className="border rounded-lg px-2 py-1" type="tel" />
          </div>
          <div className="grid gap-1 p-1">
            
            {activeEdit ? (
              <div className="flex ">
                <button
                  className="bg-green-600 text-white  m-auto rounded-lg hover:bg-green-700 p-2"
                  type="button"
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
}

export default GimnasioConfig
