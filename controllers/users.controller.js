const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

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
  try {
    const { nombre, email, edad, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ status: 400, message: 'Faltan campos obligatorios (nombre, email, password)' });
    }

    const exist = await Usuario.findOne({ where: { email } });
    if (exist) {
      return res.status(400).json({ status: 400, message: 'El usuario ya existe' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      edad: Number(edad) || 0,
      password: hashed,
      rol: rol || 'cliente'
    });

    res.status(201).json({ status: 201, data: nuevoUsuario, message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error al crear usuario', error: error.message });
  }
};

// Editar usuario
const updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });

    const { nombre, email, edad, password, rol } = req.body;

    if (rol && req.user.user.rol !== 'admin') {
      return res.status(403).json({ status: 403, message: 'Solo los administradores pueden cambiar roles' });
    }

    if (nombre !== undefined) usuario.nombre = nombre;
    if (email !== undefined) usuario.email = email;
    if (edad !== undefined) usuario.edad = Number(edad);
    if (password !== undefined) {
      usuario.password = await bcrypt.hash(password, 10);
    }
    if (rol !== undefined) usuario.rol = rol;

    await usuario.save();
    res.status(200).json({ status: 200, message: 'Usuario editado exitosamente', data: usuario });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error al editar usuario', error: error.message });
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
