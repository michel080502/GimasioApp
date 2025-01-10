import pool from "../config/db.js";

const comprarMembresia = async (req, res) => {
  const { id_cliente, id_membresia, duracion_membresia } = req.body;
  try {
    const queryFindMembresia = `SELECT 
                                cm.id AS compra_id,
                                cm.cliente_id,
                                c.nombre AS cliente_nombre,
                                m.nombre AS membresia_nombre,
                                cm.fecha_compra,
                                cm.fecha_expiracion,
                                CASE 
                                    WHEN cm.fecha_expiracion = CURRENT_DATE THEN 'vence hoy'
                                    WHEN cm.fecha_expiracion > CURRENT_DATE THEN 
                                        CASE 
                                            WHEN cm.fecha_expiracion <= CURRENT_DATE + INTERVAL '7 days' THEN 'por vencer'
                                            ELSE 'activa'
                                    END
                                ELSE 'vencida'
                    END AS estado
    FROM compras_membresias cm
    JOIN clientes c ON cm.cliente_id = c.id
    JOIN membresias m ON cm.membresia_id = m.id
    WHERE cm.cliente_id = $1
        ORDER BY cm.fecha_compra DESC
        LIMIT 1;`;
    const { rows: clienteMembresia } = await pool.query(queryFindMembresia, [
      id_cliente,
    ]);
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
  } catch (error) {}
};

export { comprarMembresia };
