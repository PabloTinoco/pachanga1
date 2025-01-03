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
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    exp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 10
    }},
    role: {
      type: DataTypes.ENUM('user', 'admin'), // Define los roles posibles
      allowNull: false,
      defaultValue: 'user', // Por defecto, el usuario será de tipo "user"
    },
},
{
  sequelize,
  modelName: 'User',
  tableName: 'user',
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

User.associate = models => {
    User.belongsToMany(models.Group, { through: models.Group_User, foreignKey: 'user_id' });
  };

module.exports = User;
