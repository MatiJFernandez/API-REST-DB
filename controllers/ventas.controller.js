const { Venta, Usuario, Producto } = require('../models')

const getAllSales = async (req, res) => {
    try {
        let ventas;
        
        if (req.user.user.rol === 'admin') {
            // Admin ve todas las ventas
            ventas = await Venta.findAll({
                include: [Usuario, Producto]
            });
        } else {
            // Cliente ve solo sus ventas
            ventas = await Venta.findAll({
                where: { usuarioId: req.user.user.id },
                include: [Usuario, Producto]
            });
        }

        res.json({ status: 200, data: ventas, message: 'Ventas obtenidas exitosamente' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener las ventas', error: error })
    }
}

const getSaleById = async (req, res) => {
    try {
        const sale = await Venta.findByPk(req.params.id, {
            include: [Usuario, Producto]
        });

        if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
        
        // Cliente solo puede ver su venta
        if (req.user.user.rol !== 'admin' && sale.usuarioId !== req.user.user.id) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        res.json({ status: 200, data: sale, message: 'Venta obtenida exitosamente' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener la venta solicitada', error: error })
    }
}

const createSale = async (req, res) => {
    const { usuarioId, productoId, cantidad, total, fecha } = req.body
    try {
        if (!usuarioId || !productoId || !cantidad || !total || !fecha) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' })
        }

        // Cliente solo puede crear ventas para sí mismo
        if (req.user.user.rol !== 'admin' && usuarioId !== req.user.user.id) {
            return res.status(403).json({ message: 'Solo puedes crear ventas para tu cuenta' });
        }

        const newSale = await Venta.create({ usuarioId, productoId, cantidad, total, fecha })
        res.json({ status: 201, message: 'Venta registrada exitosamente', data: newSale })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al crear la nueva venta', error: error })
    }
}

const updateSale = async (req, res) => {
    try {
        const sale = await Venta.findByPk(req.params.id)
        if (!sale) return res.status(404).json({ message: 'Venta no encontrada' })

        const { usuarioId, productoId, cantidad, total, fecha } = req.body

        sale.usuarioId = usuarioId || sale.usuarioId
        sale.productoId = productoId || sale.productoId
        sale.cantidad = cantidad || sale.cantidad
        sale.total = total || sale.total
        sale.fecha = fecha || sale.fecha

        await sale.save()

        res.json({ status: 201, message: 'Venta actualizada exitosamente', data: sale })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al actualizar la venta', error: error })
    }
}

const deleteSale = async (req, res) => {
    try {
        const sale = await Venta.findByPk(req.params.id)
        if (!sale) return res.status(404).json({ message: 'Venta no encontrada' })

        await sale.destroy()
        res.json({ status: 201, message: 'Venta eliminada exitosamente' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al eliminar la venta', error: error })
    }
}

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale
}