const Group = require('../models/group.model');
const GroupUser = require('../models/group_user.model.js');
const User = require('../models/user.model');
const Court = require('../models/court.model');
const Group_User = require('../models/group_user.model.js');

exports.createGroup = async (req, res) => {
  const { name, court_id, private } = req.body;
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
      private
    });

    await Group_User.create({
      group_id: group.id,
      user_id: user.id,
      is_admin: true
    });

    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the group' });
  }
};

exports.searchGroupByCourt = async (req, res) => {
  const { court_id } = req.params;
  const userId = req.user.id;

  try {
    // Fetch all groups for the specified court
    const groups = await Group.findAll({
      where: { court_id },
      include: [{
        model: User,
        attributes: [],
        through: {
          attributes: []
        },
        where: {
          id: userId
        },
        required: false
      }]
    });

    console.log(groups);

    const filteredGroups = groups.filter(group => !group.private || group.GroupUser.length > 0);
    res.status(200).json(filteredGroups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'An error occurred while fetching groups' });
  }
}

exports.addUserToGroup = async (req, res) => {
  const { group_id } = req.params;
  const { user_id } = req.body; // El ID del usuario que se va a añadir
  const requestingUserId = req.user.id; // El ID del usuario que hace la solicitud

  try {
    const group = await Group.findByPk(group_id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.private) {
      // Verificar si el usuario que hace la solicitud es el admin del grupo
      const groupUser = await GroupUser.findOne({ where: { user_id: requestingUserId, group_id } });
      if (!groupUser || !groupUser.isAdmin) {
        return res.status(403).json({ error: 'Only the group admin can add users to this private group' });
      }
    }

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await GroupUser.create({ user_id, group_id });
    res.status(200).json({ message: 'User added to group successfully' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'User already exists in this group' });
    }
    console.error('Error adding user to group:', error);
    res.status(500).json({ error: 'An error occurred while adding the user to the group' });
  }
};

exports.joinPublicGroup = async (req, res) => {
  const { group_id } = req.params;
  const user_id = req.user.id; // El ID del usuario que se va a añadir a sí mismo

  try {
    const group = await Group.findByPk(group_id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (!group.private) {
      return res.status(403).json({ error: 'Only public groups can be joined by users directly' });
    }

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await GroupUser.create({ user_id, group_id });
    res.status(200).json({ message: 'Joined public group successfully' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'User already exists in this group' });
    }
    console.error('Error adding user to group:', error);
    res.status(500).json({ error: 'An error occurred while adding the user to the group' });
  }
};

exports.getGroupDetails = async (req, res) => {
  const { group_id } = req.params;
  const userId = req.user.id; // El ID del usuario que hace la solicitud

  try {
    
    const group = await Group.findByPk(group_id, {
      include: [
        {
          model: Court,
          attributes: ['name', 'address']
        },
        {
          model: User,
          attributes: ['username', 'email'],
          through: { attributes: [] }
        }
      ]
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }


    if (group.private) {
      // Verificar si el usuario que hace la solicitud es miembro del grupo
      const groupUser = await GroupUser.findOne({ where: { user_id: userId, group_id: group_id } });
      if (!groupUser) {
        return res.status(403).json({ error: 'Access denied. You are not a member of this private group' });
      }
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group details:', error);
    res.status(500).json({ error: 'An error occurred while fetching group details' });
  }
};

exports.isMemberOfGroup = async (req, res) => {
  const { group_id } = req.params;
  const userId = req.user.id; // El ID del usuario que hace la solicitud
  try {
    const group = await Group.findByPk(group_id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    if (group.private) {
      const groupUser = await GroupUser.findOne({ where: { user_id: userId, group_id: group_id } });
      if (groupUser) {
        return res.status(403).json(1);
      }else{
        return res.status(200).json(0);
      }
    }
    res.status(200).json(1);
  } catch (error) {
    console.error('Error checking if user is member of group:', error);
    res.status(500).json({ error: 'An error occurred while checking if user is member of group' });
  }
};


// Puedes agregar más funciones para gestionar los grupos y participantes