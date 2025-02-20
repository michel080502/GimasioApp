import { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import PropTypes from "prop-types";
import Alerta from "../Alerta";
const FormUpdate = ({ selectedProd, categorias, formatoPrecio, dataUpdatedProduct }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [producto, setProducto] = useState(selectedProd);
  const [alerta, setAlerta] = useState({ msg: "", error: false });
  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]:
        name === "precio" || name === "descuento" || name === "stock"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const validarActualizacion = (data) => {
    if (
      data.nombre === selectedProd.nombre &&
      data.marca === selectedProd.marca &&
      data.categoria_id === selectedProd.categoria_id &&
      data.stock === selectedProd.stock &&
      data.precio === selectedProd.precio &&
      data.descuento === selectedProd.descuento
    ) {
      return "No se realizaron cambios en el producto.";
    }
    if (data.stock <= 0) return "El stock debe ser mayor a 0.";
    if (data.precio <= 0) return "El precio debe ser mayor a 0.";
    if (data.descuento < 0) return "El descuento no puede ser negativo.";
    if (data.descuento >= data.precio)
      return "El descuento no puede ser igual o mayor al precio.";

    return null; // Si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validarActualizacion(producto);
    if (errorMsg) {
      mostrarAlerta(errorMsg, true);
      return;
    }

    try {
      const { data } = await clienteAxios.put(
        `/producto/actualizar/${producto.id}`,
        producto
      );
      dataUpdatedProduct(producto);
      mostrarAlerta(data.msg, false);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  useEffect(() => {
    const { precio, descuento } = producto;

    // Asegurarse de que descuento no sea mayor que el precio
    if (precio > 0 && descuento >= 0 && descuento < precio) {
      const total = parseFloat(precio) - parseFloat(descuento);
      setProducto((prev) => ({
        ...prev,
        total: total >= 0 ? total : 0,
      }));
    } else {
      setProducto((prev) => ({
        ...prev,
        total: 0,
      }));
    }
  }, [producto.precio, producto.descuento]); // Dependencias de las propiedades específicas

  const { msg } = alerta;
  return (
    <>
      <form
        className=" border pb-2 grid justify-center max-w-screen-sm  overflow-y-auto"
        onSubmit={handleSubmit}
      >
        {msg && <Alerta alerta={alerta} />}
        <div className="m-3 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-3 relative">
          <div className="grid grid-cols-1 md:grid-rows-3 order-2 ">
            <button
              type="button"
              className="w-20 md:w-3/4 md:h-3/4 m-auto cursor-pointer row-span-2"
              onClick={toggleOptions}
            >
              <img
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
                src={producto.img_secure_url}
              />
            </button>
            <div className="grid text-center  absolut  font-bold ">
              <p className="text-3xl">
                {formatoPrecio.format(producto.total || 0)}
              </p>
              <p className="text-sm text-gray-600">precio total</p>
            </div>

            {/* Opcion para cargar imagen */}
            {showOptions && (
              <div className="absolute  mt-2 bg-rose-300 border border-red-900 rounded-lg shadow-lg w-48 z-10">
                <p className=" px-4 py-2 cursor-pointer text-white">
                  ¡Aun no disponible opcion para editar imagen¡
                </p>
              </div>
            )}
          </div>

          <div className="order-1 text-sm col-span-2 grid gap-2 grid-cols-3">
            <div className=" grid col-span-3">
              <label className=" p-1 font-bold">Nombre</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="nombre"
                value={producto.nombre || ""}
                onChange={handleChange}
                placeholder="ejm: Proteina en polvo"
              />
            </div>
            <div className=" grid col-span-1 ">
              <label className=" p-1 font-bold">Marca</label>
              <input
                className="border p-1 rounded-lg"
                type="text"
                name="marca"
                value={producto.marca}
                onChange={handleChange}
                placeholder="ejm: DragonPharma"
              />
            </div>
            <div className="grid col-span-2 gap-1 ml-12">
              <label htmlFor="categoria" className="p-1 font-bold">
                Categoría
              </label>
              <select
                name="categoria_id"
                className="border p-2 rounded-lg w-full"
                value={producto.categoria_id || ""}
                onChange={handleChange}
              >
                <option value="">--Selecciona--</option>
                {Array.isArray(categorias) && categorias.length > 0 ? (
                  categorias.map((categoria, index) => (
                    <option key={index} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay categorías en el sistema</option>
                )}
              </select>
            </div>

            <div className="grid">
              <label className="p-1 font-bold">Stock</label>
              <div className="relative">
                <input
                  className="border p-2  rounded-lg w-full"
                  value={producto.stock || ""}
                  name="stock"
                  onChange={handleChange}
                  type="number"
                  min="0"
                  step="any"
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
                  value={producto.precio || ""}
                  name="precio"
                  type="number"
                  min="0"
                  step="any"
                  onChange={handleChange}
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
                  min="0"
                  step="any"
                  name="descuento"
                  value={producto.descuento || ""}
                  onChange={handleChange}
                  placeholder="ejm: 100.00"
                />
              </div>
            </div>
            <p className="col-span-3 text-xs">
              En <span className="font-bold">precio y descuento</span> no
              olvides agregar <span className="font-bold"> {".00"}</span> al
              final para no tener problemas al calcular el total
            </p>
          </div>
        </div>
        <button
          type="submit"
          className="text-base bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 m-auto"
        >
          Guardar
        </button>
      </form>
    </>
  );
};

FormUpdate.propTypes = {
  selectedProd: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    marca: PropTypes.string.isRequired,
    categoria_id: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    precio: PropTypes.number.isRequired,
    descuento: PropTypes.number.isRequired,
    total: PropTypes.number,
    img_public_id: PropTypes.string,
    img_secure_url: PropTypes.string,
    disponible: PropTypes.bool.isRequired,
    nivel_stock: PropTypes.string,
  }).isRequired,
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  formatoPrecio: PropTypes.instanceOf(Intl.NumberFormat).isRequired,
  dataUpdatedProduct: PropTypes.func,
};

export default FormUpdate;
