import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import conectarDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import clientRoutes from "./routes/clientRoutes.js"

const app = express();
app.use(express.json())

dotenv.config();
conectarDB();
// Lista de las url permitidas, en este caso del front end
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
origin: function (origin, callback) {
		if(!origin){//for bypassing postman req with  no origin
			return callback(null, true);
		}
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}
app.use(cors(corsOptions));

app.use(cors(corsOptions));
// Cargar archivos
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));
app.use("/api/admin", adminRoutes);
app.use("/api/cliente", clientRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () =>{
	console.log(`Servidor funcionando en el puerto ${PORT}`);
})