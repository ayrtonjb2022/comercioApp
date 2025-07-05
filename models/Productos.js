import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

class Producto extends Model {}

Producto.init({
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    precioCompra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    precioVenta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    porcentajeGanancia: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: true
});

Producto.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

export default Producto;
