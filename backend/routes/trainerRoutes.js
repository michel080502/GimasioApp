import express from "express";
import fileUpload from "express-fileupload";
import {
  creatTrainer,
  deleteTrainer,
  getTrainers,
  updateActive,
  updatedTrainer,
} from "../controllers/trainerController.js";

const router = express.Router();

router.post(
  "/crear",
  fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }),
  creatTrainer
);
router.get("/", getTrainers);
router.put("/actualizar-activo/:id", updateActive);
router.put("/actualizar/:id", updatedTrainer);
router.delete("/eliminar/:id", deleteTrainer);

export default router;
