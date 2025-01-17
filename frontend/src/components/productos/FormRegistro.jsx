import { useState, useEffect } from "react";
import { MdAddPhotoAlternate, MdAddAPhoto } from "react-icons/md";
import { FaRegFileImage } from "react-icons/fa";
import Alerta from "../Alerta";
import Camera from "../ui/Camera";
import { resizeImage } from "../../utils/resizeImage";
import PropTypes from "prop-types";
import clienteAxios from "../../config/axios";

const FormRegistro = ({ categorias, formatoPrecio, recargarDatos }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    categoria: 0,
    stock: 0,
    precio: 0.0,
    descuento: 0.0,
  });
  const [total, setTotal] = useState(0.0);
  const [file, setFile] = useState(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [alerta, setAlerta] = useState({ msg: "", error: false });
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
        name === "precio" || name === "descuento" || name === "stock"
        ? value === "" ? "" : parseFloat(value) || 0
        : value,
    }));
  };

  const validateFormData = (data) => {
    if (!data.nombre.trim()) return "El nombre es obligatorio.";
    if (!data.marca.trim()) return "La marca es obligatoria.";
    if (!data.categoria.trim()) return "Selecciona una categoría.";
    if (data.stock <= 0) return "El stock debe ser mayor a 0.";
    if (data.precio <= 0) return "El precio debe ser mayor a 0.";
    if (data.descuento < 0) return "El descuento no puede ser negativo.";
    if (data.descuento >= data.precio)
      return "El descuento no puede ser igual o mayor al precio.";

    return null; // Si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateFormData(formData);
    if (errorMsg) {
      mostrarAlerta(errorMsg, true);
      return;
    } else if (!file) {
      mostrarAlerta("Agrega una imagen", true);
    }
    // Logica para enviar
    try {
      const { nombre, marca, categoria, stock, precio, descuento } = formData;
      const product = new FormData();
      product.append("nombre", nombre);
      product.append("marca", marca);
      product.append("categoria", categoria);
      product.append("stock", stock);
      product.append("precio", precio);
      product.append("descuento", descuento);
      product.append("total", total);
      product.append("img", file);

      const { data } = await clienteAxios.post(`/producto/crear`, product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      mostrarAlerta(data.msg, false);
      recargarDatos();
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleCapture = (imageData) => {
    setImagePreview(imageData);
    setFile(imageData);
    setIsCameraOpen(false); // Cierra la cámara después de capturar
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        // Redimensiona la imagen y guarda el resultado
        const resizedImage = await resizeImage(selectedFile);
        setFile(resizedImage);

        // Genera una vista previa
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(resizedImage);
      } catch (err) {
        console.error("Error al procesar la imagen:", err);
      }
    }
  };

  useEffect(() => {
    const { precio, descuento } = formData;

    // Asegurarse de que descuento no sea mayor que el precio
    if (precio > 0 && descuento >= 0 && descuento < precio) {
      const total = parseFloat(precio) - parseFloat(descuento);
      setTotal(total >= 0 ? total : 0); // Evitar totales negativos
    } else if (precio < descuento) {
      mostrarAlerta("El precio no puede ser menor al descuento", true);
    } else {
      setTotal(0); // Si hay un descuento inválido, el total será 0
    }
  }, [formData.precio, formData.descuento]); // Dependencias de las propiedades específicas

  const { msg } = alerta;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" border p-2 grid gap-2 justify-center max-w-screen-sm  overflow-y-auto"
      >
        {msg && <Alerta alerta={alerta} />}
        <div className="m-3 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 relative">
          <div className="grid grid-cols-1 md:grid-rows-3 order-2 ">
            <button
              type="button"
              className="w-20 md:w-3/4 md:h-3/4 m-auto cursor-pointer row-span-2"
              onClick={toggleOptions}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-28 h-28 m-auto object-cover rounded-lg"
                />
              ) : (
                <MdAddPhotoAlternate className="w-full h-full text-gray-300 hover:text-gray-500" />
              )}
            </button>

            <div className="grid text-center  absolut  font-bold ">
              <p  className="text-3xl">
                {formatoPrecio.format(total)}
              </p>
              <p className="text-sm text-gray-600">precio total</p>
            </div>

            {/* Opcion para cargar imagen */}
            {showOptions && (
              <div className="absolute top-10 md:top-1/2 mt-2 bg-white border rounded-lg shadow-lg w-48 z-10">
                <ul className="flex flex-col">
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer ">
                    <label
                      htmlFor="upload-photo"
                      className="cursor-pointer flex gap-4 items-center"
                    >
                      <FaRegFileImage />
                      Subir Foto
                    </label>
                    <input
                      id="upload-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleFileChange(e);
                        setShowOptions(false); // Oculta las opciones después de seleccionar
                      }}
                    />
                  </li>
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex gap-4 items-center">
                    <MdAddAPhoto />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCameraOpen(true);
                        setShowOptions(false); // Oculta las opciones después
                      }}
                    >
                      Tomar Foto
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {isCameraOpen && (
            <Camera
              onCapture={handleCapture}
              onClose={() => setIsCameraOpen(false)}
            />
          )}

          <div className="order-1 text-sm col-span-2 grid gap-2 grid-cols-3">
            <div className=" grid col-span-3">
              <label className=" p-1 font-bold">Nombre</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="ejm: Proteina en polvo"
              />
            </div>
            <div className=" grid col-span-1 ">
              <label className=" p-1 font-bold">Marca</label>
              <input
                className="border p-1 rounded-lg"
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                placeholder="ejm: DragonPharma"
              />
            </div>
            <div className="grid col-span-2 gap-1 ml-12">
              <label htmlFor="categoria" className="p-1 font-bold">
                Categoría
              </label>
              <select
                name="categoria"
                className="border p-2 rounded-lg w-full"
                value={formData.categoria || ""}
                onChange={handleInputChange}
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
                  value={formData.stock || ""}
                  name="stock"
                  onChange={handleInputChange}
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
                  value={formData.precio || ""}
                  name="precio"
                  onChange={handleInputChange}
                  type="number"
                  min="0"
                  step="any"
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
                  value={formData.descuento || ""}
                  onChange={handleInputChange}
                  placeholder="ejm: 100.00"
                />
              </div>
            </div>
          </div>
        </div>
        <button className="text-base bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 m-auto">Guardar</button>
      </form>
    </>
  );
};
FormRegistro.propTypes = {
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  formatoPrecio: PropTypes.instanceOf(Intl.NumberFormat).isRequired,
  recargarDatos: PropTypes.func,
};

export default FormRegistro;
