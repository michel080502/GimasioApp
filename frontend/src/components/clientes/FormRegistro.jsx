import { MdAddPhotoAlternate, MdAddAPhoto } from "react-icons/md";
import { FaRegFileImage } from "react-icons/fa";

import { useState, useRef } from "react";
import Alerta from "../Alerta";
import clienteAxios from "../../config/axios";
import PropTypes from "prop-types";

const FormRegistro = ({ reloadContent }) => {
  /* Campos formulario */
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [file, setFile] = useState(null);
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  /* Funciones botones */
  const [imagePreview, setImagePreview] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const generarMatricula = () => {
    if (nombre && apellidoPaterno && apellidoMaterno && telefono) {
      const nombreIniciales = nombre.slice(0, 2).toUpperCase(); // Primeras 2 letras del nombre
      const apellidoP = apellidoPaterno.slice(0, 1).toUpperCase(); // Primera letra del apellido paterno
      const apellidoM = apellidoMaterno.slice(0, 1).toUpperCase(); // Primera letra del apellido materno
      const telefonoFinal = telefono.slice(-4); // Últimos 4 dígitos del teléfono

      const nuevaMatricula = `${nombreIniciales}${apellidoP}${apellidoM}-${telefonoFinal}`;
      setMatricula(nuevaMatricula); // Actualizamos el estado con la matrícula generada
    } else {
      setAlerta({
        msg: "Completa todos los campos para generar la matrícula",
        error: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matricula) {
      setAlerta({
        msg: "Por favor genera la matrícula antes de registrar",
        error: true,
      });
      return;
    }
    if (!file) {
      setAlerta({ msg: "Por favor selecciona imagen", error: true });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("apellidoPaterno", apellidoPaterno);
      formData.append("apellidoMaterno", apellidoMaterno);
      formData.append("telefono", telefono);
      formData.append("nacimiento", nacimiento);
      formData.append("email", email);
      formData.append("matricula", matricula);
      formData.append("img", file);

      await clienteAxios.post(`/cliente/crear`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      reloadContent();
      setAlerta({
        msg: "Cliente creado correctamente",
        error: false,
      });
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alerta;

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

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const openCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.log("Error al acceder a camara:", error);
      alert("No se puede acceder a la camara");
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      // Dimensiones originales del video
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Determinar el tamaño del cuadrado
      const size = Math.min(videoWidth, videoHeight);

      // Calcular el recorte centrado
      const offsetX = (videoWidth - size) / 2;
      const offsetY = (videoHeight - size) / 2;

      // Configurar el lienzo para un tamaño cuadrado
      canvas.width = size;
      canvas.height = size;

      // Dibujar el video recortado y centrado
      context.drawImage(
        video,
        offsetX, // Recorte desde la izquierda
        offsetY, // Recorte desde arriba
        size, // Ancho del recorte
        size, // Alto del recorte
        0, // Posición X en el lienzo
        0, // Posición Y en el lienzo
        size, // Ancho en el lienzo
        size // Alto en el lienzo
      );

      // Obtener la imagen del lienzo en formato Base64
      const imageData = canvas.toDataURL("image/jpeg");
      setImagePreview(imageData);

      // Convertir base64 a Blob
      const byteString = atob(imageData.split(",")[1]);
      const mimeString = imageData.split(",")[0].split(":")[1].split(";")[0];
      const buffer = new Uint8Array(byteString.length);

      for (let i = 0; i < byteString.length; i++) {
        buffer[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([buffer], { type: mimeString });
      const file = new File([blob], "captured-photo.jpg", { type: mimeString });

      // Guardar el archivo
      setFile(file);

      // Detener la cámara después de la captura
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());

      setIsCameraOpen(false);
    }
  };

  const closeCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    setIsCameraOpen(false);
  };
  return (
    <>
      <form
        className="border p-3 grid gap-5 justify-center"
        onSubmit={handleSubmit}
      >
        {msg && <Alerta alerta={alerta} />}
        <div className="grid grid-cols-3 gap-6 relative">
          {/* Botton para cargar o tomar foto */}
          <div className="grid grid-rows-3 justify-center">
            <button
              type="button"
              className="w-3/4 h-3/4 m-auto cursor-pointer row-span-2"
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
            <button type="button" onClick={generarMatricula}>
              <input
                className="text-center text-3xl w-48 m-auto font-extrabold "
                type="text"
                value={matricula}
                placeholder="2020394"
                disabled
              />
              <p className="text-sm py-2 text-gray-500 hover:text-gray-600">
                Presiona para crear matricula
              </p>
            </button>

            {/* Opcion de subir foto o tomar */}
            {showOptions && (
              <div className="absolute top-1/2 mt-2 bg-white border rounded-lg shadow-lg w-48 z-10">
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
                        openCamera();
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
            <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-20">
              <video
                ref={videoRef}
                className="w-full max-w-md h-auto bg-black"
              />
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={closeCamera}
                >
                  Cerrar Cámara
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={capturePhoto}
                >
                  Capturar Foto
                </button>
              </div>
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
          )}

          <div className="col-span-2 grid gap-2 grid-cols-2">
            <div className=" grid col-span-2">
              <label className=" p-1 font-bold">Nombre(s)</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
              />
            </div>
            <div className=" grid ">
              <label className=" p-1 font-bold">Apellido Paterno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
                placeholder="Apellido"
              />
            </div>
            <div className=" grid ">
              <label className=" p-1 font-bold">Apellido Materno</label>
              <input
                className="border p-2 rounded-lg"
                type="text"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
                placeholder="Apellido"
              />
            </div>
            <div className=" grid ">
              <label className=" p-1 font-bold">Telefono</label>
              <input
                className="border p-2 rounded-lg"
                type="tel"
                maxLength={10}
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="2222345632"
              />
            </div>
            <div className=" grid ">
              <label className=" p-1 font-bold">Nacimiento</label>
              <input
                className="border p-2 rounded-lg"
                value={nacimiento}
                onChange={(e) => setNacimiento(e.target.value)}
                type="date"
              />
            </div>
            <div className=" grid col-span-2">
              <label className=" p-1 font-bold">Correo</label>
              <input
                className="border p-2 rounded-lg"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exp@ejemplo.com"
              />
            </div>
          </div>
        </div>

        <button className="button w-32 m-auto">Registrar</button>
      </form>
    </>
  );
};

FormRegistro.propTypes = {
  reloadContent: PropTypes.func,
};

export default FormRegistro;
