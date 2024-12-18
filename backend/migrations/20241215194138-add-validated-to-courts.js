// migrations/xxxx-add-validated-to-courts.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Courts', 'validated', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Courts', 'validated');
  },
};
