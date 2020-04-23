const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const routesContacts = require('./routes/contacts')
const routesUsers = require('./routes/users')
const routeVerify = require('./routes/verify')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/contacts', routesContacts)
app.use('/users', routesUsers)
app.use('/verify', routeVerify)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        return res.status(200).send({})
    }

    next()
})

app.use((req, res, next) => {
    const erro = new Error('Endpoint não encontrado')

    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)

    return res.send({
        erro: {
            message: error.message
        }
    })
})

module.exports = app