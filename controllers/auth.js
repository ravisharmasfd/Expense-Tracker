const User = require('../models/user.js')

const signup = async(req,res)=>{
    try {
        const {email,name,password} = req.body;
        const FindUser = await User.findOne({ where: { email } });

        if(FindUser){

            res.status(400).json({message: 'Email already exists'});
        }else{
            // Create new user record


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
const signin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        console.log("🚀 ~ file: auth.js:36 ~ signin ~ em̥ail:", email)

        
        const FindUser = await User.findOne({ where: { email } });

        if(FindUser){
            if(FindUser.password === password){
                // Send success response
                res.status(200).json({ message: 'Sign in Successfully', user : FindUser});
            }else{
                    res.status(401).json({message:"Check your password"})
            }
        }else{
            // Send error response
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        // Send error response
        res.status(500).json({ message: "Server error" });
        console.log(error);


        
      }
}
module.exports = {
    signup,
    signin
}