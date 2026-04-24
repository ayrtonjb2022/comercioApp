import Producto from './Productos.js';
import Categoria from './categoria.js';
import Subcategoria from './subcategoria.js';
import User from './user.js';

// =============================================
// ASOCIACIONES QUE NO ESTÁN DEFINIDAS DENTRO DE CADA MODELO
// =============================================

// Producto - Categoría
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoriaRel' });
Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' });

// Producto - Subcategoría
Producto.belongsTo(Subcategoria, { foreignKey: 'subcategoriaId', as: 'subcategoria' });
Subcategoria.hasMany(Producto, { foreignKey: 'subcategoriaId', as: 'productos' });

// Categoría - Subcategoría
Categoria.hasMany(Subcategoria, { foreignKey: 'categoriaId', as: 'subcategorias' });
Subcategoria.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

// Categoría - Usuario (alias único: 'categoria_usuario')
Categoria.belongsTo(User, { foreignKey: 'userId', as: 'categoria_usuario' });
User.hasMany(Categoria, { foreignKey: 'userId', as: 'categorias' });

// User - Producto (el hasMany no está en Productos.js, solo el belongsTo)
User.hasMany(Producto, { foreignKey: 'userId', as: 'productos' });

// =============================================
// NOTA: NO se incluye aquí Producto.belongsTo(User) porque YA está definido
// dentro del archivo models/Productos.js con as: 'usuario'.
// 
// Tampoco se incluyen las asociaciones de Caja y Movimientos con User,
// porque cada una ya está definida dentro de sus propios archivos:
// - models/cajas.js: Caja.belongsTo(User, { as: 'caja_usuario' })
// - models/Movimientos.js: Movimientos.belongsTo(User, { as: 'movimiento_usuario' })
// =============================================

export { Producto, Categoria, Subcategoria, User };