const sequelize = require('../utils/database');
const Sequelize = require('sequelize');


const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: Sequelize.TEXT,
    },
    password: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false
    }
})

module.exports = User;