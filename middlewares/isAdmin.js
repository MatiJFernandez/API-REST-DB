const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        console.log('req.user completo:', req.user);
        console.log('req.user.rol:', req.user.rol);
        return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' })
    }
    next()
}

module.exports = isAdmin