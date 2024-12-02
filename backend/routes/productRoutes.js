import express from 'express'
import { crear } from '../controllers/productController.js';

const router = express.Router();

router.post("/crear", crear);

export default router;