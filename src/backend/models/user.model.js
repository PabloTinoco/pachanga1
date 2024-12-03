const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

// Modelo de Usuario
const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'), // Define los roles posibles
      allowNull: false,
      defaultValue: 'user', // Por defecto, el usuario será de tipo "user"
    },
},
{
  timestamps: true, // Esto añadirá createdAt y updatedAt a la tabla
},
{
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
    },
});

// Método para verificar la contraseña
User.prototype.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;
