import pool from "../config/db.js";

const obtenerTodas = async (req, res) => {
  try {
    const querySelect =
      "SELECT * FROM membresias WHERE eliminado = false ORDER BY id DESC";
    const { rows: membresias } = await pool.query(querySelect);
    const membresiasConvertidas = membresias.map((membresia) => ({
      ...membresia,
      precio: parseFloat(membresia.precio),
    }));
    return res.status(200).json(membresiasConvertidas);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Hubo error al obtener los datos de las membresias" });
  }
};
const crear = async (req, res) => {
  try {
    const { nombre, beneficios, duracion, precio } = req.body;
    //Valida que los campos ingresados no esten vacios
    if (!nombre || !beneficios || !duracion || !precio) {
      return res
        .status(400)
        .json({ msg: "Todos los campos son obligatorios." });
    }

    //Filtra las membresias creadas anteriormente y valida si ya existe una con el nombre ingresado
    const filterquery = "SELECT * FROM membresias WHERE nombre = $1";
    const { rows: membresiaExiste } = await pool.query(filterquery, [nombre]);
    if (membresiaExiste.length > 0) {
      const error = new Error("Ya existe membresia con ese nombre");
      return res.status(409).json({ msg: error.message });
    }

    //Inserta la membresia a la base de datos
    const insertQuery = `
        INSERT INTO membresias (nombre, beneficios, duracion_dias, precio)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
    const { rows: nuevaMembresia } = await pool.query(insertQuery, [
      nombre,
      beneficios,
      duracion,
      precio,
    ]);
    // Emitir el nueva Membresia usando Socket.IO
    // req.io.emit("nueva-Membresia", nuevaMembresia[0]);

    res.status(201).json({
      msg: `Membresia ${nuevaMembresia[0].nombre} creada exitosamente`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar la membresia" });
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
      const error = new Error("Membresia no encontrada en la base de datos");
      return res.status(404).json({ msg: error.message });
    }
    const queryUpdate = `
    UPDATE membresias
    SET 
      nombre = COALESCE($1, nombre), 
      beneficios = COALESCE($2, beneficios),
      duracion_dias = COALESCE($3, duracion_dias), 
      precio = COALESCE($4, precio),
      disponible = COALESCE($5, disponible)
    WHERE id = $6
  `;
    //Actualiza el registroe en la base de datos
    await pool.query(queryUpdate, [
      nombre,
      beneficios,
      +duracion_dias,
      +precio,
      disponible,
      id,
    ]);
    res.json({ msg: "Dato modificado correctamente" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Hubo error al actualizar los datos de la membresia" });
  }
};

const actualizarDisponible = async (req, res) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;
    const queryFind = "SELECT * FROM membresias WHERE id = $1";
    const { rows: membresia } = await pool.query(queryFind, [id]);
    if (membresia.length === 0) {
      const error = new Error("Membresia no encontrada en la base de datos");
      return res.status(404).json({ msg: error.message });
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
    res.json({ msg: "Estado de disponibilidad cambiado correctamente" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Hubo error al actualizar los datos de la membresia" });
  }
};

const elimiarPorId = async (req, res) => {
  const { id } = req.params;

  const queryFind = "SELECT * FROM membresias WHERE id = $1";

  try {
    const { rows: membresia } = await pool.query(queryFind, [id]);
    //Valida que la membresia se haya eliminado correctamente
    if (membresia.length === 0) {
      const error = new Error("Membresia no encontrada en la base de datos");
      return res.status(404).json({ msg: error.message });
    }
    const logicalErese = `UPDATE membresias SET eliminado = $1 WHERE id = $2 `;
    await pool.query(logicalErese, [true, id]);
    return res.json({ msg: "Membresia eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

const obtnerNumeroMembresias = async (req, res) => {
  try {
    const querySelect =
      "SELECT COUNT(*) AS membresias_registradas FROM membresias";
    const { rows: totalMembresias } = await pool.query(querySelect);

    return res.status(200).json(totalMembresias);
  } catch (error) {
    console.log(error);
    res.status(500).json({
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
      return res.status(404).json({ error: error.message });
    }
    return res.status(200).json(Membresia);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Hubo error al obtener los datos de la Membresia" });
  }
};

const obtenerMembresiasClientes = async (req, res) => {
  try {
    const querySelect = `SELECT * FROM vista_membresias_clientes`;
    const { rows: membresiasClientes } = await pool.query(querySelect);
    return res.status(200).json(membresiasClientes);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Hubo error al obtener los datos de las membresias" });
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
  obtenerMembresiasClientes,
};
