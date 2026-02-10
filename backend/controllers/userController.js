const User = require('../models/User');

const getAllUsers = async (req,res) => {
    try{
        const users = await User.find({}, null, {lean : true});
        return res.status(200).json(users);
    } catch(err){
        console.error("Error fetching users", err);
        return res.status(500).json({error:"Server Error"});
    }
}

module.exports = {getAllUsers};