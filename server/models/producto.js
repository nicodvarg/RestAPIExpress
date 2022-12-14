const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    precioUni: {
        type: Number,
        required: [true, "El precio es necesario"]
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    img: {
        type: String,
        required: false
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: [true, "La categoría es necesaria"]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    }
});


module.exports = mongoose.model("Producto", productoSchema);