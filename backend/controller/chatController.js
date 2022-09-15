const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req,res) =>{

   const { userId } =  req.body;

   if(!userId) {
       console.log("userid param not sent with request");
       return res.status(400);
   }

   var isChat  = await Chat.find({
    isGroupChat : false,
    $and: [
        {users: { $elemMatch: { $eq:req.user._id}}},
        {users: { $elemMatch: { $eq:userId }}},
    ]
    }).populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name picture email",
    });
    
    if(isChat.length > 0){
        return res.send(isChat[0]);
    }
    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }

        try{

            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({_id: createdChat._id}).populate(
                "users","-password",
            )
             res.status(200).send(fullChat)
        }catch(err){
            return res.status(400).json({
                message: err.message
            })
            
        }

    }
})

const fetchChat = asyncHandler(async(req,res)=>{
    try{
        Chat.find({ users: {$elemMatch : {$eq: req.user._id }}})
        .populate("users", "-passsword")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async(results)=>{
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name picture email"
            });

           res.send(results);
        });
    }catch(error){
        return res.status(400).json({
            message: err.message
        })
    }
})

const createGroupChat = asyncHandler(async(req,res)=>{

    if(!req.body.users || !req.body.chatName) {
        return res.status(400).send({ message: "Please fill all the fields "});
    }

    var users = JSON.parse(req.body.users);

    if(users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName: req.body.chatName,
            users: users,
            isGroupChat:true,
            groupAdmin:req.user,
        })

        const fullgroupchat = await Chat.findOne({ _id: groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        return res.send(fullgroupchat)
    }catch(err){
        return res.status(400).send(err.message)
    }
})

const renameGroupName = asyncHandler(async(req,res)=>{
    const { chatId, chatName }= req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId,
        {
            chatName
        },
        {
            new:true,
        }).populate("users","-password")
        .populate("groupAdmin","-password");

        if(!updatedChat){
            return res.status(404).json({
                message:"Chat Not Found"
            });
         
        }else{
            return res.json(updatedChat);
        }
})

const addToGroup = asyncHandler(async(req,res)=>{
    const {chatId, userId } = req.body;

    const updatedChat  = await Chat.findByIdAndUpdate(chatId,
        {
            $push: {users: userId},
        },
        {
            new:true,
        }).populate("users","-password")
        .populate("groupAdmin","-password");

        if(!updatedChat){
            return res.status(404).json({
                message:"Chat Not Found"
            });
        }else {
            return res.send(updatedChat)
        }

})

const removeGroupMember = asyncHandler(async(req,res)=>{
    const { chatId, userId } = req.body;

    const removeUser = await Chat.findByIdAndUpdate(chatId,
        {
            $pull: { users: userId},
        },
        {
            new:true,
        }).populate("users", "-password")
        .populate("groupAdmin","-password");

        if(!removeUser){
            return res.status(404).json({
                message:"Chat Not Found"
            });
        }else {
            return res.send(removeUser);
        }
})
module.exports = { accessChat, fetchChat,createGroupChat, renameGroupName, addToGroup,removeGroupMember}