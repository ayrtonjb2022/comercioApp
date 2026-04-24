import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Subcategoria extends Model {}

Subcategoria.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Subcategoria',
  tableName: 'subcategorias',
  timestamps: true
});

export default Subcategoria;
