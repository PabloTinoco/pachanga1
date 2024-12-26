const Group = require('../models/group.model');
const GroupUser = require('../models/group_user.model');
const User = require('../models/user.model');
const Court = require('../models/court.model');

exports.createGroup = async (req, res) => {
  const { name, court_id, status } = req.body;
  const userId = req.user.id; 

  try {
    const court = await Court.findByPk(court_id);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar si ya existe un grupo con el mismo nombre en la misma cancha
    const existingGroup = await Group.findOne({
        where: {
          name,
          court_id
        }
      });
      if (existingGroup) {
        return res.status(400).json({ error: 'A group with this name already exists on this court' });
      }

    const group = await Group.create({
      name,
      court_id,
      status
    });

    await GroupUser.create({
      group_id: group.id,
      user_id: user.id,
      is_admin: true
    });

    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the group' });
  }
};

// Puedes agregar más funciones para gestionar los grupos y participantes