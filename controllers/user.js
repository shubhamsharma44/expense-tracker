const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.signup = async (req,res ) => {

    try{
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);  //blowfish 
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(200).json({newUser,message:"Succesfully created user"});
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' })
    };
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.params;

        const user = await User.findOne({email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const comparedPassword = await bcrypt.compare(password, user.password);

        if (comparedPassword) {
            const token = generateToken(user.id, user.name);
            return res.status(200).json({ success: true, message: 'User logged in successfully', token });
        } else {
            return res.status(401).json({ success: false, message: 'User not authorized' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


function generateToken(id,name){
    return jwt.sign({userId:id , name: name} , process.env.JWT_SECRET);
}