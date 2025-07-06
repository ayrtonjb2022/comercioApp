import Movimientos from "../models/Movimientos.js";
import User from "../models/user.js";
import Caja from "../models/cajas.js";

async function getAllMovimiento(req, res) {
    const user = req.user?.id;
    try {
        if (!user) return res.status(400).json({ message: "error al obtener al usuario" });

        const existUser = await User.findByPk(user);
        if (!existUser) return res.status(400).json({ message: "error al obtener al usuario" });

        const movimientos = await Movimientos.findAll({
            where: { usuarioId: user }
        });

        res.status(200).json({
            message: "éxito al obtener todos los movimientos",
            movimientos
        });

    } catch (error) {
        res.status(500).json({
            message: "error interno",
            error: error.message
        });
    }
}

async function updateMovimiento(req, res) {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!id) return res.status(400).json({ message: "Falta el id del movimiento" });

        const existUser = await User.findByPk(userId);
        if (!existUser) return res.status(400).json({ message: "Usuario no encontrado" });

        const movimiento = await Movimientos.findOne({ where: { id, usuarioId: userId } });
        if (!movimiento) return res.status(404).json({ message: "Movimiento no encontrado" });

        const camposActualizables = ["tipo", "monto", "descripcion", "fecha"];
        let camposParaActualizar = {};
        camposActualizables.forEach(campo => {
            if (req.body[campo] !== undefined) {
                camposParaActualizar[campo] = req.body[campo];
            }
        });

        if (Object.keys(camposParaActualizar).length === 0) {
            return res.status(400).json({ message: "No hay campos para actualizar" });
        }

        await movimiento.update(camposParaActualizar);

        res.status(200).json({
            message: "Movimiento actualizado correctamente",
            movimiento
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "error al intentar actualizar los movimientos",
            error: error.message
        });
    }
}

async function createMovimiento(req, res) {
    try {
        const userId = req.user?.id;
        const { tipo, monto, descripcion, fecha, cajaId } = req.body;

        if (!userId) return res.status(400).json({ message: "Usuario no autenticado" });
        if (!tipo || !monto) {
            return res.status(400).json({ message: "Faltan datos obligatorios: tipo y monto" });
        }


        const nuevoMovimiento = await Movimientos.create({
            tipo,
            monto,
            descripcion,
            fecha: fecha || new Date(),
            usuarioId: userId,
            cajaId
        });
        const cajaActual = await Caja.findByPk(Number(cajaId));
        const montoAct = cajaActual.totalFinal
        if (tipo == "ingreso") {
            const response = await Caja.update({
                totalFinal: Number(montoAct + monto)
            }, {
                where: { usuarioId: userId, id: Number(cajaId) }
            });
        }else if(tipo == "gasto"){
            const response = await Caja.update({
                totalFinal: Number(montoAct - monto)
            }, {
                where: { usuarioId: userId, id: Number(cajaId) }
            });
        }

        res.status(201).json({
            message: "Movimiento creado exitosamente",
            movimiento: nuevoMovimiento
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al crear el movimiento",
            error: error.message
        });
    }
}

async function deleteMovimiento(req, res) {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!id) return res.status(400).json({ message: "Falta el ID del movimiento a eliminar" });

        const movimiento = await Movimientos.findOne({ where: { id, usuarioId: userId } });
        if (!movimiento) return res.status(404).json({ message: "Movimiento no encontrado" });

        await movimiento.destroy();

        res.status(200).json({
            message: "Movimiento eliminado correctamente"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al eliminar el movimiento",
            error: error.message
        });
    }
}

export {
    getAllMovimiento,
    updateMovimiento,
    createMovimiento,
    deleteMovimiento
};
