import pool from "../config/db.js";
import { uploadImage, deleteImage } from "../helpers/cloudinary.js";
import fs from "fs-extra";

const creatTrainer = async (req, res, next) => {
  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    especialidad,
    telefono,
    email,
  } = req.body;

  // Validaciones
  if (
    !nombre ||
    !apellidoPaterno ||
    !apellidoMaterno ||
    !especialidad ||
    !telefono ||
    !email === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "El formato del email es inválido." });
  }

  const telefonoRegex = /^[0-9]{10}$/;
  if (!telefonoRegex.test(telefono)) {
    return res
      .status(400)
      .json({ error: "El teléfono debe contener 10 dígitos numéricos." });
  }
  try {
    const query = "SELECT * FROM entrenadores WHERE email = $1";
    const { rows: trainer } = await pool.query(query, [email]);
    if (trainer.length > 0) {
      return res
        .status(400)
        .json({ error: "El email ya se encuentra registrado." });
    }
    let img = {};
    if (!req.files?.img) {
      return res.status(400).json({ error: "La imagen es obligatoria." });
    }
    const resultImg = await uploadImage(req.files.img.tempFilePath);
    img = {
      public_id: resultImg.public_id,
      secure_url: resultImg.secure_url,
    };
    await fs.unlink(req.files.img.tempFilePath);
    const queryInsert = `INSERT INTO entrenadores(nombre, apellido_paterno, apellido_materno, especialidad, telefono, email, activo,img_public_id, img_secure_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    const { rows: newTrainer } = await pool.query(queryInsert, [
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      especialidad,
      telefono,
      email,
      true,
      img.public_id || null,
      img.secure_url || null,
    ]);
    // Emitir el nuevo producto usando Socket.IO
    //req.io.emit("nuevo-cliente", nuevoCliente[0]);
    res.json({
      msg: "Entrenador registrado exitosamente",
      trainer: newTrainer[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el entrenador." });
  }
};
const getTrainers = async (req, res) => {
  try {
    const query = "SELECT * FROM entrenadores ";
    const { rows: trainers } = await pool.query(query);
    res.status(200).json(trainers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los entrenadores." });
  }
};
const updatedTrainer = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    especialidad,
    telefono,
    email,
  } = req.body;

  // Validación del id
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({ error: "El id proporcionado no es válido." });
  }
  // Validaciones de campos
  if (
    !nombre ||
    !apellidoPaterno ||
    !apellidoMaterno ||
    !especialidad ||
    !telefono ||
    !email === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "El formato del email es inválido." });
  }
  const telefonoRegex = /^[0-9]{10}$/;
  if (!telefonoRegex.test(telefono)) {
    return res
      .status(400)
      .json({ error: "El teléfono debe contener 10 dígitos numéricos." });
  }
  try {
    const query = "SELECT * FROM entrenadores WHERE id = $1";
    const { rows: trainer } = await pool.query(query, [id]);
    if (trainer.length === 0) {
      return res.status(404).json({
        error: "El entrenador no esta registrado en la base de datos.",
      });
    }
    const queryUpdate = `UPDATE entrenadores SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, especialidad = $4, telefono = $5, email = $6 WHERE id = $7 RETURNING *`;
    const { rows: updatedTrainer } = await pool.query(queryUpdate, [
      nombre !== undefined ? nombre : trainer[0].nombre,
      apellidoPaterno !== undefined
        ? apellidoPaterno
        : trainer[0].apellido_paterno,
      apellidoMaterno !== undefined
        ? apellidoMaterno
        : trainer[0].apellido_materno,
      especialidad !== undefined ? especialidad : trainer[0].especialidad,
      telefono !== undefined ? telefono : trainer[0].telefono,
      email !== undefined ? email : trainer[0].email,
      id,
    ]);
    res.json({
      msg: "Entrenador actualizado exitosamente.",
      trainer: updatedTrainer[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el entrenador." });
  }
};
const updateActive = async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;
  // Validación del id
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({ error: "El id proporcionado no es válido." });
  }
  // Validación del campo activo
  if (typeof activo !== "boolean") {
    return res.status(400).json({
      error:
        "El campo activo es obligatorio y debe ser de tipo booleano (true o false).",
    });
  }
  try {
    const query = "SELECT * FROM entrenadores WHERE id = $1";
    const { rows: trainer } = await pool.query(query, [id]);
    if (trainer.length === 0) {
      return res.status(404).json({
        error: "El entrenador no esta registrado en la base de datos.",
      });
    }
    const queryUpdate =
      "UPDATE entrenadores SET activo = $1 WHERE id = $2 RETURNING *";
    await pool.query(queryUpdate, [activo, id]);
    return res.json({ msg: "Estado del entrenador actualizado exitosamente." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al actualizar el estado del entrenador." });
  }
};
const deleteTrainer = async (req, res) => {
  const { id } = req.params;
  // Validación del id
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({ error: "El id proporcionado no es válido." });
  }
  try {
    const query = "SELECT * FROM entrenadores WHERE id = $1";
    const { rows: trainer } = await pool.query(query, [id]);
    if (trainer.length === 0) {
      return res.status(404).json({
        error: "El entrenador no esta registrado en la base de datos.",
      });
    }
    const queryDelete = "DELETE FROM entrenadores WHERE id = $1";
    await pool.query(queryDelete, [id]);
    if (trainer[0].img_public_id) {
      await deleteImage(trainer[0].img_public_id);
    }
    return res.json({ msg: "Entrenador eliminado exitosamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el entrenador." });
  }
};

export { creatTrainer, getTrainers, updateActive, updatedTrainer, deleteTrainer };
