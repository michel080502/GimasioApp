import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import http from "http"; // Importar el servidor HTTP
import pool from "./config/db.js"; 
import adminRoutes from "./routes/adminRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import productRouter from "./routes/productRoutes.js";


dotenv.config();
const app = express();
const server = http.createServer(app); // Crear el servidor HTTP
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on('connection', socket => {
  console.log('Cliente conectado');
  socket.on('message', (data) =>{
    console.log(data);
  })
})
app.use(morgan('dev'));
app.use(express.json());
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

// Middleware para Socket.IO
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/admin", adminRoutes);
app.use("/api/cliente", clientRoutes);
app.use("/api/producto", productRouter);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
