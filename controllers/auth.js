const User = require('../models/user.js')

const signup = async(req,res)=>{
    try {
        const FindUser = await User.findOne({ where: { email: req.body.email } });
        console.log(FindUser)
        if(FindUser){
            res.status(400).json({message: 'Email already exists'});
        }else{
            // Create new user record
            const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            });
        
            // Send success response
            res.status(200).json({ message: 'User created successfully!' });
        }
    } catch (error) {
        // Send error response
        res.status(500).json({ message: "Server error" });

        
      }
}
module.exports = {
    signup
}