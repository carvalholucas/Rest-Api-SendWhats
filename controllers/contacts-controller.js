const mysql = require('../mysql')

exports.getAllContacts = (req, res, next) => {
    const id = req.query.id_user
    const query = `SELECT c.*, u.name FROM Contacts as c LEFT JOIN Users as u ON c.id_user = u.id ${id ? 'WHERE id_user = ?' : ''}`

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(query, [id], (error, result, fields) => {
            conn.release()

            if (error) return res.status(500).send({ error: error })

            res.status(200).send(result)
        })
    })
}

exports.getContactById = (req, res, next) => {
    const query = 'SELECT * FROM Contacts WHERE id = ?'
    const id = req.params.id

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(query, [id], (error, result, fields) => {
            conn.release()

            if (error) return res.status(500).send({ error: error })

            res.status(200).send(result)
        })
    })
}

exports.addContact = (req, res, next) => {
    const query = 'INSERT INTO Contacts (title, number, message, id_user, link) VALUES (?, ?, ?, ?, ?)'
    const values = [req.body.title, req.body.number, req.body.message, req.body.id_user, req.body.link]

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(query, values, (error, result, fields) => {
                conn.release()

                if (error) return res.status(500).send({ error: error })

                res.status(201).send({
                    message: 'Contato inserido com sucesso',
                    id: result.insertId
                })
            })
    })
}

exports.editContact = (req, res, next) => {
    const query = 'UPDATE Contacts SET title = ?, number = ?, message = ?, link = ? WHERE id = ?'
    const id = req.params.id
    const values = [req.body.title, req.body.number, req.body.message, req.body.link, id]

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
   
        conn.query(query, values, (error, result, fields) => {
                conn.release()

                if (error) return res.status(500).send({ error: error })

                res.status(202).send({ message: 'Contato alterado com sucesso' })
            }
        )
    })
}

exports.deleteContact = (req, res, next) => {
    const id = req.params.id
    const query = 'DELETE FROM Contacts WHERE id = ?'

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(query, [id], (error, result, fields) => {
                conn.release()

                if (error) return res.status(500).send({ error: error })

                res.status(202).send({ message: 'Contato removido com sucesso' })
            }
        )
    })
}
