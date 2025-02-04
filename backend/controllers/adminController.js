import bcrypt from "bcrypt";
import pool from "../config/db.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import { emailConExcel, upload } from "../helpers/emailExcel.js";
import e from "express";

const registrar = async (req, res) => {
  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    email,
    telefono,
    password,
  } = req.body;

  //Prevenir duplicado de email
  const query = "SELECT * FROM admins WHERE email = $1";

  try {
    const { rows } = await pool.query(query, [email]);
    if (rows.length > 0) {
      const error = new Error("Usuario ya registrado");
      return res.status(400).json({ msg: error.message });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = generarId();

    const insertQuery = `
			INSERT INTO admins (nombre, apellido_paterno, apellido_materno, email, telefono, password, token, confirmado)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
		`;

    const { rows: newAdmin } = await pool.query(insertQuery, [
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      telefono,
      hashedPassword,
      token,
      false,
    ]);

    emailRegistro({
      email,
      nombre,
      token: newAdmin[0].token,
    });

    res.json({
      msg: "Usuario registrado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor." });
  }
};

const perfil = (req, res) => {
  const { admin } = req;
  res.json({
    id: admin.id,
    nombre: admin.nombre,
    apellidoPaterno: admin.apellido_paterno,
    apellidoMaterno: admin.apellido_materno,
    email: admin.email,
    telefono: admin.telefono,
    fecha_creacion: admin.fecha_creacion,
  });
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const query = "SELECT * FROM admins WHERE token = $1";
  const { rows: admin } = await pool.query(query, [token]);
  if (admin.length === 0) {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const updateQuery = `
      UPDATE admins
      SET token = NULL, confirmado = TRUE
      WHERE token = $1
      RETURNING *
    `;
    const { rows: updateAdmin } = await pool.query(updateQuery, [token]);
    res.json({
      msg: "Usuario confirmado correctamente!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error al confirmar el usuario." });
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si existe el usuario en la base de datos
  const query = "SELECT * FROM admins WHERE email = $1";
  try {
    const { rows } = await pool.query(query, [email]);
    if (rows.length === 0) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }

    const usuario = rows[0];

    // Comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
      const error = new Error("Tu cuenta no está confirmada");
      return res.status(404).json({ msg: error.message });
    }

    // Revisar la contraseña
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) {
      const error = new Error("El password es incorrecto");
      return res.status(404).json({ msg: error.message });
    }

    // Generar el token JWT
    const token = generarJWT(usuario.id);

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellido_paterno,
      apellidoMaterno: usuario.apellido_materno,
      email: usuario.email,
      telefono: usuario.telefono,
      fecha_creacion: usuario.fecha_creacion,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  // Comprobamos que exista
  const query = "SELECT * FROM admins WHERE email= $1";
  try {
    const { rows: admin } = await pool.query(query, [email]);
    if (admin.length === 0) {
      const error = new Error("Usuario no existe");
      return res.status(400).json({ msg: error.message });
    }

    const token = generarId();
    // Actualizamos token
    const updateQuery =
      "UPDATE admins SET token = $1 WHERE id = $2 RETURNING *";
    const { rows: updateAdmin } = await pool.query(updateQuery, [
      token,
      admin[0].id,
    ]);
    emailOlvidePassword({
      email,
      nombre: updateAdmin[0].nombre,
      token: updateAdmin[0].token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error al enviar email al usuario." });
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const query = "SELECT * FROM admins WHERE token = $1";
  try {
    const { rows: admin } = await pool.query(query, [token]);
    if (admin.length === 0) {
      const error = new Error("Token no valido");
      return res.status(400).json({ msg: error.message });
    }
    res.json({ msg: "El token es valido" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo error al obtener el token de la base" });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const query = "SELECT * FROM admins WHERE token = $1";

  try {
    const { rows: admin } = await pool.query(query, [token]);
    if (admin.length === 0) {
      const error = new Error("Token invalido");
      return res.status(400).json({ msg: error.message });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const queryUpdate =
      "UPDATE admins SET token = $1, password = $2 WHERE id = $3 RETURNING *";
    const { rows: updateAdmin } = await pool.query(queryUpdate, [
      null,
      hashedPassword,
      admin[0].id,
    ]);
    console.log(updateAdmin, admin);
    if (updateAdmin.length === 0) {
      const error = new Error("No se pudo actualizar la contraseña");
      return res.status(400).json({ msg: error.message });
    }
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo error al actualizar" });
  }
};

const actualizar = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidoPaterno, apellidoMaterno, email, telefono } =
    req.body;
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    const error = new Error("El id proporcionado no es válido.");
    return res.status(400).json({ msg: error.message });
  }

  if (!nombre || !apellidoPaterno || !apellidoMaterno || !email || !telefono) {
    const error = new Error(
      "No se proporcionaron todos los campos para actualizar."
    );
    return res.status(400).json({ msg: error.message });
  }

  const query = "SELECT * FROM admins WHERE id = $1";
  try {
    const { rows: admin } = await pool.query(query, [id]);
    if (admin.length === 0) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    const updateQuery = `
      UPDATE admins
      SET 
        nombre = COALESCE($1, nombre),
        apellido_paterno = COALESCE($2, apellido_paterno),
        apellido_materno = COALESCE($3, apellido_materno),
        email = COALESCE($4, email),
        telefono = COALESCE($5, telefono)
      WHERE id = $6
    `;

    const values = [
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      telefono,
      id,
    ];

    const { rows: updatedAdmin } = await pool.query(updateQuery, values);

    res.json({
      msg: "Usuario actualizado exitosamente.",
      admin: updatedAdmin[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al actualizar el usuario." });
  }
};

const actualizarInfoGym = async (req, res) => {
  const {
    nombre_gimnasio,
    horario_apertura,
    horario_cierre,
    precio_visita,
    email_envio_reportes,
    direccion,
    telefono,
  } = req.body;

  // Consulta en la base de datos si ya está generada la instancia del gym
  const query = "SELECT * FROM configuracion_gym";
  try {
    const { rows: config } = await pool.query(query);
    if (config.length === 0) {
      // Si no está generada la instancia, se crea una nueva
      const insertQuery = `
        INSERT INTO configuracion_gym (nombre_gimnasio, horario_apertura, horario_cierre, precio_visita, email_envio_reportes, direccion, telefono)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      const result = await pool.query(insertQuery, [
        nombre_gimnasio,
        horario_apertura,
        horario_cierre,
        precio_visita,
        email_envio_reportes,
        direccion,
        telefono,
      ]);
      if (result.rowCount > 0) {
        return res.json({ msg: "Configuración del gimnasio realizada" });
      } else {
        return res
          .status(500)
          .json({ msg: "No se pudo realizar la configuración del gimnasio" });
      }
    } else {
      // Si ya está generada la instancia, se actualizan los datos
      const updateQuery = `
        UPDATE configuracion_gym
        SET 
          nombre_gimnasio = $1,
          horario_apertura = $2,
          horario_cierre = $3,
          precio_visita = $4,
          email_envio_reportes = $5,
          direccion = $6,
          telefono = $7
        WHERE id = $8
      `;
      const result = await pool.query(updateQuery, [
        nombre_gimnasio,
        horario_apertura,
        horario_cierre,
        precio_visita,
        email_envio_reportes,
        direccion,
        telefono,
        config[0].id,
      ]);
      if (result.rowCount > 0) {
        return res.json({ msg: "Configuración del gimnasio actualizada" });
      } else {
        return res
          .status(500)
          .json({ msg: "No se pudo actualizar la configuración del gimnasio" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

const obtenerInfoGym = async (req, res) => {
  const query =
    "SELECT nombre_gimnasio, horario_apertura, horario_cierre, precio_visita, email_envio_reportes, direccion, telefono FROM configuracion_gym";
  try {
    const { rows: config } = await pool.query(query);
    if (config.length === 0) {
      const error = new Error("No se ha configurado el gimnasio");
      return res.status(404).json({ error: error.message });
    }
    res.json(config[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

const enviarExcel = async (req, res) => {
  try {
    const archivoPath = req.file.path; // `req.file` es procesado por `multer`
    const query = "SELECT email_envio_reportes FROM configuracion_gym";
    const {rows:email} = await pool.query(query);

    if (email.length === 0) {
      return res.status(404).json({ error: "No se ha configurado el email para enviar los reportes, por favor configurelo" });
    }
    console.log(email[0].email_envio_reportes);
    const destinatario = email[0].email_envio_reportes;
    await emailConExcel(destinatario, archivoPath );

    res.json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
};
export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizar,
  actualizarInfoGym,
  obtenerInfoGym,
  enviarExcel,
};
