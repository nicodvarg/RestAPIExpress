const express = require("express");
const { verificarToken, verificarAdminRole } = require("../middlewares/autenticacion");
const Categoria = require("../models/categoria");

const app = express();

//Obtenemos todas las categorías
app.get("/categoria", verificarToken, (req, res) => {

    const desde = req.query.desde || 0;
    const limite = req.query.limite || 5;

    Categoria.find()
        .skip(desde)
        .limit(limite)
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, cuantos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    categorias: categoriasDB,
                    cuantos
                });
            });

        });
});

//Obtenemos una categoría
app.get("/categoria/:id", verificarToken, (req, res) => {

    const id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//Creamos una categoría
app.post("/categoria", verificarToken, (req, res) => {

    const descripcion = req.body.descripcion;
    const id = req.usuario._id;

    let categoria = new Categoria({
        descripcion,
        usuario: id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//Modificamos una categoría
app.put("/categoria/:id", verificarToken, (req, res) => {

    const descripcion = req.body.descripcion;
    const id = req.params.id;

    Categoria.findByIdAndUpdate(id, { descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//Borramos una categoría
app.delete("/categoria/:id", [verificarToken, verificarAdminRole], (req, res) => {

    const id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});















module.exports = app;