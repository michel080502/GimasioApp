import pool from "../config/db.js";

const comprarMembresia = async (req, res) => {
  const { id_cliente, id_membresia } = req.body;
  try {
    const findCliente = `SELECT * FROM clientes WHERE id = $1`;
    const { rows: clienteExiste } = await pool.query(findCliente, [id_cliente]);
    if (clienteExiste.length === 0) {
      const error = new Error("No existe el cliente");
      return res.status(404).json({ msg: error.message });
    }
    const queryFindMembresiaActiva = `SELECT * FROM vista_ultima_compra_membresia WHERE cliente_id = $1;`;
    const { rows: clienteMembresiaActiva } = await pool.query(
      queryFindMembresiaActiva,
      [id_cliente]
    );

    //Valida si el cliente ya cuenta con una membresia y que este activa
    if (
      clienteMembresiaActiva.length > 0 &&
      clienteMembresiaActiva[0].estado === "activa"
    ) {
      const error = new Error(
        "El cliente ya cuenta con una membresia activa y no puede adquirir otra simultaneamente"
      );
      console.log(clienteMembresiaActiva);
      return res.status(404).json({ msg: error.message });
    }
    const queryFindMemb = `SELECT * FROM membresias WHERE disponible = true AND id = $1`;
    const { rows: membresia } = await pool.query(queryFindMemb, [id_membresia]);
    //Valida si la membresia existe en la base de datos mediante su ID y este disponible para su compra
    if (membresia.length === 0) {
      const error = new Error(
        "Membresia no encontrada en la base de datos o no disponible para su compra"
      );
      return res.status(404).json({ msg: error.message });
    }
    const queryInsert = `INSERT INTO compras_membresias(cliente_id, membresia_id, fecha_compra, fecha_expiracion)
	VALUES ($1, $2, NOW(), NOW() + INTERVAL '${membresia[0].duracion_dias} days') RETURNING *`;
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

export { comprarMembresia };
