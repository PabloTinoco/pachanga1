const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Court = require('./court.model'); 
const User = require('./user.model');
const Group_User = require('./group_user.model.js');

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
      model: 'court',
      key: 'id',
    },
  },
  private: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false  // 0 -> público, 1 -> privado
  }
},
{
  sequelize,
  modelName: 'Group',
  tableName: 'group',
  timestamps: true, // Esto añadirá createdAt y updatedAt a la tabla
  indexes: [
    {
      unique: true,
      fields: ['name', 'court_id']
    }
  ]
});

Group.associate = models => {
  Group.belongsTo(models.Court, { foreignKey: 'court_id' });
  Group.belongsToMany(models.User, { through: models.Group_User, foreignKey: 'group_id' });
};

module.exports = Group;