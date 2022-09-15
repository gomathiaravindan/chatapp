const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req,res,next) =>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        try{

            token = req.headers.authorization.split(" ")[1];

            console.log("token",token);
            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded)
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }catch(err){

            return res.status(401).json({
                error:"Not authorized, token failed"
            });
        }
    }
    if(!token){
        return res.status(401).json({
            error:"Not authorized, no token"
        });
        
    }
})

module.exports = { protect }