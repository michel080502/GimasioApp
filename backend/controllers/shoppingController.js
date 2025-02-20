import pool from "../config/db.js";

const comprarMembresia = async (req, res) => {
  const { id_cliente, id_membresia } = req.body;
  try {
    //Validamos si el cliente existe la baswe de datos
    const findCliente = `SELECT * FROM clientes WHERE id = $1 AND eliminado = false`;
    const { rows: clienteExiste } = await pool.query(findCliente, [id_cliente]);
    if (clienteExiste.length === 0) {
      const error = new Error("No existe el cliente");
      return res.status(404).json({ msg: error.message });
    }
    //Vemos que el cliente no tenga una membresia activa
    const queryFindMembresiaActiva = `SELECT * FROM vista_membresias_clientes WHERE cliente_id = $1;`;
    const { rows: clienteMembresiaActiva } = await pool.query(
      queryFindMembresiaActiva,
      [id_cliente]
    );

    //Valida si el cliente ya cuenta con una membresia y que este activa
    if (
      clienteMembresiaActiva.length > 0 &&
      clienteMembresiaActiva[0].estado === "Activa"
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

const cancelarCompraMembresia = async (req, res) => {
  const { id_compra } = req.params;
  try {
    //Valida si el campo id_compra fue enviado en la solicitud
    if (!id_compra || isNaN(id_compra)) {
      return res.status(400).json({
        msg: "El campo id_compra es obligatorio y debe ser numerico",
      });
    }
    //Valida si la compra existe en la base de datos y es candidata para ser cancelada
    const queryFindCompra = `SELECT * FROM compras_membresias WHERE id = $1 AND fecha_renovacion IS NULL`;
    const { rows: compra } = await pool.query(queryFindCompra, [id_compra]);
    if (compra.length === 0) {
      const error = new Error(
        "Compra no encontrada en la base de datos o no valida para ser cancelada"
      );
      return res.status(404).json({ msg: error.message });
    }
    //Se obtiene el id del cliente de la compra
    const id_cliente = compra[0].cliente_id;
    //Se cancela la compra de la membresia
    const queryCancel = `DELETE FROM compras_membresias WHERE id = $1`;
    await pool.query(queryCancel, [id_compra]);

    //Se actualiza la fecha de renovacion de la ultima compra de membresia del cliente
    const queryUpdate = `UPDATE compras_membresias
        SET fecha_renovacion = NULL
        WHERE id = (
          SELECT id 
          FROM compras_membresias
          WHERE cliente_id = $1 AND fecha_renovacion IS NOT NULL
          ORDER BY fecha_compra DESC
          LIMIT 1
        )`;
    await pool.query(queryUpdate, [id_cliente]);
    res.status(200).json({ msg: "Compra cancelada exitosamente" });
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
      msg: "Los campos cliente y membresia son obligatorios y deben ser numericos",
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

const cancelarCompraProductos = async (req, res) => {
  const { id_venta } = req.params;
  //Valida si el campo id_venta fue enviado en la solicitud
  if (!id_venta || isNaN(id_venta)) {
    return res.status(400).json({
      msg: "El campo id_venta es obligatorio y debe ser numerico",
    });
  }
  //Valida si la venta existe en la base de datos
  const queryFindVenta = `SELECT * FROM ventas WHERE id = $1;`;
  const { rows: venta } = await pool.query(queryFindVenta, [id_venta]);
  if (venta.length === 0) {
    return res.status(404).json({
      msg: "Venta no encontrada en la base de datos",
    });
  }
  //Borramos la venta de la base de datos y se borran los productos de la venta de la tabla detalle_ventas de manera automatica
  const queryCancel = `DELETE FROM ventas WHERE id = $1;`;
  await pool.query(queryCancel, [id_venta]);
  return res.status(200).json({ msg: "Venta cancelada exitosamente" });
};

const obtenerVentasProductos = async (req, res) => {
  try {
    const querySelect = "SELECT * FROM vista_ventas_productos";
    const { rows: ventasProductos } = await pool.query(querySelect);
    return res.status(200).json(ventasProductos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hubo error al obtener las ventas de productos",
    });
  }
};

const obtenerVentasMembresias = async (req, res) => {
  try {
    const querySelect = "SELECT * FROM vista_compras_membresias";
    const { rows: ventasMembresias } = await pool.query(querySelect);
    return res.status(200).json(ventasMembresias);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hubo error al obtener las ventas de membresias",
    });
  }
};

const comprarVisitas = async (req, res) => {
  const { cliente } = req.body;
  //Validar que el cliente tenga un ID o datos de cliente externo
  if (!cliente) {
    return res.status(400).json({
      msg: "Debe proporcionar la información del cliente.",
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
      //Valida si el cliente tiene una membresia activa
      const queryFindMembresiaActiva = `SELECT * FROM vista_membresias_clientes WHERE cliente_id = $1;`;
      const { rows: clienteMembresiaActiva } = await pool.query(
        queryFindMembresiaActiva,
        [cliente]
      );
      //Valida si el cliente ya cuenta con una membresia y que este activa
      if (
        clienteMembresiaActiva.length > 0 &&
        clienteMembresiaActiva[0].estado !== "Vencida"
      ) {
        const error = new Error(
          "El cliente ya cuenta con una membresia activa"
        );
        return res.status(404).json({ msg: error.message });
      }
    }
    //Consultamos el precio de la visita
    const queryPrecio = `SELECT precio_visita FROM configuracion_gym ORDER BY id DESC LIMIT 1;`;
    const { rows: precioVisita } = await pool.query(queryPrecio);
    //Validar si se recupero el precio de la visita
    if (precioVisita.length === 0) {
      return res.status(404).json({
        msg: "Error al recuperar el precio de la visita",
      });
    }
    // Query para insertar la venta dependiendo si es cliente externo o registrado
    const ventaInsert = esClienteExterno
      ? `INSERT INTO visitas (cliente_externo, fecha_visita, precio ) VALUES ($1, $2, $3) RETURNING *;`
      : `INSERT INTO visitas (cliente_id, fecha_visita, precio) VALUES ($1, $2, $3) RETURNING *;`;
    // Realizar la venta
    const { rows: venta } = await pool.query(ventaInsert, [
      cliente,
      new Date(),
      precioVisita[0].precio_visita,
    ]);
    //Devuelve la respuesta con la venta realizada
    return res
      .status(201)
      .json({ msg: "Visita realizada con éxito", venta: venta[0] });
  } catch (error) {
    console.log(error);
    console.error("Error al realizar la venta:", error.message);
    return res.status(500).json({ msg: "Hubo un error al procesar la venta." });
  }
};

const obtenerVentasVisitas = async (req, res) => {
  try {
    const querySelect = "SELECT * FROM vista_compras_visitas";
    const { rows: ventasVisitas } = await pool.query(querySelect);
    return res.status(200).json(ventasVisitas);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hubo error al obtener las ventas de visitas",
    });
  }
};

export {
  comprarMembresia,
  renovarMembresia,
  comprarProductos,
  cancelarCompraMembresia,
  cancelarCompraProductos,
  obtenerVentasProductos,
  obtenerVentasMembresias,
  comprarVisitas,
  obtenerVentasVisitas,
};
