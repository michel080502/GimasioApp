import jwt from "jsonwebtoken";
import pool from "../config/db.js";
const checkAut = async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // obtenemos el token
      token = req.headers.authorization.split(" ")[1];
      // verificamos si el token coincide con la palabra secreta y retornamos el id del ususario
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // buscamos el ususario con el id y creamos una sesion con ese usuario
      const query =
        "SELECT id, nombre, apellido_paterno,apellido_materno, email FROM admins WHERE id = $1";
      const { rows: admin } = await pool.query(query, [decoded.id]);

      // Verificar si se encontró al administrador
      if (admin.length === 0) {
        return res.status(403).json({ msg: "Usuario no autorizado" });
      }

      req.admin = admin[0];
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(403).json({ msg: "Token expirado" });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(403).json({ msg: "Token inválido" });
      }
      return res.status(403).json({ msg: "Error de autenticación" });
    }
  }

  if (!token) {
    const error = new Error("Token no valido o inexistente");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default checkAut;
