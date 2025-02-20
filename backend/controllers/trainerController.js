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
    const error = new Error("Todos los campos son obligatorios");
    return res.status(400).json({ msg: error.message });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error("El formato email no es valido");
    return res.status(400).json({ msg: error.message });
  }

  const telefonoRegex = /^[0-9]{10}$/;
  if (!telefonoRegex.test(telefono)) {
    const error = new Error("El teléfono debe contener 10 dígitos numéricos.");
    return res.status(400).json({ msg: error.message });
  }
  try {
    const query = "SELECT * FROM entrenadores WHERE email = $1";
    const { rows: trainer } = await pool.query(query, [email]);
    if (trainer.length > 0) {
      const error = new Error("El email ya está registrado");
      return res.status(409).json({ msg: error.message });
    }
    let img = {};
    if (!req.files?.img) {
      const error = new Error("La imagen este obligatoria");
      return res.status(400).json({ msg: error.message });
    }
    const resultImg = await uploadImage(req.files.img.tempFilePath);
    img = {
      public_id: resultImg.public_id,
      secure_url: resultImg.secure_url,
    };
    await fs.unlink(req.files.img.tempFilePath);

    const queryInsert = `INSERT INTO entrenadores(nombre, apellido_paterno, apellido_materno, especialidad, telefono, email, img_public_id, img_secure_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const { rows: newTrainer } = await pool.query(queryInsert, [
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      especialidad,
      telefono,
      email,
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
    console.error(error);
    res.status(500).json({ msg: "Error al crear el entrenador." });
  }
};
const getTrainers = async (req, res) => {
  try {
    const query = "SELECT * FROM entrenadores ";
    const { rows: trainers } = await pool.query(query);
    res.status(200).json(trainers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener los entrenadores." });
  }
};
const updatedTrainer = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    especialidad,
    telefono,
    email,
  } = req.body;

  // Validación del id
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    const error = new Error("El id no es valido");
    return res.status(400).json({ msg: error.msg });
  }
 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) && email) {
    const error = new Error("El formato email no es valido");
    return res.status(400).json({ msg: error.message });
  }
  const telefonoRegex = /^[0-9]{10}$/;
  if (!telefonoRegex.test(telefono) && telefono) {
    const error = new Error("El telefono debe contener 10 numeros.");
    return res.status(400).json({ msg: error.message });
  }
  try {
    const query = "SELECT * FROM entrenadores WHERE id = $1";
    const { rows: trainer } = await pool.query(query, [id]);
    if (trainer.length === 0) {
      const error = new Error("Entrenador no registrado");
      return res.status(404).json({ msg: error.message });
    }
    const queryUpdate = `
  UPDATE entrenadores
  SET 
    nombre = COALESCE($1, nombre),
    apellido_paterno = COALESCE($2, apellido_paterno),
    apellido_materno = COALESCE($3, apellido_materno),
    especialidad = COALESCE($4, especialidad),
    telefono = COALESCE($5, telefono),
    email = COALESCE($6, email)
  WHERE id = $7
  RETURNING *`;

    const { rows: updatedTrainer } = await pool.query(queryUpdate, [
      nombre,
      apellido_paterno,
      apellido_materno,
      especialidad,
      telefono,
      email,
      id,
    ]);

    res.json({
      msg: "Entrenador actualizado exitosamente.",
      trainer: updatedTrainer[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al actualizar el entrenador." });
  }
};
const updateActive = async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;
  // Validación del id
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    const error = new Error("El id proporcionado no es válido.");
    return res.status(400).json({ msg: error.message });
  }
  // Validación del campo activo
  if (typeof activo !== "boolean") {
    const error = new Error(
      "El campo activo es obligatorio y debe ser de tipo booleano (true o false)."
    );
    return res.status(400).json({ msg: error.message });
  }
  try {
    const query = "SELECT * FROM entrenadores WHERE id = $1";
    const { rows: trainer } = await pool.query(query, [id]);
    if (trainer.length === 0) {
      const error = new Error(
        "El entrenador no esta registrado en la base de datos."
      );
      return res.status(404).json({ msg: error.message });
    }
    const queryUpdate =
      "UPDATE entrenadores SET activo = $1 WHERE id = $2 RETURNING *";
    await pool.query(queryUpdate, [activo, id]);
    return res.json({ msg: "Estado del entrenador actualizado exitosamente." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error al actualizar el estado del entrenador." });
  }
};
const deleteTrainer = async (req, res) => {
  const { id } = req.params;
  // Validación del id
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    const error = new Error("El id proporcionado no es válido.");
    return res.status(400).json({ msg: error.message });
  }
  try {
    const query = "SELECT * FROM entrenadores WHERE id = $1";
    const { rows: trainer } = await pool.query(query, [id]);
    if (trainer.length === 0) {
      const error = new Error("El entrenador no esta registrado");
      return res.status(404).json({ msg: error.message });
    }
    const queryDelete = "DELETE FROM entrenadores WHERE id = $1";
    await pool.query(queryDelete, [id]);
    if (trainer[0].img_public_id) {
      await deleteImage(trainer[0].img_public_id);
    }
    return res.json({ msg: "Entrenador eliminado exitosamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar el entrenador." });
  }
};

export {
  creatTrainer,
  getTrainers,
  updateActive,
  updatedTrainer,
  deleteTrainer,
};
