const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Court = require('./court.model');
const User = require('./user.model');
const Group_User = require('./group_user.model');

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
    allowNull: false,
    references: {
      model: 'Court',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('public', 'private'),
    allowNull: false,
    defaultValue: 'public'
  }
},
{
  sequelize,
  modelName: 'Group',
  tableName: 'groups',
  timestamps: true, // Esto añadirá createdAt y updatedAt a la tabla

  indexes: [
    {
      unique: true,
      fields: ['name', 'court_id']
    }
  ]
});

Group.belongsTo(Court, { foreignKey: 'court_id' });
Group.belongsToMany(User, { through: Group_User });

module.exports = Group;