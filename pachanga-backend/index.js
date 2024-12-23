// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const courtRoutes = require('./routes/court.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para manejar cuerpos de solicitudes JSON

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

app.use('/api/court', courtRoutes);

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync({ force: false }) // Cambia a 'force: true' solo para regenerar la tabla
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(process.env.PORT, () => {
      console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });



