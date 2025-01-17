import express from "express";
import {
  crear,
  actualizar,
  actualizarDisponible,
  deleteProducto,
  crearCategoria,
  deleteCategoria,
  allCategoria,
  obtenerTodos,
  obtenerTotal,
} from "../controllers/productController.js";
import fileUpload from "express-fileupload";

const router = express.Router();

router.get("/", obtenerTodos);
router.post(
  "/crear",
  fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }),
  crear
);
router.put("/actualizar/:id", actualizar);
router.put("/actualizar-disponible/:id", actualizarDisponible);
router.delete("/delete/:id", deleteProducto);

router.get("/categorias", allCategoria);
router.post("/crear-categoria", crearCategoria);
router.delete("/categoria-delete/:id", deleteCategoria);

router.get("/total", obtenerTotal);

export default router;
