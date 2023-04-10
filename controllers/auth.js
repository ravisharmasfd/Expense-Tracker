const User = require('../models/user.js')

const signup = async(req,res)=>{
    try {
        const {email,name,password} = req.body;
        console.log(1);
        const FindUser = await User.findOne({ where: { email } });
        console.log(1);
        console.log(FindUser);

        if(FindUser){
            console.log(3);

            res.status(400).json({message: 'Email already exists'});
        }else{
            // Create new user record
            console.log(4);

            const user = await User.create({
            email,
            password,
            name,
            });
        
            // Send success response
            res.status(200).json({ message: 'User created successfully!' });
        }
    } catch (error) {
        // Send error response
        res.status(500).json({ message: "Server error" });
        console.log(error);


        
      }
}
module.exports = {
    signup
}