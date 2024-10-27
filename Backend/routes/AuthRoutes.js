const express = require('express');
const router = express.Router();
const {
    signin,
    signup
} = require('../controllers/AuthController.js');

//Sign in
router.post('/signin', signin);
//Sign up
router.post('/signup', signup);



module.exports = router;