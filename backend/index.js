import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(express.json())

dotenv.config();
conectarDB();


app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () =>{
	console.log(`Servidor funcionando en el puerto ${PORT}`);
})