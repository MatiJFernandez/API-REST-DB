// generateHash.js (archivo temporal)
const bcrypt = require('bcrypt');

async function generateHash() {
    try {
        const password = 'admin123';
        const hash = await bcrypt.hash(password, 10);
        console.log('Contraseña:', password);
        console.log('Hash generado:', hash);
        console.log('Copia este hash y úsalo en MySQL');
    } catch (error) {
        console.error('Error:', error);
    }
}

generateHash();