const express = require('express')
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChat, createGroupChat, renameGroupName,addToGroup, removeGroupMember } = require('../controller/chatController');

const router = express.Router();


router.route('/').post(protect,accessChat);
router.route('/').get(protect,fetchChat);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect,renameGroupName);
router.route('/addtogroup').put(protect,addToGroup);
router.route('/groupremove').put(protect,removeGroupMember);
module.exports = router;