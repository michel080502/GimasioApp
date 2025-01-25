import express from "express";
import { comprarMembresia, comprarProductos, renovarMembresia } from "../controllers/shoppingController.js";

const router = express.Router();

router.post("/membresia",comprarMembresia);
router.post("/renovarMembresia",renovarMembresia);
router.post("/productos",comprarProductos);
export default router;