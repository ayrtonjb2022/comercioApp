import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 
import User from './user.js';
import Caja from './cajas.js';
import Producto from "./Productos.js";

class Venta extends Model {}

Venta.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        medio_pago: {
            type: DataTypes.ENUM('efectivo', 'debito', 'credito', 'mercado_pago'),
            allowNull: false,
            defaultValue: 'efectivo',
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
        modelName: 'Venta',
        tableName: 'ventas',
        timestamps: true,
    }
);

class Detalle_Ventas extends Model {}

Detalle_Ventas.init({ 
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    venta_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Venta,
            key: 'id',
        }
    },
    producto_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id',
        }
    },
    cantidad:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio_unitario:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    total:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    descuento: {  // nuevo campo para el descuento
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
        validate: {
            min: 0,
            max: 100,
            isDecimal: true,
        }
    }
},{
    sequelize,
    timestamps: true,
    tableName: "detalle_ventas",
    modelName: "Detalle_Ventas",
});


Venta.hasMany(Detalle_Ventas, { foreignKey: 'venta_id', as: 'detalles' });
Detalle_Ventas.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Detalle_Ventas.belongsTo(Producto, {
  as: 'productos',
  foreignKey: 'producto_id'
});


export {
    Venta,
    Detalle_Ventas
};
