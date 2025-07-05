import { Router } from 'express';
import { getProductsByUser,
     createProduct,
      updateProduct,
      deleteProduct
} from '../controller/ProductoController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/productos', authMiddleware, getProductsByUser);
router.post('/productos', authMiddleware, createProduct );
router.put('/productos/:id', authMiddleware, updateProduct );
router.delete('/productos/:id', authMiddleware, deleteProduct );


export default router;