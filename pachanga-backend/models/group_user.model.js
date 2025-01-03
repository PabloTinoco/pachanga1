const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Group = require('./group.model');
const User = require('./user.model');

const Group_User = sequelize.define('Group_User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'group',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},
{
    tableName: 'group_user',
    timestamps: true,
    sequelize,
    modelName: 'Group_User',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'group_id']
      }
    ]
});


module.exports = Group_User;