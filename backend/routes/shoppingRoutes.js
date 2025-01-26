import express from "express";
import {
  comprarMembresia,
  renovarMembresia,
} from "../controllers/shoppingController.js";

const router = express.Router();

router.post("/membresia", comprarMembresia);
router.post("/renovar-membresia", renovarMembresia);
export default router;
