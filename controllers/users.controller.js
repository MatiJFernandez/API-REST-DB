const { Usuario } = require('../models');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json({ status: 200, data: usuarios });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuarios', error: error.message });
    }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }
        res.json({ status: 200, data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuario', error: error.message });
    }
};

// Crear nuevo usuario
const createUsuario = async (req, res) => {
    const { nombre, email, edad } = req.body;
    try {
        if (!nombre || !email || !edad) {
            return res.status(400).json({ status: 400, message: 'Faltan campos obligatorios' });
        }

        const nuevoUsuario = await Usuario.create({ nombre, email, edad });
        res.status(201).json({ status: 201, data: nuevoUsuario, message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al crear usuario', error: error.message });
    }
};

// Editar usuario
const updateUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        // Permitir editar todos los campos, incluyendo el rol
        const { nombre, email, edad, password, rol } = req.body;
        
        // Solo admins pueden cambiar roles
        if (rol && req.user.user.rol !== 'admin') {
            return res.status(403).json({ 
                status: 403, 
                message: 'Solo los administradores pueden cambiar roles' 
            });
        }

        // Actualizar campos si están presentes
        if (nombre !== undefined) usuario.nombre = nombre;
        if (email !== undefined) usuario.email = email;
        if (edad !== undefined) usuario.edad = edad;
        if (password !== undefined) usuario.password = password;
        if (rol !== undefined) usuario.rol = rol;

        await usuario.save();

        res.status(200).json({ 
            status: 200, 
            message: 'Usuario editado exitosamente', 
            data: usuario 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500, 
            message: 'Error al editar usuario', 
            error: error.message 
        });
    }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        await usuario.destroy();

        res.status(200).json({ status: 200, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al eliminar usuario', error: error.message });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};
