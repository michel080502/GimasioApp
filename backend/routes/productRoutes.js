import express from "express";
import { actualizar, actualizarDisponible, crear, crearCategoria, obtenerTodos, obtenerTotal } from "../controllers/productController.js";
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




export default router;
