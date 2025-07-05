import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Ajusta la ruta según tu estructura

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

  const token = authHeader.split(' ')[1];
  console.log("token", token);
  
  // Ya se validó que el encabezado comience con 'Bearer ', así que solo extraemos el token
  if (!token) {
      return res.status(400).json({
          message: 'Formato de token no válido. Debe incluir "Bearer <token>".'
      });
  }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

        // Busca el usuario por id y email
        const user = await User.findOne({ _id: decoded.id, email: decoded.email });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        console.log("exito");
        

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;