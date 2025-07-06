import Caja from '../models/cajas.js';
import Cajas from '../models/cajas.js';
import Users from '../models/user.js';

// Obtener todas las cajas del usuario autenticado
export const getCajas = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) return res.status(401).json({ message: 'No autorizado' });
        
        const user = await Users.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const cajas = await Cajas.findAll({ where: { usuarioId: userId } });

        res.status(200).json(cajas || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva caja
export const createCaja = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { saldoInicial } = req.body;

        if (!userId) return res.status(401).json({ message: 'No autorizado' });

        const user = await Users.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const nuevaCaja = await Cajas.create({
            totalInicial: saldoInicial,
            totalFinal: saldoInicial,
            usuarioId: userId
        });

        res.status(201).json({
            message: "Caja creada exitosamente",
            nuevaCaja
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una caja (solo si pertenece al usuario)
export const updateCaja = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { saldoInicial, saldoFinal } = req.body;

        const caja = await Cajas.findByPk(req.params.id);
        if (!caja) return res.status(404).json({ message: 'Caja no encontrada' });

        if (String(caja.usuarioId) !== String(userId)) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        const response = await Cajas.update(
            {
                totalInicial: Number(saldoInicial),
                totalFinal: Number(saldoFinal)
            },
            {
                where: { usuarioId: userId, id: Number(req.params.id) }
            }
        );

        res.status(200).json({
            message: "Éxito al actualizar la caja",
            response
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
