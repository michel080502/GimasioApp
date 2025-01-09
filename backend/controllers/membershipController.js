import pool from "../config/db.js";

const obtenerTodas = async (req, res) => {
  try {
    const querySelect = "SELECT * FROM membresias";
    const { rows: membresias } = await pool.query(querySelect);
    return res.status(200).json(membresias);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Hubo error al obtener los datos de las membresias" });
  }
};
const crear = async (req, res) => {
  try {
    const { nombre, beneficios, duracion_dias, precio } = req.body;

    //Valida que los campos ingresados no esten vacios
    if (!nombre || !beneficios || !duracion_dias || !precio) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    //Filtra las membresias creadas anteriormente y valida si ya existe una con el nombre ingresado
    const filterquery = "SELECT * FROM membresias WHERE nombre = $1";
    const { rows: membresiaExiste } = await pool.query(filterquery, [nombre]);
    if (membresiaExiste.length > 0) {
      return res
        .status(400)
        .json({ msg: "Ya existe una membresia con ese nombre." });
    }

    //Inserta la membresia a la base de datos
    const insertQuery = `
        INSERT INTO membresias (nombre, beneficios, duracion_dias, precio, disponible)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
    const { rows: nuevaMembresia } = await pool.query(insertQuery, [
      nombre,
      beneficios,
      duracion_dias,
      precio,
      true,
    ]);
    // Emitir el nueva Membresia usando Socket.IO
    req.io.emit("nueva-Membresia", nuevaMembresia[0]);

    res.status(201).json({
      msg: "Membresia creada exitosamente",
      membresia: nuevaMembresia[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar la membresia" });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, beneficios, duracion_dias, precio, disponible } = req.body;
    const queryFind = "SELECT * FROM membresias WHERE id = $1";
    const { rows: membresia } = await pool.query(queryFind, [id]);
    //Valida si la membresia existe en la base de datos mediante su ID
    if (membresia.length === 0) {
      return res
        .status(404)
        .json({ msg: "Membresia no encontrada en la base de datos" });
    }
    const queryUpdate = `
    UPDATE membresias
    SET 
      nombre = $1, 
      beneficios = $2, 
      duracion_dias = $3, 
      precio = $4,
      disponible = $5
    WHERE id = $6
  `;
    //Actualiza el registroe en la base de datos
    await pool.query(queryUpdate, [
      nombre !== undefined ? nombre : membresia[0].nombre,
      beneficios !== undefined ? beneficios : membresia[0].beneficios,
      duracion_dias !== undefined ? duracion_dias : membresia[0].duracion_dias,
      precio !== undefined ? precio : membresia[0].precio,
      disponible !== undefined ? disponible : membresia[0].disponible,
      id,
    ]);
    res.json({ msg: "Cliente modificado correctamente" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Hubo error al actualizar los datos de la membresia" });
  }
};

const actualizarDisponible = async (req, res) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;
    const queryFind = "SELECT * FROM membresias WHERE id = $1";
    const { rows: membresia } = await pool.query(queryFind, [id]);
    if (membresia.length === 0) {
      return res
        .status(404)
        .json({ msg: "Membresia no encontrada en la base de datos" });
    }
    const queryUpdate = `
      UPDATE membresias
      SET 
        disponible = $1
      WHERE id = $2
    `;
    await pool.query(queryUpdate, [
      disponible !== undefined ? disponible : membresia[0].disponible,
      id,
    ]);
    res.json({ msg: "Cliente modificado correctamente" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Hubo error al actualizar los datos de la membresia" });
  }
};

const elimiarPorId = async (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM membresias WHERE id = $1 RETURNING *";

  try {
    const { rows: membresiaEliminada } = await pool.query(deleteQuery, [id]);
    //Valida que la membresia se haya eliminado correctamente
    if (membresiaEliminada.length === 0) {
      const error = new Error("Membresia no encontrada en la base de datos");
      return res.status(400).json({ msg: error.message });
    }
    return res.json({ msg: "Membresia eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

const obtnerNumeroMembresias = async (req, res) => {
  try {
    const querySelect = "SELECT COUNT(*) AS total_registros FROM membresias";
    const { rows: totalMembresias } = await pool.query(querySelect);
    return res.status(200).json(totalMembresias);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        msg: "Hubo error al obtener el total de membresias en el sistema",
      });
  }
};

const obtenerMembresiaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const querySelect = "SELECT * FROM membresias WHERE id = $1";
    const { rows: Membresia } = await pool.query(querySelect, [id]);
    if (Membresia.length === 0) {
      const error = new Error("Membresia no encontrada en la base de datos");
      return res.status(400).json({ msg: error.message });
    }
    return res.status(200).json(Membresia);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo error al obtener los datos de la Membresia" });
  }
};

export {
  crear,
  actualizar,
  actualizarDisponible,
  elimiarPorId,
  obtenerTodas,
  obtnerNumeroMembresias,
  obtenerMembresiaPorId,
};
