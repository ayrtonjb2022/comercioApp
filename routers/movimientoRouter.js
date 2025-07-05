import {Router} from 'express'
const router = Router();
import {getAllMovimiento,updateMovimiento,createMovimiento} from '../controller/movimientoController.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.get('/movimientoall', authMiddleware, getAllMovimiento);
router.put('/movimientoUp/:id', authMiddleware, updateMovimiento);
router.post('/movimiento', authMiddleware, createMovimiento);

export default router