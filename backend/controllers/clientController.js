import Cliente from "../models/Cliente.js";
import { uploadImage, deleteImage } from "../helpers/cloudinary.js";
// fs es un modulo que extiende las capacidades de FileSystem a recibir promesas
import fs from 'fs-extra'


const crear = async (req, res) => {
	try {
		const { matricula } = req.body;

		// Verificar si ya existe un cliente con la misma matrícula
		const existeCliente = await Cliente.findOne({ matricula });
		if (existeCliente) {
			const error = new Error('Cliente ya existe');
			return res.status(400).json({ msg: error.message });
		}

		// Manejar la imagen si existe
		let img = {};
		if (req.files?.img) {
			const resultImg = await uploadImage(req.files.img.tempFilePath);
			img = {
				public_id: resultImg.public_id,
				secure_url: resultImg.secure_url,
			};
			await fs.unlink(req.files.img.tempFilePath);
		}

		// Crear el cliente con todos los datos, incluyendo la imagen
		const clienteData = {
			...req.body,
			img, // Agregamos la imagen al objeto
		};

		const cliente = new Cliente(clienteData);

		// Guardar el cliente en la base de datos
		const clienteSave = await cliente.save();

		// Respuesta exitosa
		res.status(200).json({
			msg: 'Cliente registrado exitosamente'
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Error al registrar el cliente' });
	}
};

const update = async (req, res) =>{
	const { id } = req.params;
	const { nombre, apellidoPaterno, apellidoMaterno, telefono, email, nacimiento, matricula } = req.body;
	const cliente = await Cliente.findById( id );
	if(!cliente) {
		const error = new Error("Cliente no encontrado");
		return res.status(400).json({msg: error.message});
	}
	try {
        const cliente = await Cliente.findByIdAndUpdate(
            id, 
            {
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                telefono,
                email,
                nacimiento,
                matricula,
            },
            { new: true } // Retorna el documento actualizado
        );

        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }

        res.json({ msg: "Cliente modificado correctamente" });
	} catch (error){
		console.log(error);
	}
}

const getAll = async (req, res) =>{
	try {
		const clientes = await Cliente.find();
		res.json(clientes);
	} catch(error){
		console.log(error)
	}
	
}

const getById = async (req, res) =>{
	const { id } = req.params;
	try {
		const cliente = await Cliente.findById(id);
		if(!cliente){
			const error = new Error("Cliente no encontrado");
			return res.status(400).json({msg: error.message})
		}
		return res.json(cliente);
	} catch(error){
		console.log(error)
	}
	
}

const deleteById = async (req, res) =>{
	const { id } = req.params;
	
	try {
		const cliente = await Cliente.findByIdAndDelete(id);
		if(!cliente){
			const error = new Error("Cliente no encontrado");
			return res.status(400).json({msg: error.message})
		}
		await deleteImage(cliente.img.public_id);
		return res.json({msg: 'Cliente eliminado correctamente'})
	} catch(error){ 
		console.log(error);
	}
}

export {
	crear,
	update,
	getAll,
	getById,
	deleteById
}