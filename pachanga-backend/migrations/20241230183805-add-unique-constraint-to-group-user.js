'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Group_Users', {
      fields: ['user_id', 'group_id'],
      type: 'unique',
      name: 'unique_user_group_constraint'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Group_Users', 'unique_user_group_constraint');
  }
};