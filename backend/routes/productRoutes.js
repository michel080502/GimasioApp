import express from "express";
import { actualizar, actualizarDisponible, crear, crearCategoria, eliminar, obtenerTodos, obtenerTotal } from "../controllers/productController.js";
import fileUpload from "express-fileupload";

const router = express.Router();

router.post(
  "/crear",
  fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }),
  crear
);
router.post("/crearCategoria", crearCategoria);
router.put("/actualizar/:id", actualizar);
router.put("/actualizarDisponible/:id", actualizarDisponible);
router.get("/",obtenerTodos);
router.get("/total",obtenerTotal);
router.delete("/eliminar/:id",eliminar);




export default router;
