import pool from "../config/db.js";
import { uploadImage, deleteImage } from "../helpers/cloudinary.js";
import fs from "fs-extra";

const crear = async (req, res, next) => {
  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    telefono,
    nacimiento,
    email,
    matricula,
  } = req.body;

  const query = "SELECT * FROM clientes WHERE matricula = $1 OR email = $2";
  try {
    const { rows: clienteExiste } = await pool.query(query, [matricula, email]);
    if (clienteExiste.length > 0) {
      const mensajeError = clienteExiste.some((c) => c.matricula === matricula)
        ? "La matrícula ya está registrada."
        : "El correo electrónico ya está registrado.";
      return res.status(400).json({ msg: mensajeError });
    }

    let img = {};
    if (req.files?.img) {
      const resultImg = await uploadImage(req.files.img.tempFilePath);
      img = {
        public_id: resultImg.public_id,
        secure_url: resultImg.secure_url,
      };
      await fs.unlink(req.files.img.tempFilePath);
    }

    const insertQuery = `
	 	INSERT INTO clientes (nombre, apellido_paterno, apellido_materno, telefono, nacimiento, email, matricula, img_public_id, img_secure_url) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
	  `;

    const { rows: nuevoCliente } = await pool.query(insertQuery, [
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      telefono,
      nacimiento,
      email,
      matricula,
      img.public_id || null,
      img.secure_url || null,
    ]);

    // Emitir el nuevo cliente usando Socket.IO
    req.io.emit("nuevo-cliente", nuevoCliente[0]);

    res.json({
      msg: "Cliente registrado exitosamente",
      cliente: nuevoCliente[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar el cliente" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    telefono,
    email,
    nacimiento,
    matricula,
  } = req.body;

  const queryFind = "SELECT * FROM clientes WHERE id = $1 && eliminado = false";
  try {
    const { rows: cliente } = await pool.query(queryFind, [id]);
    if (cliente.length === 0) {
      const error = new Error("Cliente no encontrado");
      return res.status(404).json({ msg: error.message });
    }
    const queryUpdate = `
		UPDATE clientes
		SET 
			nombre = $1, 
			apellido_paterno = $2, 
			apellido_materno = $3, 
			telefono = $4, 
			email = $5, 
			nacimiento = $6, 
			matricula = $7
		WHERE id = $8
    && eliminado = false
	`;

    await pool.query(queryUpdate, [
      nombre || cliente[0].nombre,
      apellidoPaterno || cliente[0].apellido_paterno,
      apellidoMaterno || cliente[0].apellido_materno,
      telefono || cliente[0].telefono,
      email || cliente[0].email,
      nacimiento || cliente[0].nacimiento,
      matricula || cliente[0].matricula,
      id,
    ]);

    res.json({ msg: "Cliente modificado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo error al ingresar el cliente" });
  }
};

const getAll = async (req, res) => {
  try {
    const selectQuery = "SELECT * FROM clientes WHERE eliminado = false ORDER BY id DESC;";
    const { rows: clientes } = await pool.query(selectQuery);
    // Convertir la fecha de nacimiento a solo fecha en formato YYYY-MM-DD
    const clientesFormateados = clientes.map((cliente) => ({
      ...cliente,
      nacimiento: cliente.nacimiento.toISOString().split("T")[0],
    }));
    res.json(clientesFormateados);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo error al obtener los clientes" });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM clientes WHERE id = $1 AND eliminado = false";
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({ error: "El id proporcionado no es válido." });
  }
  try {
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      const error = new Error("Cliente no encontrado");
      return res.status(400).json({ msg: error.message });
    }
    const clienteFormateado = {
      ...rows[0],
      nacimiento: rows[0].nacimiento.toISOString().split("T")[0],
    };

    return res.json(clienteFormateado);
  } catch (error) {
    console.log(error);
  }
};

const deleteById = async (req, res) => {
  const { id } = req.params;

  const deleteQuery = "UPDATE clientes SET eliminado = true WHERE id = $1 RETURNING *";

  try {
    const { rows: deletedClient } = await pool.query(deleteQuery, [id]);
    if (deletedClient.length === 0) {
      const error = new Error("Cliente no encontrado");
      return res.status(400).json({ msg: error.message });
    }
    return res.json({ msg: "Cliente eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

const obtenerClientesNoActivos = async (req, res) => {
  try {
    const query = "SELECT * FROM vista_clientes_sin_membresia";
    const { rows: clientes } = await pool.query(query);
    res.json(clientes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

export { crear, update, getAll, getById, deleteById, obtenerClientesNoActivos };
