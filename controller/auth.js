import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Asegúrate de que la ruta sea correcta

// Registro de usuario
export const register = async (req, res) => {
    try {
        const { nombre, apellido, email, password, confirmPassword } = req.body;

        // Verifica que ambas contraseñas coincidan
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        // Verifica si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea el usuario
        const user = await User.create({
            nombre,
            apellido,
            email,
            contraseña: hashedPassword,
        });

        res.status(201).json({ message: 'Usuario registrado correctamente', user: { id: user.id, nombre, email } });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro', error: error.message });
    }
};

// Login de usuario
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca el usuario por email
        const user = await User.findOne({
            where: { email }}); 
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }


        // Compara la contraseña
        const isMatch = await bcrypt.compare(password, user.contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Genera el token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {  username: user.nombre, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error: error.message });
    }
};
