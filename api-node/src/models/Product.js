const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');

class Product extends Model {};

Product.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, { sequelize, modelName: 'product'});

module.exports = Product;