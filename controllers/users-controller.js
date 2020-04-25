const mysql = require('../mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.newUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query('SELECT * FROM Users WHERE email = ?', [req.body.email], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }

            if (results.length > 0) {
                res.status(409).send({ message: 'Usuário já cadastrado' })
            } else {
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
 
                    conn.query('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [req.body.name, req.body.email, hash], (error, result) => {
                        conn.release()

                        if (error) { return res.status(500).send({ error: error }) }

                        return res.status(201).send({
                            message: "Usuário criado com sucesso",
                            id_usuario: result.insertID
                        })
                    })
                })
            }
        })
    })
}

exports.authUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        const query = 'SELECT * FROM Users WHERE email = ?'

        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release()

            if (error) { return res.status(500).send({ error: error }) }

            if (results.length < 1) {
                return res.status(401).send({ message: 'Falha na autenticação' })
            }

            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if (err) return res.status(401).send({ message: 'Falha na autenticação' })

                if (result) {
                    const token = jwt.sign(
                        {
                            id_usuario: results[0].id_usuario,
                            email: results[0].email,
                            name: results[0].name
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })

                    return res.status(200).send({
                        message: 'autenticado com sucesso',
                        token: token
                    })
                }

                return res.status(401).send({ message: 'Falha na autenticação' })
            })
        })
    })
}