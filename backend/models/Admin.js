import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarId from "../helpers/generarId.js";

const adminSchema = mongoose.Schema({
	nombre: {
		type: String,
		required: true,
		trim: true
	},
	apellido: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	telefono: {
		type: String,
		default: null,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	token:{
		type: String,
		default: generarId()
	},
	confirmado: {
		type: Boolean,
		default: false
	}
});
// ENCRIPTAR CONTARSEÑA
// Usamoos funciones normales y no AARROW FUNCTION, porque arrow function no nos permite usar THIS
adminSchema.pre('save', async function(next) {
	if(!this.isModified("password")){
		// Con este next le decimos, ya terminaste en esta funcion, vete al siguiebte middleware
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Comparar password
adminSchema.methods.comprobarPassword = async function (passwordForm){
	return await bcrypt.compare(passwordForm, this.password);
}

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;