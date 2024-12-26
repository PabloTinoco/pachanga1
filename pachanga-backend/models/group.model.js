const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  court_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('public', 'private'),
    allowNull: false,
    defaultValue: 'public'
  }
},
{
    timestamps: true, // Esto añadirá createdAt y updatedAt a la tabla
}, 
{
  tableName: 'groups',
  indexes: [
    {
      unique: true,
      fields: ['name', 'court_id']
    }
  ]
});

module.exports = Group;