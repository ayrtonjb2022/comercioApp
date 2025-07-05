import User from "../models/user.js";


// Obtener datos del usuario (sin contraseña)
export const getUserData = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log(userId,"ff");
        
        const user = await User.findByPk(userId)
        console.log("user", user);
        
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({nombre:user.nombre, apellido:user.apellido, email:user.email});
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

// Desactivar usuario (cambiar estado a 0)
export const deactivateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(
            userId,
            { estado: 0 },
            { new: true }
        ).select('nombre apellido email estado');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario desactivado', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar usuario' });
    }
};

// Actualizar nombre o apellido
export const updateUserNameOrSurname = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, apellido } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;

    await user.save();

    res.json({
      message: 'Usuario actualizado',
      user: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        estado: user.estado
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};
