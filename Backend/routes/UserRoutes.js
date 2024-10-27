const express = require('express');
const router = express.Router();
const {
    getAllClients,
    getClient,
    getAllAdmins,
    getAdmin
} = require('../controllers/UserController');
const Authentication = require('../middleware/Authentification');
const Authorization = require('../middleware/Authorization');
const checkClientOwnership = require('../middleware/CheckClientOwnership');

//secure routes
router.use(Authentication);

//shared routes
router.get('/clients/:id', Authorization(['client','admin']), checkClientOwnership, getClient);

//admin routes
router.get('/admins', Authorization(['admin']), getAllAdmins);
router.get('/admins/:id', Authorization(['admin']), getAdmin);
router.get('/clients', Authorization(['admin']), getAllClients);



module.exports = router;