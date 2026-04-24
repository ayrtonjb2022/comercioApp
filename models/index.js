import Producto from './Productos.js';
import Categoria from './categoria.js';
import Subcategoria from './subcategoria.js';
import User from './user.js';

/* 🔗 RELACIONES */

// Producto - Usuario
Producto.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'usuario' 
});

User.hasMany(Producto, { 
  foreignKey: 'userId', 
  as: 'productos' 
});

// Producto - Categoría (as: 'categoriaRel' para evitar conflicto)
Producto.belongsTo(Categoria, { 
  foreignKey: 'categoriaId', 
  as: 'categoriaRel'  // CAMBIO: nombre diferente
});

Categoria.hasMany(Producto, { 
  foreignKey: 'categoriaId', 
  as: 'productos' 
});

// Producto - Subcategoría
Producto.belongsTo(Subcategoria, { 
  foreignKey: 'subcategoriaId', 
  as: 'subcategoria' 
});

Subcategoria.hasMany(Producto, { 
  foreignKey: 'subcategoriaId', 
  as: 'productos' 
});

// Categoría - Subcategoría
Categoria.hasMany(Subcategoria, { 
  foreignKey: 'categoriaId', 
  as: 'subcategorias' 
});

Subcategoria.belongsTo(Categoria, { 
  foreignKey: 'categoriaId', 
  as: 'categoria' 
});

// Categoría - Usuario
Categoria.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'usuario' 
});

User.hasMany(Categoria, { 
  foreignKey: 'userId', 
  as: 'categorias' 
});

export {
  Producto,
  Categoria,
  Subcategoria,
  User
};