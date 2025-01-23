import pool from "../config/db.js";
import { uploadImage, deleteImage } from "../helpers/cloudinary.js";
import fs from "fs-extra";

const crear = async (req, res, next) => {
  const { nombre, marca, categoria, stock, precio, descuento, total } =
    req.body;
  try {
    const query = "SELECT * FROM categorias_productos WHERE id = $1";
    const { rows: categoriaExiste } = await pool.query(query, [categoria]);
    if (categoriaExiste.length === 0) {
      return res.status(400).json({
        error: "La categoria no existe en la base de datos.",
      });
    }
    const id_categoria = categoriaExiste[0].id;
    if (Number(descuento) > Number(precio)) {
      return res.status(400).json({
        error:
          "El descuento del producto no puede ser mayor al precio original.",
      });
    }
    const filterquery =
      "SELECT * FROM productos WHERE nombre = $1 AND eliminado = $2";
    const { rows: productoExiste } = await pool.query(filterquery, [
      nombre,
      false,
    ]);
    if (productoExiste.length > 0) {
      const error = new Error("Ya existe producto con ese nombre.");
      return res.status(409).json({
        msg: error.message,
      });
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
    const insertQuery = `
    INSERT INTO productos (nombre, marca, categoria_id, stock, precio, descuento, total, img_public_id, img_secure_url) 
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
   `;
    await pool.query(insertQuery, [
      nombre,
      marca,
      id_categoria,
      stock,
      precio,
      descuento,
      total,
      img.public_id || null,
      img.secure_url || null,
    ]);
    // Emitir el nuevo producto usando Socket.IO
    //req.io.emit("nuevo-cliente", nuevoCliente[0]);
    res.json({
      msg: "Producto registrado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el producto" });
  }
};

const actualizar = async (req, res) => {
  const { id } = req.params;
  const { nombre, marca, categoria_id, stock, precio, descuento, total } =
    req.body;
  try {
    //Se valida que el producto este en la base de datos
    const queryFind = "SELECT * FROM productos WHERE id = $1";
    const { rows: productoActualizar } = await pool.query(queryFind, [id]);
    if (productoActualizar.length === 0) {
      const error = new Error("El producto no se encuentra registrado");
      return res.status(404).json({
        msg: error.message,
      });
    }
    //Se valida que la categoria exista en la base de datos
    const query = "SELECT * FROM categorias_productos WHERE id = $1";
    const { rows: categoriaExiste } = await pool.query(query, [categoria_id]);
    if (categoriaExiste.length === 0) {
      const error = new Error("La categoria no existe en el sistema");
      return res.status(404).json({
        msg: error.message,
      });
    }
    const id_categoria = categoriaExiste[0].id;
    if (Number(descuento) > Number(precio)) {
      return res.status(400).json({
        error:
          "El descuento del producto no puede ser mayor al precio original.",
      });
    }
    // Construir la consulta de actualización, solo actualizando los campos que hayan cambiado
    const queryUpdate = `
      UPDATE productos
      SET 
        nombre = COALESCE($1, nombre), 
        marca = COALESCE($2, marca), 
        categoria_id = COALESCE($3, categoria_id),
        stock = COALESCE($4, stock),
        precio = COALESCE($5, precio),
        descuento = COALESCE($6, descuento),
        total = COALESCE($7, total)
      WHERE id = $8
    `;

    // Ejecutar la consulta de actualización
    await pool.query(queryUpdate, [
      nombre || null,
      marca || null,
      id_categoria || null,
      stock || null,
      precio || null,
      descuento || null,
      total || null,
      id,
    ]);

    res.json({ msg: "Datos del producto actualizados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el producto" });
  }
};

const crearCategoria = async (req, res) => {
  const { nombre } = req.body;
  // Validación inicial
  if (!nombre.trim()) {
    const error = new Error("El nombre de la categoría es obligatorio.");
    return res.status(400).json({ msg: error.message });
  }
  try {
    // Verificar si la categoría ya existe
    const queryFind = `SELECT * FROM categorias_productos WHERE nombre = $1`;
    const { rows: categoriaExiste } = await pool.query(queryFind, [nombre]);
    if (categoriaExiste.length > 0 && categoriaExiste[0].eliminado === false) {
      const error = new Error(
        "La categoría ya se encuentra registrada en la base de datos."
      );
      return res.status(409).json({
        msg: error.message,
      });
    } else if (
      categoriaExiste.length > 0 &&
      categoriaExiste[0].eliminado === true
    ) {
      const queryUpdateActive = `UPDATE categorias_productos 
      SET 
      eliminado = $1
      WHERE id = $2
      RETURNING *`;
      const { rows: categoriaReactive } = await pool.query(queryUpdateActive, [
        false,
        categoriaExiste[0].id,
      ]);
      return res
        .status(200)
        .json({ msg: `Categoria reactivada '${categoriaReactive[0].nombre}'` });
    }

    // Insertar nueva categoría
    const queryInsert = `INSERT INTO categorias_productos (nombre) VALUES ($1) RETURNING *`;
    const { rows: categoriaNueva } = await pool.query(queryInsert, [nombre]);
    return res.status(201).json({
      msg: `Categoría '${categoriaNueva[0].nombre}' creada correctamente`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar la categoría" });
  }
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;
  const queryFind = "SELECT * FROM productos WHERE id = $1";
  try {
    const { rows: producto } = await pool.query(queryFind, [id]);
    if (producto.length === 0) {
      const error = new Error("Producto no encontrado");
      return res.status(404).json({ msg: error.message });
    }
    const logicalErase = `UPDATE productos SET archived = $1 WHERE id = $2`;
    await pool.query(logicalErase, [true, id]);
    await deleteImage(producto[0].img_public_id);
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo error en el servidor" });
  }
};

const deleteCategoria = async (req, res) => {
  const { id } = req.params;
  const queryFind = "SELECT * FROM categorias_productos WHERE id = $1";
  try {
    const { rows: categoria } = await pool.query(queryFind, [id]);
    if (categoria.length === 0) {
      const error = new Error("Categoria no encontrada");
      return res.status(404).json({ msg: error.message });
    }
    const logicalErase = `UPDATE categorias_productos SET eliminado = $1 WHERE id = $2`;
    await pool.query(logicalErase, [true, id]);

    res.json({ msg: "Categoria eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo error en el servidor" });
  }
};

const allCategoria = async (req, res) => {
  try {
    const querySelect =
      "SELECT * FROM categorias_productos WHERE eliminado = false";
    const { rows: categorias } = await pool.query(querySelect);
    return res.status(200).json(categorias);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Hubo error al obtener los datos de las membresias" });
  }
};

const actualizarDisponible = async (req, res) => {
  const { id } = req.params;
  const { disponible } = req.body;
  try {
    const queryFind = "SELECT * FROM productos WHERE id = $1";
    const { rows: producto } = await pool.query(queryFind, [id]);
    if (producto.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado en la base de datos.",
      });
    }
    const stock = producto[0].stock;
    if (stock == 0 && disponible == true) {
      return res.status(409).json({ error: "Stock insuficiente" });
    }

    const queryUpdate = `
    UPDATE productos
    SET 
      disponible = $1
    WHERE id = $2
  `;
    await pool.query(queryUpdate, [
      disponible !== undefined ? disponible : membresia[0].disponible,
      id,
    ]);
    res.json({ msg: "Dato de membresia modificado correctamente" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Hubo error al actualizar los datos del producto" });
  }
};

const obtenerTodos = async (req, res) => {
  try {
    const querySelect = "SELECT * FROM vista_nivel_stock ORDER BY id ASC ";
    const { rows: productos } = await pool.query(querySelect);
    // Convertir los campos precio, descuento y total a números
    const productosConvertidos = productos.map((producto) => ({
      ...producto,
      precio: parseFloat(producto.precio),
      descuento: parseFloat(producto.descuento),
      total: parseFloat(producto.total),
    }));

    return res.status(200).json(productosConvertidos);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Hubo error al obtener los datos de las membresias" });
  }
};

const obtenerTotal = async (req, res) => {
  try {
    const querySelect =
      "SELECT COUNT(*) AS productos_registrados FROM productos";
    const { rows: totalProductos } = await pool.query(querySelect);
    return res.status(200).json(totalProductos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hubo error al obtener el total de productos en el sistema",
    });
  }
};

export {
  crear,
  actualizar,
  actualizarDisponible,
  deleteProducto,
  crearCategoria,
  deleteCategoria,
  allCategoria,
  obtenerTodos,
  obtenerTotal,
};
