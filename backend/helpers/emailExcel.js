import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import { info } from "console";

// Configurar `multer` para guardar archivos temporalmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Carpeta donde se guardará temporalmente el archivo
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Conservar el nombre original del archivo
    }
  });

const upload = multer({ storage });

const emailConExcel = async ( email,  archivoPath ) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Enviar el correo con el archivo adjunto
  await transport.sendMail({
    from: "GymSpartans@demomailtrap.com",
    to: email,
    subject: "Reporte de Gym Spartans",
    text: `Hola, te enviamos el archivo Excel adjunto con el reporte solicitado.`,
    attachments: [
      {
        filename: path.basename(archivoPath), // Nombre del archivo
        path: archivoPath, // Ruta del archivo en el servidor
      },
    ],
  });

  // Eliminar el archivo después de enviarlo
  fs.unlinkSync(archivoPath);

  console.log("Correo enviado", info.messageId);
};

export { emailConExcel, upload };
