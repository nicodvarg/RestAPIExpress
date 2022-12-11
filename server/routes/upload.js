const express = require("express");
const fileUpload = require("express-fileupload");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

const fs = require("fs");
const path = require("path");

const app = express();

app.use(fileUpload());

app.put("/upload/:tipo/:id", (req, res) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se subió un archivo"
            }
        });
    }

    const tiposPermitidos = ["producto", "usuario"];

    if (tiposPermitidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son: ${tiposPermitidos.join(", ")}`
            }
        });
    }

    let archivo = req.files.archivo;

    const extension = archivo.name.split(".").slice(-1)[0];

    const extensionesPermitidas = ["jpeg", "png", "gif", "jpg"];

    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son: ${extensionesPermitidas.join(", ")}`
            },
            ext: extension
        });
    }

    const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === "usuario")
            actualizarUsuario(id, nombreArchivo, res);
        else
            actualizarProducto(id, nombreArchivo, res);

    });
});

function actualizarUsuario(id, nombreArchivo, res) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarImagen(nombreArchivo, "usuario");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarImagen(nombreArchivo, "usuario");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El usuario no existe"
                }
            });
        }

        borrarImagen(usuarioDB.img, "usuario");

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioModificado) => {
            if (err) {
                borrarImagen(nombreArchivo, "usuario");
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioModificado
            });
        });
    });
}

function actualizarProducto(id, nombreArchivo, res) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarImagen(nombreArchivo, "producto");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarImagen(nombreArchivo, "producto");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El producto no existe"
                }
            });
        }

        borrarImagen(productoDB.img, "producto");

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoModificado) => {
            if (err) {
                borrarImagen(nombreArchivo, "producto");
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoModificado
            });
        });
    });
}

function borrarImagen(nombreArchivo, tipo) {
    if (nombreArchivo) {
        const pathImagen = path.resolve(__dirname, "../../uploads", tipo, nombreArchivo);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }
}









module.exports = app;