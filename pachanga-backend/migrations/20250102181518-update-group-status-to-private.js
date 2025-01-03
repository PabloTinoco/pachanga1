'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('group', 'private', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    
    await queryInterface.sequelize.query(
      'UPDATE group SET private = case when status = "private" then true else false end'
    );

    await queryInterface.removeColumn('group', 'status');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('group', 'status', {
      type: Sequelize.ENUM('public', 'private'),
      allowNull: false,
      defaultValue: 'public'
    });

    await queryInterface.sequelize.query(
      'UPDATE group SET status = case when private = true then "private" else "public" end'
    );

    await queryInterface.removeColumn('group', 'private');
  }
};