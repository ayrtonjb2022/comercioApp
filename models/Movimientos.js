import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js'; 
import Caja from './cajas.js';

class Movimientos extends Model {}

Movimientos.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tipo: {
            type: DataTypes.ENUM('ingreso', 'gasto'),
            allowNull: false,
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        cajaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Caja,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'Movimientos',
        tableName: 'movimientos',
        timestamps: false,
    }
);

// Relaciones
Movimientos.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });
Movimientos.belongsTo(Caja, { foreignKey: 'cajaId', as: 'caja' });

export default Movimientos;