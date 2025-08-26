const { Producto } = require('../models')

const getProducts = async (req, res) => {
    try {
        const productos = await Producto.findAll()
        res.json({ data: productos, status: 200, message: 'Productos obtenidos de manera exitosa' })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' })
    }
}

const getProductById = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id)
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        res.json({ data: producto, status: 200, message: 'Producto encontrado' })
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el producto' })
    }
}

const createProduct = async (req, res) => {
    console.log('=== CREAR PRODUCTO ===');
    console.log('Body recibido:', req.body);
    console.log('Headers:', req.headers);
    console.log('Usuario autenticado:', req.user);
    
    const { nombre, precio } = req.body
    
    try {
        if (!nombre || !precio) {
            console.log('Faltan datos obligatorios');
            return res.status(400).json({ message: 'Faltan datos obligatorios' })
        }
        
        console.log('Datos validados, creando producto...');
        const nuevoProducto = await Producto.create({ nombre, precio })
        console.log('Producto creado exitosamente:', nuevoProducto);
        
        res.json({ status: 201, data: nuevoProducto, message: 'Producto creado exitosamente' })
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Hubo un error al crear el producto', error: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ status: 404, message: 'Producto no encontrado' });
        }

        const { nombre, precio } = req.body;
        producto.nombre = nombre || producto.nombre;
        producto.precio = precio || producto.precio;

        await producto.save();
        res.status(200).json({ status: 200, message: 'Producto editado exitosamente', data: producto });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al editar producto', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ status: 404, message: 'Producto no encontrado' });
        }

        await producto.destroy();
        res.status(200).json({ status: 200, message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al eliminar producto', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}