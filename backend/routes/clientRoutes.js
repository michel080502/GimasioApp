import express from "express";
import fileUpload from "express-fileupload";
import {
  crear,
  deleteById,
  getAll,
  obtenerClientesNoActivos,
  getById,
  update,
  registrarAsistencia,
} from "../controllers/clientController.js";

const router = express.Router();
router.get("/", getAll);
router.get("/no-activos", obtenerClientesNoActivos);
router.get("/:id", getById);
router.post(
  "/crear",
  fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }),
  crear
);
router.post("/asistencia",registrarAsistencia);  
router.put("/update/:id", update);
router.delete("/delete/:id", deleteById);

export default router;
