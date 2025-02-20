import { MdAddPhotoAlternate, MdAddAPhoto } from "react-icons/md";
import { FaRegFileImage } from "react-icons/fa";

import Alerta from "../Alerta";
import Camera from "../ui/Camera";

import { useState } from "react";
import { resizeImage } from "../../utils/resizeImage";
import clienteAxios from "../../config/axios";
import PropTypes from "prop-types";

const FormRegistro = ({ dataReload }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    especialidad: "",
    telefono: "",
    email: "",
  });
  const [file, setFile] = useState(null);
  const [alerta, setAlerta] = useState({ msg: "", error: false });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showOptions, setShowOptions] = useState(null);

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Aseguramos que solo se ingresen números
    if (name === "telefono") {
      // Solo permite números y se limita a 10 caracteres
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validarFormData = (data) => {
    if (!data.nombre.trim()) return "El nombre es obligatorio";
    if (!data.apellidoPaterno.trim())
      return "El apellido paterno es obligatorio";
    if (!data.apellidoMaterno.trim())
      return "El apellido materno es obligatorio";
    if (!data.especialidad.trim()) return "La especialidad es obligatorio";
    if (!data.telefono.trim()) return "El telefono es obligatorio";
    if (!data.email.trim()) return "El email es obligatorio";
    if (!file) return "Selecciona imagen por favor";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validarFormData(formData);
    if (errorMsg) return mostrarAlerta(errorMsg, true);
    try {
      const {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        especialidad,
        telefono,
        email,
      } = formData;
      const trainer = new FormData();
      trainer.append("nombre", nombre);
      trainer.append("apellidoPaterno", apellidoPaterno);
      trainer.append("apellidoMaterno", apellidoMaterno);
      trainer.append("especialidad", especialidad);
      trainer.append("telefono", telefono);
      trainer.append("email", email);
      trainer.append("img", file);

      const { data } = await clienteAxios.post("/entrenador/crear", trainer, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dataReload();
      mostrarAlerta(data.msg, false);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };
  const { msg } = alerta;
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
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" border p-2 grid justify-center overflow-y-auto"
      >
        {msg && <Alerta alerta={alerta} />}
        <div className="m-5 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 relative">
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
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <MdAddPhotoAlternate className="w-full h-full text-gray-300 hover:text-gray-500" />
              )}
            </button>
            <p className="text-center font-medium">Foto del entrenador</p>
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
          <div className="order-1 col-span-2 grid gap-2 grid-cols-2">
            <div className=" grid col-span-2">
              <label className=" font-bold">Nombre</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleInputChange}
                placeholder="ejm: Carlos Belcast"
              />
            </div>
            <div className=" grid ">
              <label className=" p-1 font-bold">Apellido Paterno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno || ""}
                onChange={handleInputChange}
                placeholder="Carlos Belcast"
              />
            </div>
            <div className=" grid">
              <label className=" p-1 font-bold">Apellido Materno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno || ""}
                onChange={handleInputChange}
                placeholder="Carlos Belcast"
              />
            </div>
            <div className=" grid col-span-2">
              <label className=" p-1 font-bold">Especialidad</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                name="especialidad"
                value={formData.especialidad || ""}
                onChange={handleInputChange}
                placeholder="ejm: Carlos Belcast"
              />
            </div>
            <div className=" grid">
              <label className=" p-1 font-bold">Telefono</label>
              <input
                className="border p-2 rounded-lg"
                type="tel"
                maxLength="10"
                name="telefono"
                pattern="[0-9]{10}" // Solo permite 10 dígitos numéricos
                title="Debe ingresar solo números."
                value={formData.telefono || ""}
                onChange={handleInputChange}
                placeholder="ejm: Carlos Belcast"
              />
            </div>
            <div className=" grid">
              <label className=" p-1 font-bold">Email</label>
              <input
                className="border p-2 rounded-lg"
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                placeholder="ejm: Carlos Belcast"
              />
            </div>
          </div>
        </div>
        <button className="button w-32 m-auto">Guardar</button>
      </form>
    </>
  );
};

FormRegistro.propTypes = {
  dataReload: PropTypes.func,
};

export default FormRegistro;
