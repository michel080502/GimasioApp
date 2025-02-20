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

  try {
    //Validarque los campos no estén vacíos
    if (
      !nombre ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !telefono ||
      !nacimiento ||
      !email ||
      !matricula
    ) {
      return res
        .status(400)
        .json({ msg: "Todos los campos son obligatorios." });
    }
    //Validar que el correo electrónico y el teléfono no estén registrados en la base de datos en un cliente activo
    const queryClienteActivo =
      "SELECT * FROM clientes WHERE (email = $1 OR telefono = $2)  AND eliminado = $3";
    const { rows: clienteExisteActivo } = await pool.query(queryClienteActivo, [
      email,
      telefono,
      false,
    ]);
    if (clienteExisteActivo.length > 0) {
      const mensajeError = clienteExisteActivo.some((c) => c.email === email)
        ? "El correo electrónico ya está registrado."
        : "El teléfono ya está registrado.";
      return res.status(400).json({ msg: mensajeError });
    }
    //Validar que el correo electrónico, el teléfono y la matrícula no estén registrados en la base de datos en un cliente inactivo
    const queryClienteInactivo =
      "SELECT * FROM clientes WHERE email = $1 AND telefono = $2 AND matricula = $3  AND eliminado = $4";
    const { rows: clienteExisteInactivo } = await pool.query(
      queryClienteInactivo,
      [email, telefono, matricula, true]
    );
    if (clienteExisteInactivo.length > 0) {
      // Reactivar el cliente inactivo
      const queryUpdateCliente =
        "UPDATE clientes SET eliminado = $1 WHERE id = $2 RETURNING *";
      const { rows: clienteReactivado } = await pool.query(queryUpdateCliente, [
        false,
        clienteExisteInactivo[0].id,
      ]);
      return res.json({
        msg: "Cliente reactivado exitosamente",
        cliente: clienteReactivado[0],
      });
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

  // Consulta para verificar si el cliente existe
  const queryFind = "SELECT * FROM clientes WHERE id = $1 AND eliminado = $2";

  try {
    const { rows: cliente } = await pool.query(queryFind, [id, false]);
    if (cliente.length === 0) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    // Validar datos antes de la actualización (opcional según tus necesidades)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ msg: "Correo electrónico no válido" });
    }

    // Consulta para actualizar el cliente
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
      WHERE id = $8 AND eliminado = $9
      RETURNING *
    `;

    const { rows: clienteActualizado } = await pool.query(queryUpdate, [
      nombre || cliente[0].nombre,
      apellidoPaterno || cliente[0].apellido_paterno,
      apellidoMaterno || cliente[0].apellido_materno,
      telefono || cliente[0].telefono,
      email || cliente[0].email,
      nacimiento || cliente[0].nacimiento,
      matricula || cliente[0].matricula,
      id,
      false,
    ]);

    res.json({
      msg: "Cliente modificado correctamente",
      cliente: clienteActualizado[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al modificar el cliente" });
  }
};

const getAll = async (req, res) => {
  try {
    const selectQuery =
      "SELECT * FROM clientes WHERE eliminado = false ORDER BY id DESC;";
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

  const deleteQuery =
   
    "UPDATE clientes SET eliminado = true WHERE id = $1 RETURNING *";

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

const registrarAsistencia = async (req, res) => {
  const { matricula_cliente } = req.body;
  //Valida si el campo matricula_cliente fue enviado en la solicitud
  if (!matricula_cliente) {
    return res.status(400).json({
      msg: "El campo matricula_cliente es obligatorio",
    });
  }
  try {
    //Valida si el cliente existe en la base de datos
    const queryFindCliente = "SELECT * FROM clientes WHERE matricula = $1";
    const { rows: cliente } = await pool.query(queryFindCliente, [
      matricula_cliente,
    ]);
    if (cliente.length === 0) {
      return res.status(404).json({
        msg: "Cliente no encontrado en la base de datos",
      });
    }
    //Valida si el cliente tiene una membresia activa para poder registrar la visita
    const queryFindMembresia = `SELECT * FROM vista_membresias_clientes WHERE cliente_matricula = $1`;
    const { rows: membresia } = await pool.query(queryFindMembresia, [
      matricula_cliente,
    ]);
    if (membresia.length === 0) {
      return res.status(404).json({
        msg: "El cliente no cuenta con una membresia",
      });
    }
    //Valida si la membresia del cliente esta vencida
    if (membresia[0].estado == "Vencida") {
      return res.status(404).json({
        msg: "El cliente no cuenta con una membresia activa",
      });
    }
    //Valida si el cliente ya asistió el día de hoy
    const queryFindAsistencia = `SELECT * FROM asistencias WHERE cliente_id = $1 AND fecha_asistencia::date = NOW()::date`;
    const { rows: asistencia } = await pool.query(queryFindAsistencia, [
      cliente[0].id,
    ]);
    if (asistencia.length > 0) {
      return res.status(400).json({
        msg: "El cliente ya asistió el día de hoy",
      });
    }
    //Registra la visita del cliente
    const queryInsert = `INSERT INTO asistencias(cliente_id, fecha_asistencia) VALUES ($1, NOW())`;
    const { rows: visita } = await pool.query(queryInsert, [cliente[0].id]);
    res.status(201).json({
      msg: "Visita registrada exitosamente",
      visita: visita[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};
const obtenerAsistencias = async (req, res) => {
  try {
    const query = `SELECT * FROM vista_asistencias`;
    const { rows: asistencias } = await pool.query(query);
    res.json(asistencias);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
}

export { crear, update, getAll, getById, deleteById, obtenerClientesNoActivos, registrarAsistencia,obtenerAsistencias};
