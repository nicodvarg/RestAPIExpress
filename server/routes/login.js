const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");

const app = express();

app.post("/login", (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El usuario o contraseña incorrectos"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El usuario o contraseña incorrectos"
                }
            });
        }

        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture
    }
}

app.post("/google", async (req, res) => {

    let csrf_token = req.body.g_csrf_token;

    if (!csrf_token) {
        return res.status(401).json({
            ok: false,
            err: {
                message: "token no válido"
            }
        });
    }

    let tokenGoogle = req.body.credential;

    let usuarioGoogle = await verify(tokenGoogle)
        .catch(err => {
            return res.status(401).json({
                ok: false,
                err
            });
        });

    Usuario.findOne({ email: usuarioGoogle.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            let usuario = new Usuario({
                nombre: usuarioGoogle.nombre,
                email: usuarioGoogle.email,
                img: usuarioGoogle.img,
                password: ":)",
                google: true
            });

            usuario.save((err, nuevoUsuario) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({ usuario: nuevoUsuario }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: nuevoUsuario,
                    token
                });

            });
        } else {
            if (!usuarioDB.google) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: "Debe iniciar con login normal"
                    }
                });
            }

            let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        }

    })
});


module.exports = app;