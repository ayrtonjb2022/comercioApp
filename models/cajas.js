import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js'; 

class Caja extends Model {}

Caja.init({
    totalInicial: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    totalFinal: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Referencia directa al modelo User
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Caja',
    tableName: 'Cajas',
    createdAt: 'creadoEl',
    updatedAt: 'actualizadoEl',
});

Caja.belongsTo(User, { foreignKey: 'usuarioId', as: 'caja_usuario' });

export default Caja;