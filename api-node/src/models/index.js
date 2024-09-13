const sequelize = require('../config/Database');
const Product = require('./Product'); 
const User = require('./User');

// Defina as associações após todos os modelos serem importados
User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    Product,
    User
};
