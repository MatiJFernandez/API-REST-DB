const express = require('express');
const router = express.Router();
const { getAllSales, getSaleById, createSale, updateSale, deleteSale } = require('../controllers/ventas.controller')

// Importar middlewares
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// Usuarios logueados (clientes ven y crean sus ventas)
router.get('/', verifyToken, getAllSales)
router.get('/:id', verifyToken, getSaleById)
router.post('/', verifyToken, createSale)

//Solo admin puede actualizar y eliminar
router.put('/:id', verifyToken, isAdmin, updateSale)
router.delete('/:id', verifyToken, isAdmin, deleteSale)

module.exports = router