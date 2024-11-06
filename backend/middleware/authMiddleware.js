import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
const checkAut = async (req, res, next) =>{
	let token;
	if( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
		try {
			// obtenemos el token
			token = req.headers.authorization.split(' ')[1];
			// verificamos si el token coincide con la palabra secreta y retornamos el id del ususario
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			// buscamos el ususario con el id y creamos una sesion con ese usuario
			req.admin = await Admin.findById(decoded.id).select(
				"-password -token -confirmado -telefono"
			);
			return next();
		} catch (error){
			const e = new Error("Token no valido ");
			return res.status(403).json({ msg: e.message})
		}
	} 

	if(!token){
		const error = new Error("Token no valido o inexistente");
		res.status(403).json({ msg: error.message})
	}

	next();
}

export default checkAut;