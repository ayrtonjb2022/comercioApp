import { Router } from 'express';
import { 
  getCategoriasByUser,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../controller/CategoriaController.js';
import { 
  getSubcategoriasByCategoria,
  createSubcategoria,
  updateSubcategoria,
  deleteSubcategoria
} from '../controller/SubcategoriaController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Rutas para categorías
router.get('/categorias', authMiddleware, getCategoriasByUser);
router.post('/categorias', authMiddleware, createCategoria);
router.put('/categorias/:id', authMiddleware, updateCategoria);
router.delete('/categorias/:id', authMiddleware, deleteCategoria);

// Rutas para subcategorías
router.get('/categorias/:categoriaId/subcategorias', authMiddleware, getSubcategoriasByCategoria);
router.post('/subcategorias', authMiddleware, createSubcategoria);
router.put('/subcategorias/:id', authMiddleware, updateSubcategoria);
router.delete('/subcategorias/:id', authMiddleware, deleteSubcategoria);

export default router;