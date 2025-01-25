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
    if (
      ultimaCompra[0].estado == "activa" &&
      ultimaCompra[0].fecha_expiracion > new Date()
    ) {
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

const comprarProductos = async (req, res) => {
  const { cliente, productos, total } = req.body;

  // Validación básica de productos y total
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res
      .status(400)
      .json({ msg: "Debe proporcionar al menos un producto válido." });
  }
  if (!total || isNaN(total)) {
    return res
      .status(400)
      .json({ msg: "El total es obligatorio y debe ser un número válido." });
  }

  // Validar que cliente tenga un ID o datos de cliente externo
  if (!cliente) {
    return res.status(400).json({
      msg: "Debe proporcionar la informacion del cliente.",
    });
  }

  try {
    // Verificar si el cliente es externo o registrado
    const esClienteExterno = isNaN(cliente) && typeof cliente === "string";
    //Validar si el cliente existe en la base
    if (!esClienteExterno) {
      const checkCliente = `SELECT * FROM clientes WHERE id = $1 AND eliminado = false;`;
      const { rows: clienteRegistrado } = await pool.query(checkCliente, [
        cliente,
      ]);
      if (clienteRegistrado.length === 0) {
        return res
          .status(404)
          .json({ msg: "El cliente no existe o ha sido eliminado." });
      }
    }
    // Query para insertar la venta dependiendo si es cliente externo o registrado
    const ventaInsert = esClienteExterno
      ? `INSERT INTO ventas (cliente_externo, fecha_venta, total) VALUES ($1, $2, $3) RETURNING *;`
      : `INSERT INTO ventas (cliente_id, fecha_venta, total) VALUES ($1, $2, $3) RETURNING *;`;

    // Verificar stock para cada producto
    for (const producto of productos) {
      const { id, cantidad } = producto;
      // Validación básica de cada producto
      if (!id || !cantidad || isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({
          msg: "Cada producto debe tener un ID válido y una cantidad mayor a 0.",
        });
      }
      // Consultar el stock del producto
      const queryStock = `SELECT * FROM productos WHERE id = $1;`;
      const { rows } = await pool.query(queryStock, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          msg: `El producto con ID ${id} no existe.`,
        });
      }

      const stockDisponible = rows[0].stock;
      // Validar si hay suficiente stock
      if (stockDisponible < cantidad) {
        return res.status(400).json({
          msg: `No hay suficiente stock para el producto '${rows[0].nombre}' Disponible: ${stockDisponible}, Requerido: ${cantidad}.`,
        });
      }
    }

    // Realizar la venta
    const { rows: venta } = await pool.query(ventaInsert, [
      cliente,
      new Date(),
      total,
    ]);
    //Insertas los productos de la venta en la tabla detalle_ventas y actualiza el stock de los productos
    for (const producto of productos) {
      const { id, cantidad } = producto;
      const queryUpdateStock = `UPDATE productos SET stock = stock - $1 WHERE id = $2 RETURNING *;`;
      const { rows: productoActualizado } = await pool.query(queryUpdateStock, [
        cantidad,
        id,
      ]);
      const queryInsertDetalle = `INSERT INTO detalles_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5);`;
      await pool.query(queryInsertDetalle, [
        venta[0].id,
        id,
        cantidad,
        productoActualizado[0].precio,
        productoActualizado[0].precio * cantidad,
      ]);
    }
    //Confirmar el total de la venta
    const queryUpdateTotal = `UPDATE ventas SET total = (SELECT SUM(subtotal) FROM detalles_ventas WHERE venta_id = $1) WHERE id = $1;`;
    await pool.query(queryUpdateTotal, [venta[0].id]);

    //Devuelve la respuesta con la venta realizada
    return res
      .status(201)
      .json({ msg: "Venta realizada con éxito", venta: venta[0] });
  } catch (error) {
    console.log(error);
    console.error("Error al realizar la venta:", error.message);
    return res.status(500).json({ msg: "Hubo un error al procesar la venta." });
  }
};


export { comprarMembresia, renovarMembresia, comprarProductos };
