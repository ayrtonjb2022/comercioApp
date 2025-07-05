import Producto from '../models/Productos.js';
import User from '../models/user.js';

/** GET: traer productos por usuario */
async function getProductsByUser(req, res) {
  try {
    const userId = req.user?.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User no encontrado' });

    const productos = await Producto.findAll({ 
      where: { userId },
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] }
    });

    res.status(200).json({
      message: "Éxito al traer los productos",
      productos
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno', error });
  }
}

/** POST: crear producto */
async function createProduct(req, res) {
  try {
    const userId = req.user?.id;
    const {
      nombre, cantidad, precioCompra, precioVenta,
      porcentajeGanancia, descripcion, categoria, activo
    } = req.body;

    const nuevoProducto = await Producto.create({
      nombre,
      cantidad,
      precioCompra,
      precioVenta,
      porcentajeGanancia,
      descripcion,
      categoria,
      activo,
      userId
    });

    res.status(201).json({ message: 'Producto creado correctamente', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error });
  }
}

/** PUT: actualizar producto */
async function updateProduct(req, res) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const producto = await Producto.findOne({ where: { id, userId } });
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado o no autorizado' });

    await producto.update(req.body);

    res.status(200).json({ message: 'Producto actualizado correctamente', producto });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error });
  }
}

/** DELETE: eliminar producto */
async function deleteProduct(req, res) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const producto = await Producto.findOne({ where: { id, userId } });
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado o no autorizado' });

    await producto.destroy();

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
}

export {
  getProductsByUser,
  createProduct,
  updateProduct,
  deleteProduct
};
