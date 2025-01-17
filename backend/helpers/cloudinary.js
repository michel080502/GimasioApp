import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Configuracion de nuestro cloud
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
// Funcion para subir las imagenes
export async function uploadImage(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: "replit",
  });
}

// Funcion para eliminar imagenes
export async function deleteImage(public_id) {
  return await cloudinary.uploader.destroy(public_id);
}
