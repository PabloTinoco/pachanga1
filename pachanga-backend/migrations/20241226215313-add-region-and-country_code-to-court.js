'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Courts', 'region', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Courts', 'country_code', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Courts', 'region');
    await queryInterface.removeColumn('Courts', 'country_code');
  }
};