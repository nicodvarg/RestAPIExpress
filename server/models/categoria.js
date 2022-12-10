const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, "La descripcion es necesaria"] },
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario" }
});

categoriaSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });


module.exports = mongoose.model("Categoria", categoriaSchema);