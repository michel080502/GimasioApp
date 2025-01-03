import { useState, useEffect } from "react";
const FormUpdate = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]); // Almacena las categorías obtenidas

  // Simula la carga de categorías desde la base de datos
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        // Reemplaza este array con la llamada a tu API
        const data = [
          { id: 1, nombre: "Proteína" },
          { id: 2, nombre: "Vitaminas" },
          { id: 3, nombre: "Accesorios" },
        ];
        setCategorias(data); // Almacena las categorías
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    obtenerCategorias();
  }, []);

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };
  const generarTotal = () => {
    console.log("generando total...");
  };
  return (
    <>
      <form className=" border pb-2 grid gap-2 justify-center max-w-screen-sm  overflow-y-auto">
        <div className="m-5 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 relative">
          <div className="grid grid-cols-1 md:grid-rows-3 order-2 ">
            <button
              type="button"
              className="w-20 md:w-3/4 md:h-3/4 m-auto cursor-pointer row-span-2"
              onClick={toggleOptions}
            >
              <img
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
                src="/assets/proteina.jpg"
              />
            </button>
            <button
              type="button"
              className="text-center text-3xl w-48  font-extrabold  justify-center "
              onClick={generarTotal}
            >
              <p className="flex gap-1 absolut justify-center">
                $
                <input
                  className="w-28 text-center rounded"
                  type="text"
                  placeholder="200.00"
                  disabled
                />
              </p>

              <p className="text-sm py-2 text-gray-500 hover:text-gray-600">
                Presiona para calcular total
              </p>
            </button>
            {/* Opcion para cargar imagen */}
            {showOptions && (
              <div className="absolute  mt-2 bg-rose-300 border border-red-900 rounded-lg shadow-lg w-48 z-10">
                <p className=" px-4 py-2 cursor-pointer text-white">
                  ¡Aun no disponible opcion para editar imagen¡
                </p>
              </div>
            )}
          </div>

          <div className="order-1 col-span-2 grid gap-2 grid-cols-2">
            <div className=" grid col-span-2">
              <label className=" p-1 font-bold">Nombre</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                placeholder="ejm: Proteina en polvo"
              />
            </div>
            <div className=" grid col-span-2 ">
              <label className=" p-1 font-bold">Marca</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                placeholder="ejm: DragonPharma"
              />
            </div>
            <div className="grid gap-2">
              <label className="p-1 font-bold">Categoría</label>
              <select
                className="border p-2 rounded-lg "
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">--Selecciona--</option>
                {categorias.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="hover:bg-green-600 focus:bg-green-600"
                  >
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid">
              <label className="p-1 font-bold">Stock</label>
              <div className="relative">
                <input
                  className="border p-2  rounded-lg w-full"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="ejm: 300.00"
                />
              </div>
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
                  min={0}
                  step={0.01}
                  placeholder="ejm: 300.00"
                />
              </div>
            </div>

            <div className=" grid">
              <label className=" p-1 font-bold">Descuento</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  className="border p-2 pl-8 rounded-lg w-full"
                  type="number"
                  placeholder="ejm: 100.00"
                />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="button w-32 m-auto">Guardar</button>
      </form>
    </>
  );
};

export default FormUpdate;
