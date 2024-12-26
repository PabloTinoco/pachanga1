const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Group = require('./group.model');
const User = require('./user.model');

const GroupUser = sequelize.define('Group_User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},
{
    timestamps: true, // Esto añadirá createdAt y updatedAt a la tabla
},
{
  tableName: 'group_users'
});

module.exports = GroupUser;