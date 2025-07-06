import { Venta, Detalle_Ventas } from '../models/Ventas.js';
import Caja from '../models/cajas.js';
import User from '../models/user.js';
import Producto from '../models/Productos.js';
/** Obtener todas las ventas por usuario */
async function getVentasByUser(req, res) {
  try {
    const userId = req.user?.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const ventas = await Venta.findAll({
      where: { usuarioId: userId },
      attributes: { exclude: ['usuarioId', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: Detalle_Ventas,
          as: 'detalles',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: Producto,
              as: 'productos', // alias para evitar ambigüedades
              attributes: ['id', 'nombre', 'precioCompra', 'precioVenta']
            }
          ]
        }
      ]
    });

    res.status(200).json({ ventas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno', error });
  }
}



/** Crear una nueva venta con sus detalles y actualizar caja */
async function createVenta(req, res) {
    const t = await Venta.sequelize.transaction();
    try {
        const usuarioId = req.user.id;
        const { fecha, total, cajaId, detalles,medio_pago } = req.body;

        // Verificar si la caja existe
        const caja = await Caja.findByPk(cajaId, { transaction: t });
        if (!caja) {
            await t.rollback();
            return res.status(404).json({ message: 'Caja no encontrada' });
        }

        // Crear venta
        const venta = await Venta.create(
            { fecha, total, usuarioId, cajaId,medio_pago },
            { transaction: t }
        );

        // Crear los detalles de la venta
        for (const item of detalles) {
            await Detalle_Ventas.create(
                {
                    venta_id: venta.id,
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    total: item.total,
                    descuento: item.descuento,
                },
                { transaction: t }
            );
        }

        // Actualizar el saldo de la caja
        caja.totalFinal += total;
        await caja.save({ transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Venta registrada correctamente', ventaId: venta.id });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Error al registrar la venta', error });
    }
}

/** Actualizar una venta */
async function updateVenta(req, res) {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const venta = await Venta.findOne({ where: { id, usuarioId } });
        if (!venta) return res.status(404).json({ message: 'Venta no encontrada o no autorizada' });

        await venta.update(req.body);

        res.status(200).json({ message: 'Venta actualizada correctamente', venta });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la venta', error });
    }
}

/** Eliminar venta y sus detalles */
async function deleteVenta(req, res) {
    try {
        const usuarioId = req.user.id;
        const { id } = req.params;

        const venta = await Venta.findOne({ where: { id, usuarioId } });
        if (!venta) return res.status(404).json({ message: 'Venta no encontrada o no autorizada' });

        await venta.destroy(); // Elimina venta y detalles si hay ON DELETE CASCADE

        res.status(200).json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la venta', error });
    }
}

export {
    getVentasByUser,
    createVenta,
    updateVenta,
    deleteVenta
};
