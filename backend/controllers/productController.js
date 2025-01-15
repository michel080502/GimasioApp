import pool from "../config/db.js";
import { uploadImage, deleteImage } from "../helpers/cloudinary.js";
import fs from "fs-extra";

const crear = async (req, res) => {
  const { nombre, marca, categoria, stock, precio, descuento, total } =
    req.body;
  console.log(req.body);
  try {
    const query = "SELECT * FROM categorias_productos WHERE nombre = $1";
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
    const filterquery = "SELECT * FROM productos WHERE nombre = $1";
    const { rows: productoExiste } = await pool.query(filterquery, [nombre]);
    if (productoExiste.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe un producto con ese nombre." });
    }
    let img = {};
    if (req.files?.img) {
      const resultImg = await uploadImage(req.files.img.tempFilePath);
      img = {
        public_id: resultImg.public_id,
        secure_url: resultImg.secure_url,
      };
      await fs.unlink(req.files.img.tempFilePath);
    }
    const insertQuery = `
    INSERT INTO productos (nombre, marca, categoria_id, stock, precio, descuento, total,img_public_id, img_secure_url) 
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
   `;
    const { rows: producto } = await pool.query(insertQuery, [
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
      producto: producto[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el producto" });
  }
};

const actualizar = async (req, res) => {
  const { id } = req.params;
  const { nombre, marca, categoria, stock, precio, descuento, total } =
    req.body;
  try {
    //Se valida que el producto este en la base de datos
    const queryFind = "SELECT * FROM productos WHERE id = $1";
    const { rows: productoActualizar } = await pool.query(queryFind, [id]);
    if (productoActualizar.length === 0) {
      return res.status(404).json({
        error: "EL producto no se encuentra registrado en la base de datos",
      });
    }
    //Se valida que la categoria exista en la base de datos
    const query = "SELECT * FROM categorias_productos WHERE nombre = $1";
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
    const queryUpdate = `
    UPDATE productos
    SET 
      nombre = $1, 
      marca = $2, 
      categoria_id = $3, 
      stock = $4,
      precio = $5,
      descuento = $6,
      total = $7
    WHERE id = $8
  `;
    //Actualiza registro en bd
    await pool.query(queryUpdate, [
      nombre !== undefined ? nombre : productoActualizar[0].nombre,
      marca !== undefined ? marca : productoActualizar[0].marca,
      id_categoria !== undefined
        ? id_categoria
        : productoActualizar[0].categoria_id,
      stock !== undefined ? stock : productoActualizar[0].stock,
      precio !== undefined ? precio : productoActualizar[0].precio,
      descuento !== undefined ? descuento : productoActualizar[0].descuento,
      total !== undefined ? total : productoActualizar[0].total,
      id,
    ]);
    res.json({ msg: "Datos del producto actualizados correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hubo error en el servidor" });
  }
};

const crearCategoria = async (req, res) => {
  const { categoria } = req.body;
  // Validación inicial
  if (!categoria || categoria.trim() === "") {
    return res
      .status(400)
      .json({ msg: "El nombre de la categoría es obligatorio." });
  }
  try {
    // Verificar si la categoría ya existe
    const queryFind = `SELECT * FROM categorias_productos WHERE nombre = $1`;
    const { rows: categoriaExiste } = await pool.query(queryFind, [categoria]);
    if (categoriaExiste.length > 0) {
      return res.status(400).json({
        error: "La categoría ya se encuentra registrada en la base de datos.",
      });
    }
    // Insertar nueva categoría
    const queryInsert = `INSERT INTO categorias_productos(nombre) VALUES ($1) RETURNING *`;
    const { rows: categoriaNueva } = await pool.query(queryInsert, [categoria]);
    return res.status(201).json({
      msg: `Categoría '${categoriaNueva[0].nombre}' creada correctamente`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar la categoría" });
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
    return res.status(200).json(productos);
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

const eliminar = async (req, res) => {
  const { id } = req.params;
  const deleteQuery = "DELETE FROM productos WHERE id = $1 RETURNING *";
  try {
    const { rows: productoEliminado } = await pool.query(deleteQuery, [id]);
    //Valida que la membresia se haya eliminado correctamente
    if (productoEliminado.length === 0) {
      const error = new Error("Producto no encontrado en la base de datos");
      return res.status(400).json({ msg: error.message });
    }
    await deleteImage(productoEliminado[0].img_public_id);
    return res.json({ msg: "Producto eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

export {
  crear,
  crearCategoria,
  actualizar,
  actualizarDisponible,
  obtenerTodos,
  obtenerTotal,
  eliminar
};
