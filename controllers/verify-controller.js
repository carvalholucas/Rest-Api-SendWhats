const mysql = require('../mysql')

exports.Verify = (req, res, next) => {
    const query = 'SELECT link FROM Contacts WHERE link = ?'

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(query, [req.body.link], (error, result, fields) => {
            conn.release()

            if (error) return res.status(500).send({ error: error })
            
            if (result.length > 0) {
                res.status(200).send(false)
            } else {
                res.status(200).send(true)
            }
        })
    })
}