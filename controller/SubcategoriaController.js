import Subcategoria from '../models/subcategoria.js';
import Categoria from '../models/categoria.js';

/** GET: obtener subcategorías por categoría */
async function getSubcategoriasByCategoria(req, res) {
  try {
    const userId = req.user.id;
    const { categoriaId } = req.params;

    // Verificar que la categoría pertenezca al usuario
    const categoria = await Categoria.findOne({
      where: { id: categoriaId, userId }
    });

    if (!categoria) {
      return res.status(404).json({ 
        message: 'Categoría no encontrada o no autorizada' 
      });
    }

    const subcategorias = await Subcategoria.findAll({
      where: { 
        categoriaId,
        activo: true 
      },
      order: [['nombre', 'ASC']]
    });

    console.log(`✅ Encontradas ${subcategorias.length} subcategorías para categoría ${categoriaId}`);
    res.json({ subcategorias });
  } catch (error) {
    console.error('❌ Error en getSubcategoriasByCategoria:', error);
    res.status(500).json({ 
      error: 'Error al obtener subcategorías', 
      details: error.message 
    });
  }
}

/** POST: crear subcategoría */
async function createSubcategoria(req, res) {
  try {
    const userId = req.user.id;
    const { nombre, categoriaId } = req.body;

    if (!nombre || !categoriaId) {
      return res.status(400).json({ error: 'El nombre y la categoría son obligatorios' });
    }

    // Verificar que la categoría exista y pertenezca al usuario
    const categoria = await Categoria.findOne({ 
      where: { id: categoriaId, userId } 
    });
    
    if (!categoria) {
      return res.status(404).json({ 
        message: 'Categoría no encontrada o no autorizada' 
      });
    }

    // Verificar si ya existe una subcategoría con el mismo nombre en esta categoría
    const subcategoriaExistente = await Subcategoria.findOne({
      where: { nombre, categoriaId }
    });

    if (subcategoriaExistente) {
      return res.status(400).json({ 
        error: 'Ya existe una subcategoría con este nombre en esta categoría' 
      });
    }

    const subcategoria = await Subcategoria.create({
      nombre,
      categoriaId,
      activo: true
    });

    res.status(201).json({ 
      message: 'Subcategoría creada exitosamente',
      subcategoria 
    });
  } catch (error) {
    console.error('❌ Error en createSubcategoria:', error);
    res.status(500).json({ 
      error: 'Error al crear subcategoría',
      details: error.message 
    });
  }
}

/** PUT: actualizar subcategoría */
async function updateSubcategoria(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { nombre, activo } = req.body;

    // Verificar que la subcategoría exista y que la categoría pertenezca al usuario
    const subcategoria = await Subcategoria.findOne({
      where: { id },
      include: [{
        model: Categoria,
        as: 'categoria',
        where: { userId }
      }]
    });
    
    if (!subcategoria) {
      return res.status(404).json({ 
        message: 'Subcategoría no encontrada o no autorizada' 
      });
    }

    await subcategoria.update({ nombre, activo });
    
    res.json({ 
      message: 'Subcategoría actualizada exitosamente',
      subcategoria 
    });
  } catch (error) {
    console.error('❌ Error en updateSubcategoria:', error);
    res.status(500).json({ 
      error: 'Error al actualizar subcategoría',
      details: error.message 
    });
  }
}

/** DELETE: eliminar subcategoría (marcar como inactiva) */
async function deleteSubcategoria(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar que la subcategoría exista y que la categoría pertenezca al usuario
    const subcategoria = await Subcategoria.findOne({
      where: { id },
      include: [{
        model: Categoria,
        as: 'categoria',
        where: { userId }
      }]
    });
    
    if (!subcategoria) {
      return res.status(404).json({ 
        message: 'Subcategoría no encontrada o no autorizada' 
      });
    }

    await subcategoria.update({ activo: false });
    
    res.json({ 
      message: 'Subcategoría eliminada exitosamente' 
    });
  } catch (error) {
    console.error('❌ Error en deleteSubcategoria:', error);
    res.status(500).json({ 
      error: 'Error al eliminar subcategoría',
      details: error.message 
    });
  }
}

export {
  getSubcategoriasByCategoria,
  createSubcategoria,
  updateSubcategoria,
  deleteSubcategoria
};