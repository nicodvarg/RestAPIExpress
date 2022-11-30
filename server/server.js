//Configuración global
require("./config/config.js");

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configuración global de rutas
app.use(require("./routes/index"));


//Conexión a base de datos
mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log("Base de datos ONLINE");
});


//Escuchando puerto
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto:", process.env.PORT);
});
