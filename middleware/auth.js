const User = require('../models/user.js')
const jwt = require('jsonwebtoken');
User

const authMiddleWare = async(req,res,next)=>{
    const {authorization} = req.headers;
    if(authorization){
        try {
            const authorHead = authorization.split(" ");
            if(authorHead[0] !== 'Bearer'){
                res.status(401).json({msg:"You are not authorize"});
                return;
            }
            const token = authorHead[1];
            const {userId} = await jwt.verify(token,"shhhhh");
            const user = await User.findOne({where:{id:userId}});
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({msg:"You are not authorize"});
        }
    }else{
        res.status(401).json({msg:"You are not authorize"})
    }
}
module.exports = authMiddleWare;