const asyncHandler = require('express-async-handler');
const User= require("../models/userModel")
const {generateToken} = require("../config/generateToken")
const registerUser = asyncHandler(async(req,res) =>{
   const {name,email,password,picture}= req.body;

   if(!name || !email || !password) {
      return res.status(400);
       //throw new Error("Please enter all the fields");
   }

   const userExists = await User.findOne({email});
   if(userExists){
    return res.status(400).json({
        error:"User already exists"
    });
    
   }

   const user = await User.create({
       name,email,password,picture
   });

   if(user){
      return res.status(201).json({
           _id: user._id,
           name: user.name,
           email:user.email,
           picture:user.picture,
           token: generateToken(user._id)
       })
   }else{
    return res.status(400).json({
        error:"User creation failed"
    })     
   }
});

const authUser = asyncHandler(async(req,res)=>{

    const { email,password } = req.body;

    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))) {
         
        return res.status(201).json({
             _id: user._id,
             name: user.name,
             email: user.email,
             picture: user.picture,
             token: generateToken(user._id)
         })
        //return res.send(user);
    }
    else{
        return res.status(400).json({
            error:"Invalid Email or Password"
        })
    }

})

// format - /api/user?search=gomathi
const allUsers = asyncHandler(async(req,res) =>{

    const keyword = req.query.search ? {
         $or: [
             { name: {$regex: req.query.search, $options: "i"}},
             { email: {$regex:req.query.search, $options: "i"}},
         ]
     }: {};

const users = await User.find(keyword).find({ _id: { $ne: req.user._id }});
return res.send(users);
});

module.exports = {registerUser, authUser, allUsers}