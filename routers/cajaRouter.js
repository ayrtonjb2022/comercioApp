import { Router } from 'express';
import { getCajas,createCaja,updateCaja} from '../controller/CajasController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/cajas', authMiddleware, getCajas);
router.post('/cajas', authMiddleware, createCaja);
router.put('/cajas/:id', authMiddleware, updateCaja);


export default router;