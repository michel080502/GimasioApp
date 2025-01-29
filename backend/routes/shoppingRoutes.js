import express from "express";
import { cancelarCompraMembresia, cancelarCompraProductos, comprarMembresia, comprarProductos, comprarVisitas, obtenerVentasMembresias, obtenerVentasProductos, renovarMembresia } from "../controllers/shoppingController.js";

const router = express.Router();

router.get("/ventas-productos",obtenerVentasProductos);
router.get("/ventas-membresias",obtenerVentasMembresias);
router.post("/membresia",comprarMembresia);
router.post("/renovar-membresia",renovarMembresia);
router.post("/productos",comprarProductos);
router.post("/visita",comprarVisitas);
router.delete("/membresia/:id_compra",cancelarCompraMembresia);
router.delete("/producto/:id_venta",cancelarCompraProductos);
export default router;