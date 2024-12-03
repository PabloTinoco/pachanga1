const { Sequelize } = require('sequelize');
require('dotenv').config();

// Conexión a MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME, // Nombre de la base de datos
    process.env.DB_USER, // Usuario
    process.env.DB_PASSWORD, // Contraseña
    {
        host: process.env.DB_HOST, // Host de la base de datos
        dialect: 'mysql',
        port: 3306,
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => console.log('Conectado a MySQL'))
    .catch(err => console.error('Error al conectar a MySQL:', err));

module.exports = sequelize;
