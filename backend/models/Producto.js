import mongoose from "mongoose";

const productoSchema = mongoose.Schema({
  nombre: {
    type: String,
    require: true,
    trim: true,
  },
  marca: {
    type: String,
    require: true,
    trim: true,
  },
  categoria: {
    type: String,
    require: true,
    trim: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  precio: {
    type: Number,
    require: true,
  },
  descuento: {
    type: Number,
    require: true,
  },
  total: {
    type: Number,
    require: true,
  },
  descripcion: {
    type: String,
    require: true,
  },
  img: {
    public_id: { type: String },
    secure_url: { type: String },
  },
});

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
