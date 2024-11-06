import Admin from "../models/Admin.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";

const registrar = async (req, res) =>{
	const { nommbre, password, email,  } = req.body;

	//Prevenir duplicado de email
	const existeUsuario = await Admin.findOne({email});
	if(existeUsuario){
		const error = new Error('Usuario ya registrado');
		return res.status(400).json({msg: error.message});
	}

	try{
		// Guardar un nuevo admin
		const admin = new Admin(req.body);
		const adminGuardado = await admin.save();
		res.json({ 
			msg: "Registrando usuario....",
		});
	} catch (error){
		console.log(error);
	}
	
}

const perfil = (req, res) =>{
	const { admin } = req;
	res.json({ peril: admin });
}

const confirmar = async (req, res) => {
	const  { token }  = req.params;
	const usuarioConfirmar = await Admin.findOne({token});
	if(!usuarioConfirmar){
		const error = new Error('Token no valido');
		return res.status(400).json({msj: error.message})
	}
	try{
		usuarioConfirmar.token = null;
		usuarioConfirmar.confirmado = true;
		await usuarioConfirmar.save();
		res.json({msg: 'Usuario confirmado correctamente!'})
	} catch (error){
		console.log(error);
	}
}

const autenticar = async (req, res) => {
	const { email, password } = req.body;

	// Comprobar si existe
	const usuario = await Admin.findOne({email});
	if(!usuario){
		const error = new Error("El ususario no existe");
		return res.status(404).json({msg: error.message});
	}

	// Comprobar si esta confirmado 
	if(!usuario.confirmado){
		const error = new Error("Tu cuenta no está confirmada");
		return res.status(404).json({msg: error.message})
	}

	// Revisar passsword
	if( await usuario.comprobarPassword(password)){
		// Autenticar
		res.json({ token: generarJWT(usuario.id) });
	} else {
		const error = new Error("El password es incorrecto")
		return res.status(404).json({msg: error.message})
	}
	
}

const olvidePassword = async (req, res) => {
	const { email } = req.body;
	const existeAdmin = await Admin.findOne({email});
	if(!existeAdmin){
		const error = new Error("Usuario no existe");
		return res.status(400).json({msg: error.message})
	}
	try{
		existeAdmin.token = generarId();
		await existeAdmin.save();
		res.json({msg: "Hemos enviado un email con las instrucciones"});
	} catch(error){
		console.log(error);
	}
}

const comprobarToken = async (req, res) => {
	const { token } = req.params;
	const tokenvalido = await Admin.findOne({token});

	if(tokenvalido){
		//El token es valido
		res.json({msg: "Token valido..."})
	} else {
		const error = new Error("Token no valido")
		return res.status(400).json({msg: error.message})
	}
}

const nuevoPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	const admin = await Admin.findOne({ token });
	if(!admin){
		const error = new Error("Hubo un error");
		return res.status(400).json({msg: error.message})
	}
	try {
		admin.token = null;
		admin.password = password;
		await admin.save();
		res.json({msg: "Password modificado correctamente"});
	} catch(error){
		console.log(error);
	}
}

export {
	registrar,
	perfil,
	confirmar,
	autenticar,
	olvidePassword,
	comprobarToken,
	nuevoPassword
}