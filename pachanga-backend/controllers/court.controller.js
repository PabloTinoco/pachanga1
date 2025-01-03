const Court  = require('../models/court.model');

// Crear cancha
const createCourt = async (req, res) => {
  try{
    const { name, country,country_code, region , city, postalCode, address, coordinateX, coordinateY } = req.body;
    const court = await Court.create({
      name,
      country,
      city,
      postalCode,
      address,
      coordinateX,
      coordinateY,
      region: region || null, // Por defecto null si no se envía
      country_code: country_code || null, // Por defecto null si no se envía
      validated: 0 // Por defecto 0 si no se envía
    });
    res.status(201).json(court);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la cancha', details: error.message });
   }
};

// Validar cancha
const validateCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const court = await Court.findByPk(id);
    if (!court) return res.status(404).json({ error: 'Cancha no encontrada' });

    court.validado = true;
    await court.save();
    res.json({ message: 'Cancha validada correctamente', court });
  } catch (error) {
    res.status(500).json({ error: 'Error al validar la cancha' });
  }
};

// Eliminar cancha
const deleteCourt = async (req, res) => {
  try {
    const { id } = req.params;
    await Court.destroy({ where: { id } });
    res.json({ message: 'Cancha eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la cancha' });
  }
};

const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.findAll();
    res.status(200).json(courts);
  } catch (error) {
    console.error('Error fetching courts:', error);
    res.status(500).json({ error: 'An error occurred while fetching courts' });
  }
};

const getCourtsByCountry = async (req, res) => {
  const { country_code } = req.params;

  try {
    const courts = await Court.findAll({
      where: { country_code }
    });
    res.status(200).json(courts);
  } catch (error) {
    console.error('Error fetching courts:', error);
    res.status(500).json({ error: 'An error occurred while fetching courts' });
  }
};

const getCourtById = async (req, res) => {
  const { id } = req.params;
  try {
    const court = await Court.findByPk(id);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }

    res.status(200).json(court);
  } catch (error) {
    console.error('Error fetching court:', error);
    res.status(500).json({ error: 'An error occurred while fetching court' });
  }
};  

module.exports = {
  createCourt,
  validateCourt,
  deleteCourt,
  getAllCourts,
  getCourtsByCountry,
  getCourtById
};
