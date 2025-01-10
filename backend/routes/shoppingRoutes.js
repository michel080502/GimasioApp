import express from "express";
import { comprarMembresia } from "../controllers/shoppingController.js";

const router = express.Router();

router.post("/membresia",comprarMembresia);
export default router;