import mongoose from "mongoose";

const clienteSchema = mongoose.Schema({
	nombre: {
		type: String,
		required: true,
		trim: true
	},
	apellidoPaterno: {
		type: String,
		required: true,
		trim: true
	},
	apellidoMaterno: {
		type: String,
		required: true,
		trim: true
	},
	telefono: {
		type: String,
		required: true,
		trim: true
	},
	nacimiento: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true
	},
	matricula: {
		type: String,
		required: true,
		trim: true
	},
	img: {
		public_id: {type: String},
		secure_url: {type: String},
	}

});


const Cliente = mongoose.model("Cliente", clienteSchema);
export default Cliente;