// controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv');

dotenv.config();

// Registrar usuario
const register = async (req, res) => {
  console.log('Cuerpo de la solicitud:', req.body);
  const { username, email, password, firstName, lastName,role,country, city, height, exp  } = req.body;

  try {

     // Verificar que todos los campos están presentes
     if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios: username, email y password' });
    }

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username ya registrado' });
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Establecer un rol por defecto si no se proporciona (opcional)
    const userRole = role || 'user';

    // Crear nuevo usuario
    const newUser = await User.create({ username,firstName,lastName, email, passwordHash, role: userRole, country, city, height, exp });


    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        country: newUser.country,
        city: newUser.city,
        height: newUser.height,
        exp: newUser.exp,
      }
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error); // Esto imprimirá detalles en la consola
    return res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

// Login de usuario
const login = async (req, res) => {
  console.log('Login:', req.body);
  try {
    const { email, password } = req.body;

    // Validar entrada
    if (!email || !password) {
      return res.status(400).json({ message: 'El email y la contraseña son obligatorios' });
    }

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear JWT para el usuario
    const token = jwt.sign({ id: user.id, email: user.email,  role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login exitoso', token });

  } catch (error) {
    return res.status(500).json({ message: 'Error en el login', error });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // El ID del usuario ya está en el token decodificado
    const user = await User.findByPk(userId, { attributes: ['id', 'username', 'email','role'] }); // Buscar usuario en la base de datos

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Perfil del usuario', user });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // El ID del usuario autenticado (desde el token)
    const { username, password } = req.body;

    // Validar entrada
    if (!username && !password) {
      return res.status(400).json({ message: 'Se debe proporcionar al menos un dato para actualizar (nombre o contraseña).' });
    }

    // Obtener usuario actual
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar datos
    if (username) user.username = username;
    if (password) user.passwordHash = await bcrypt.hash(password, 10);

    await user.save(); // Guardar cambios en la base de datos

    res.status(200).json({ message: 'Perfil actualizado exitosamente.', user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil.', error: error.message });
  }
};



module.exports = { register, login, getProfile, updateProfile };
