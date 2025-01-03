const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const verifyToken = require('../middlewares/auth.middleware');  

router.post('/create', verifyToken, groupController.createGroup);

router.get('/search/:court_id', verifyToken, groupController.searchGroupByCourt);

router.post('/:group_id/addUser', verifyToken, groupController.addUserToGroup);

router.post('/:group_id/join', verifyToken, groupController.joinPublicGroup);

router.get('/:group_id/details', verifyToken, groupController.getGroupDetails); 

router.get('/:group_id/isMember', verifyToken, groupController.isMemberOfGroup);

module.exports = router;