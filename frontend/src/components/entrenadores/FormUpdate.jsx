import { MdAddPhotoAlternate, MdAddAPhoto } from "react-icons/md";
import { FaRegFileImage } from "react-icons/fa";

import Alerta from "../Alerta";
import Camera from "../ui/Camera";

import { useState } from "react";

const FormUpdate = () => {
  const [file, setFile] = useState(null);

  const [alerta, setAlerta] = useState({ msg: "", error: false });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showOptions, setShowOptions] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file == null) {
      setAlerta({ msg: "Por favor selecciona imagen", error: true });
      return;
    }
    setAlerta({ msg: "Ok", error: false });
  };
  const { msg } = alerta;
  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const resizeImage = (file, size = 300) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Configura el tamaño del canvas
        canvas.width = size;
        canvas.height = size;

        // Escala la imagen y centra
        const scale = Math.max(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;

        // Rellena el fondo (opcional)
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, size, size);

        // Dibuja la imagen redimensionada y centrada
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          x,
          y,
          img.width * scale,
          img.height * scale
        );

        // Convierte a blob para enviar al backend
        canvas.toBlob(
          (blob) => resolve(blob),
          "image/jpeg",
          0.8 // Calidad de compresión
        );
      };

      img.onerror = (err) => reject(err);
    });
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
                placeholder="ejm: Carlos Belcast"
              />
            </div>
            <div className=" grid ">
              <label className=" p-1 font-bold">Apellido Paterno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                placeholder="Carlos Belcast"
              />
            </div>
            <div className=" grid">
              <label className=" p-1 font-bold">Apellido Materno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                placeholder="Carlos Belcast"
              />
            </div>
            <div className=" grid col-span-2">
              <label className=" p-1 font-bold">Especialidad</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                placeholder="ejm: Carlos Belcast"
              />
            </div>
            <div className=" grid">
              <label className=" p-1 font-bold">Telefono</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                placeholder="ejm: Carlos Belcast"
              />
            </div>
            <div className=" grid">
              <label className=" p-1 font-bold">Email</label>
              <input
                className="border p-2 rounded-lg"
                type="email"
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

export default FormUpdate;
