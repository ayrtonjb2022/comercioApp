import express from 'express';
import { register, login } from '../controller/auth.js';

const router = express.Router();

// Ruta para registro de usuario
router.post('/register', register);

// Ruta para login de usuario
router.post('/login', login);

export default router;
