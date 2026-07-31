const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController.cjs');

router.get('/users', userController.getAllUsers);

router.get('/users/:userId', userController.getUserById);


module.exports = router;