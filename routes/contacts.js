const express = require('express')
const router = express.Router()
const login = require('../middleware/login')

const ContactsControllers = require('../controllers/contacts-controller')

router.get('/', ContactsControllers.getAllContacts)

router.get('/:id', ContactsControllers.getContactById)

router.post('/', login, ContactsControllers.addContact)

router.patch('/:id', login, ContactsControllers.editContact)

router.delete('/:id', login, ContactsControllers.deleteContact)

module.exports = router