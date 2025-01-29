import { HiSearchCircle } from "react-icons/hi";

import PropTypes from "prop-types";
import { useState } from "react";

const Products = ({ formatoPrecio, productos, seleccionarProductos }) => {
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = productos.filter((producto) =>
    [producto.nombre, producto.marca, producto.categoria].some((campo) =>
      campo.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const manejarCambio = (e) => {
    setBusqueda(e.target.value);
  };
  return (
    <>
      <h2 className="flex justify-between text-lg p-2 text-gray-600 ">
        <span className="rounded-full px-[9px] ring ring-gray-400 ">2</span>
        Selecciona los productos a comprar
      </h2>
      <div className=" border  rounded-lg ">
        <div className=" my-auto grid gap-2 p-2">
          <form className="flex " onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={manejarCambio}
              className="w-full text-sm p-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-800"
            />
            <button
              type="submit"
              className="inset-y-0 right-0 flex -ml-5 items-center px-4 text-white bg-zinc-700 rounded-r-lg hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-300"
            >
              <HiSearchCircle className="text-2xl" />
            </button>
          </form>
          <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
            {productosFiltrados.map((item, index) => (
              <article
                key={item.id}
                className="border rounded-lg hover:border-gray-700 p-3 grid gap-2"
              >
                <div className="flex justify-between py-2">
                  <div className=" rounded-full w-5 h-5 text-center border border-gray-700 ">
                    <p className="text-xs">{index + 1}</p>
                  </div>
                  <p className="text-sm ">{item.categoria}</p>
                </div>

                <img
                  className="w-24 h-24 m-auto rounded-lg shadow-lg"
                  src={item.img_secure_url}
                  alt={item.nombre}
                />
                <div className="text-sm ">
                  <p className="text-gray-600 text-xs">Nombre:</p>
                  <p className="font-medium">{item.nombre}</p>
                </div>

                <div className="flex justify-between">
                  <div className="text-sm">
                    <p className="text-gray-600 text-xs">Precio:</p>
                    <p className="font-medium">
                      {formatoPrecio.format(item.precio)}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 text-xs">Descuento:</p>
                    <p className="font-medium">
                      {formatoPrecio.format(item.descuento)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm">
                    <p className="text-gray-600 text-xs">Total:</p>
                    <p className="font-medium">
                      {formatoPrecio.format(item.total)}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 text-xs">Disponibles:</p>
                    <p className="font-medium">{item.stock} u</p>
                  </div>
                </div>

                <button
                  className="bg-gray-700 text-sm text-white p-2 rounded-lg hover:bg-black transform duration-200 m-auto"
                  onClick={() => {
                    seleccionarProductos(item);
                  }}
                >
                  Seleccionar
                </button>
              </article>
            ))}
            {productosFiltrados.length == 0 && (
              <p className="col-span-4 text-center text-gray-500">
                No se encontraron resultados o ya tiene membresia activa {":)"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// PropTypes del componente Products
Products.propTypes = {
  formatoPrecio: PropTypes.instanceOf(Intl.NumberFormat).isRequired, // Debe ser un objeto Intl.NumberFormat
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // ID único del producto
      nombre: PropTypes.string.isRequired, // Nombre del producto
      categoria: PropTypes.string, // Categoría del producto
      precio: PropTypes.number.isRequired, // Precio del producto
      descuento: PropTypes.number, // Descuento opcional
      total: PropTypes.number, // Precio total con descuento, si aplica
      stock: PropTypes.number.isRequired, // Cantidad en stock
    })
  ).isRequired, // Array de productos, obligatorio
  seleccionarProductos: PropTypes.func.isRequired, // Función para seleccionar productos
};

export default Products;
