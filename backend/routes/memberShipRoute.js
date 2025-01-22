import express from "express";
import { actualizar, actualizarDisponible, crear, elimiarPorId, obtenerMembresiaPorId, obtenerMembresiasClientes, obtenerTodas, obtnerNumeroMembresias } from "../controllers/membershipController.js";

const router = express.Router();

//Ruta para crear membresia
router.post("/crear",crear);
router.get("/",obtenerTodas); 
router.put("/actualizar/:id", actualizar);
router.put("/actualizar-disponible/:id", actualizarDisponible);
router.delete("/eliminar/:id", elimiarPorId);
router.get("/total",obtnerNumeroMembresias);
router.get("/porId/:id",obtenerMembresiaPorId);
router.get("/clientes",obtenerMembresiasClientes);


export default router;