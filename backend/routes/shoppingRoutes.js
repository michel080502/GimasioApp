import express from "express";
import { cancelarCompraMembresia, cancelarCompraProductos, comprarMembresia, comprarProductos, obtenerVentasMembresias, obtenerVentasProductos, renovarMembresia } from "../controllers/shoppingController.js";

const router = express.Router();

router.get("/ventas-productos",obtenerVentasProductos);
router.get("/ventas-membresias",obtenerVentasMembresias);
router.post("/membresia",comprarMembresia);
router.post("/renovar-membresia",renovarMembresia);
router.post("/productos",comprarProductos);
router.delete("/membresia",cancelarCompraMembresia);
router.delete("/productos",cancelarCompraProductos);
export default router;