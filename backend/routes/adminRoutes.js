import express from "express";
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizar,
  actualizarInfoGym,
  obtenerInfoGym,
} from "../controllers/adminController.js";
import checkAut from "../middleware/authMiddleware.js";

const router = express.Router();

// Area privada
router.get("/perfil", checkAut, perfil);

// Area Publica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.get("/gym-info",obtenerInfoGym);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.put("/gym-info/actualizar", actualizarInfoGym);
// router.get("/olvide-password/:token", comprobarToken);
// router.post("/olvide-password/:token", nuevoPassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
router.put("/actualizar/:id", actualizar);

export default router;
