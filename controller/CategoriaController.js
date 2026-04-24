import Categoria from '../models/categoria.js';
import Subcategoria from '../models/subcategoria.js';

/** GET: traer categorías por usuario */
async function getCategoriasByUser(req, res) {
  try {
    const userId = req.user.id;
    console.log('Buscando categorías para userId:', userId);

    const categorias = await Categoria.findAll({
      where: { userId, activo: true },
      include: [
        {
          model: Subcategoria,
          as: 'subcategorias',
          where: { activo: true },
          required: false,
          attributes: ['id', 'nombre']
        }
      ],
      order: [['nombre', 'ASC']]
    });

    console.log(`✅ Encontradas ${categorias.length} categorías`);
    res.json({ categorias });
  } catch (error) {
    console.error('❌ Error en getCategoriasByUser:', error);
    res.status(500).json({ 
      error: 'Error al obtener categorías', 
      details: error.message 
    });
  }
}

/** POST: crear categoría */
async function createCategoria(req, res) {
  try {
    const userId = req.user.id;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Verificar si ya existe una categoría con el mismo nombre para este usuario
    const categoriaExistente = await Categoria.findOne({
      where: { nombre, userId }
    });

    if (categoriaExistente) {
      return res.status(400).json({ 
        error: 'Ya existe una categoría con este nombre' 
      });
    }

    const categoria = await Categoria.create({
      nombre,
      userId,
      activo: true
    });

    res.status(201).json({ 
      message: 'Categoría creada exitosamente',
      categoria 
    });
  } catch (error) {
    console.error('❌ Error en createCategoria:', error);
    res.status(500).json({ 
      error: 'Error al crear categoría',
      details: error.message 
    });
  }
}

/** PUT: actualizar categoría */
async function updateCategoria(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { nombre, activo } = req.body;

    const categoria = await Categoria.findOne({ 
      where: { id, userId } 
    });
    
    if (!categoria) {
      return res.status(404).json({ 
        message: 'Categoría no encontrada o no autorizada' 
      });
    }

    await categoria.update({ nombre, activo });
    
    res.json({ 
      message: 'Categoría actualizada exitosamente',
      categoria 
    });
  } catch (error) {
    console.error('❌ Error en updateCategoria:', error);
    res.status(500).json({ 
      error: 'Error al actualizar categoría',
      details: error.message 
    });
  }
}

/** DELETE: eliminar categoría (marcar como inactiva) */
async function deleteCategoria(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const categoria = await Categoria.findOne({ 
      where: { id, userId } 
    });
    
    if (!categoria) {
      return res.status(404).json({ 
        message: 'Categoría no encontrada o no autorizada' 
      });
    }

    // Marcar como inactiva y también desactivar sus subcategorías
    await categoria.update({ activo: false });
    await Subcategoria.update({ activo: false }, { where: { categoriaId: id } });
    
    res.json({ 
      message: 'Categoría eliminada exitosamente' 
    });
  } catch (error) {
    console.error('❌ Error en deleteCategoria:', error);
    res.status(500).json({ 
      error: 'Error al eliminar categoría',
      details: error.message 
    });
  }
}

export {
  getCategoriasByUser,
  createCategoria,
  updateCategoria,
  deleteCategoria
};