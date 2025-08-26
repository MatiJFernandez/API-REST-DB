const isAdmin = (req, res, next) => {
    console.log('=== MIDDLEWARE ISADMIN ===');
    console.log('req.user completo:', req.user);
    console.log('req.user.user.rol:', req.user.user.rol);
    
    // Cambiar de req.user.rol a req.user.user.rol
    if (req.user.user.rol !== 'admin') {
        console.log('Acceso denegado: no es admin');
        return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' })
    }
    
    console.log('Acceso permitido: es admin');
    next()
}

module.exports = isAdmin