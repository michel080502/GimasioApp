import pool from "../config/db.js";

const comprarMembresia = async (req, res) => {
  const { id_cliente, id_membresia, duracion_membresia } = req.body;
  try {
    const queryFindMembresia = `SELECT * FROM public.vista_ultima_compra_membresia WHERE cliente_id = $1;`;
    const { rows: clienteMembresia } = await pool.query(queryFindMembresia, [
      id_cliente,
    ]);
    if (clienteMembresia.length === 0) {
      return res.status(404).json({
        msg: "Error al recuperar datos del cliente",
      });
    }
    //Valida si el cliente ya cuenta con una membresia y que este activa
    if (clienteMembresia[0].estado == "activa") {
      return res.status(404).json({
        msg: "El cliente ya cuenta con una membresia activa y no puede adquirir otra simultaneamente",
      });
    }
    const queryFindMemb = `SELECT * FROM membresias WHERE disponible = true AND id = $1`;
    const { rows: membresia } = await pool.query(queryFindMemb, [id_membresia]);
    //Valida si la membresia existe en la base de datos mediante su ID y este disponible para su compra
    if (membresia.length === 0) {
      return res.status(404).json({
        msg: "Membresia no encontrada en la base de datos o no disponible para su compra",
      });
    }
    const queryInsert = `INSERT INTO compras_membresias(cliente_id, membresia_id, fecha_compra, fecha_expiracion)
	VALUES ($1, $2, NOW(), NOW() + INTERVAL '${duracion_membresia} days') RETURNING *`;
    const { rows: compraMembresia } = await pool.query(queryInsert, [
      id_cliente,
      id_membresia,
    ]);
    res.status(201).json({
      msg: "Compra de membresia realizada exitosamente",
      compra: compraMembresia[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

const renovarMembresia = async (req, res) => {
  const { id_cliente, id_membresia } = req.body;
  //Valida si los campos id_cliente e id_membresia fueron enviados en la solicitud
  if (
    !id_cliente ||
    isNaN(id_cliente) ||
    !id_membresia ||
    isNaN(id_membresia)
  ) {
    return res.status(400).json({
      msg: "Los campos id_cliente e id_membresia son obligatorios y deben ser numericos",
    });
  }

  try {
    //Recupera la ultima membresia adquirida por el cliente
    const queryFindMembresia = `SELECT * FROM public.vista_ultima_compra_membresia WHERE cliente_id = $1 AND fecha_renovacion IS NULL;`;
    const { rows: ultimaCompra } = await pool.query(queryFindMembresia, [
      id_cliente,
    ]);

    //Valida si se recupero alguna membresia del cliente
    if (ultimaCompra.length === 0) {
      return res.status(404).json({
        msg: "Error al recuperar datos del cliente y de su ultima membresia adquirida",
      });
    }

    //Valida si se la membresia esta vencida para hacer la renovacion de la misma o si se vence ese mismo dia
    if (ultimaCompra[0].estado == "activa" && ultimaCompra[0].fecha_expiracion > new Date()) {
      return res.status(404).json({
        msg: "La membresia del cliente aun esta activa, no es necesario renovarla",
      });
    }
    
    //Valida si la membresia existe en la base de datos mediante su ID y este disponible para su compra
    const queryFindMemb = `SELECT * FROM membresias WHERE disponible = true AND id = $1`;
    const { rows: membresia } = await pool.query(queryFindMemb, [id_membresia]);
    if (membresia.length === 0) {
      return res.status(404).json({
        msg: "Membresia no encontrada en la base de datos o no disponible para su compra",
      });
    }

    //Valida que la membresia que se desea renovar no sea la misma que ya tiene activa
    if (ultimaCompra[0].membresia_id != id_membresia) {
      return res.status(404).json({
        msg: "La membresia que desea renovar no coincide con la membresia activa del cliente",
      });
    }

    // Establece la fecha de renovación en la compra de la membresia
    const queryUpdate = `UPDATE compras_membresias SET fecha_renovacion = NOW() WHERE id = $1`;
    const result = await pool.query(queryUpdate, [ultimaCompra[0].compra_id]);
    if (result.rowCount === 0) {
      return res.status(400).json({
        msg: "No se pudo actualizar la fecha de renovación. Verifique el ID de la compra.",
      });
    }

    //Realiza la insercion de la renovacion de membresia
    const queryInsert = `INSERT INTO compras_membresias(cliente_id, membresia_id, fecha_compra, fecha_expiracion)
    VALUES ($1, $2, NOW(), NOW() + INTERVAL '${membresia[0].duracion_dias} days') RETURNING *`;
    const { rows: renovacionMembresia } = await pool.query(queryInsert, [
      id_cliente,
      id_membresia,
    ]);

    //Devuelve la respuesta con la renovacion de membresia
    res.status(201).json({
      msg: "Renovación de membresia realizada exitosamente",
      renovacion: renovacionMembresia[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

export { comprarMembresia, renovarMembresia };
