import Producto from "../models/Producto.js";
import { uploadImage, deleteImage } from "../helpers/cloudinary.js";
import fs from 'fs-extra'

const crear = async (req, res) => {
    const { nombre } = req.body;
    res.json({msg: `Hola ${nombre}`})
}

export {
    crear
}