import express from "express";
import { actualizar, actualizarDisponible, crear, elimiarPorId, obtenerMembresiaPorId, obtenerTodas, obtnerNumeroMembresias } from "../controllers/membershipController.js";

const router = express.Router();

//Ruta para crear membresia
router.post("/crear",crear);
router.get("/",obtenerTodas); 
router.put("/actualizar/:id", actualizar);
router.put("/actualizarDisponible/:id", actualizarDisponible);
router.delete("/eliminar/:id", elimiarPorId);
router.get("/total",obtnerNumeroMembresias)
router.get("/:id",obtenerMembresiaPorId)


export default router;