const express = require("express");
const path = require("path");
const fs = require("fs");
const { verificarToken } = require("../middlewares/autenticacion");

const app = express();

app.get("/imagen/:tipo/:img", verificarToken, (req, res) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg);
    } else {
        const pathNoImg = path.resolve(__dirname, "../assets/no-imagen.jpg");
        res.sendFile(pathNoImg);
    }

});


module.exports = app;