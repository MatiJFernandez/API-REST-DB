const express = require('express');
const router = express.Router();
const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
} = require('../controllers/users.controller');

//Importar middlewares
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// Solo admins (gestión de usuarios)
router.get('/', verifyToken, isAdmin, getUsuarios);
router.get('/:id', verifyToken, isAdmin, getUsuarioById);
router.post('/', verifyToken, isAdmin, createUsuario);
router.put('/:id', verifyToken, isAdmin, updateUsuario);
router.delete('/:id', verifyToken, isAdmin, deleteUsuario);

module.exports = router;
