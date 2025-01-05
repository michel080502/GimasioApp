import bcrypt from "bcrypt";
import pool from "../config/db.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, email, telefono, password } = req.body;

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
			INSERT INTO admins (nombre, apellidopaterno, apellidomaterno, email, telefono, password, token, confirmado)
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
    apellido: admin.apellido,
    email: admin.email,
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
      id: usuario.id, // Usamos 'id' porque en PostgreSQL es el nombre del campo
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
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

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
};
