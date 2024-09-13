const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');
const bcrypt = require('bcryptjs');

class User extends Model {
    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,      
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { sequelize, modelName: 'user'});

User.beforeCreate(async (user) => {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash
});

module.exports = User