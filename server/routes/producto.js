const express = require("express");
const { verificarToken } = require("../middlewares/autenticacion");
const Producto = require("../models/producto");
const Categoria = require("../models/categoria");

const app = express();
const _ = require("underscore");

app.get("/producto", verificarToken, (req, res) => {

    const desde = req.query.desde || 0;
    const limite = req.query.limite || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .populate("usuario", "nombre email")
        .populate({
            path: "categoria",
            populate: {
                path: "usuario",
                select: "nombre email"
            }
        })
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "No se pudo obtener la tabla"
                    }
                });
            }

            Producto.count({ disponible: true }, (err, cuantos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos,
                    cuantos
                });
            });
        });
});

app.get("/producto/:id", verificarToken, (req, res) => {
    const id = req.params.id;

    Producto.findById(id)
        .populate("usuario", "nombre email")
        .populate({
            path: "categoria",
            populate: {
                path: "usuario",
                select: "nombre email"
            }
        })
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El producto no existe"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

app.get("/producto/buscar/:nombre", verificarToken, (req, res) => {
    const regex = new RegExp(req.params.nombre, "i");

    Producto.find({ nombre: regex })
        .populate("usuario", "nombre email")
        .populate({
            path: "categoria",
            populate: {
                path: "usuario",
                select: "nombre email"
            }
        })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });

})

app.post("/producto", verificarToken, (req, res) => {

    const body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, nuevoProducto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: nuevoProducto
        });
    });

});

app.put("/producto/:id", verificarToken, (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ["nombre", "precioUni", "descripcion", "disponible", "categoria"]);
    body.usuario = req.usuario._id;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoModificado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoModificado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El producto no existe"
                }
            });
        }

        res.json({
            ok: true,
            producto: productoModificado
        });
    });

});

app.delete("/producto/:id", verificarToken, (req, res) => {
    const id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "No se encontró el producto"
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});


module.exports = app;