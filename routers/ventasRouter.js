import {
    getVentasByUser,
    createVenta,
    updateVenta,
    deleteVenta
} from '../controller/ventasController.js'
import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
const router = Router();

router.get("/ventasAll", authMiddleware, getVentasByUser)
router.post("/ventas", authMiddleware, createVenta);
router.put("/ventas/:id", authMiddleware, updateVenta);
router.delete("/ventasD/:id", authMiddleware, deleteVenta);



export default router