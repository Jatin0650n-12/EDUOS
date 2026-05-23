const mongoose = require('mongoose')
const {User} = require('../models/authModel')
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
require('dotenv').config()



const register = async (req, res) => {
    const { email, name, password, phone, role , username } = req.body;

    try {
        // Check if user already exists by username or email
        
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: 'Please change the username or email. It is already in use.'
            });
        }

        // Validate required fields
        if (!username || !email || !password || !name || !phone || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields (username, email, password, name, phone , role) are required.'
            });
        }

        //hashing password of the user
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);


        // Create new user
        const newUser = await User.create({ username, email, password : hashedPass, name, phone  , role});

        return res.status(201).json({
            success: true,
            message: 'Acount Created successfully',
            data: newUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userexists = await User.findOne({ username });

        if (!userexists) {
            return res.status(404).json({
                success: false,
                message: `User with ${username} does not exist`
            });
        }

        const checkPass = await bcrypt.compare(password, userexists.password);

        if (checkPass) {
             const accessToken = jwt.sign({
                userId : userexists._id,
                username : userexists.username,
                role : userexists.role

             } , process.env.JWT_SECRET_KEY , {
                expiresIn : '60m'
             })
            return res.status(200).json({
                success: true,
                message: 'logged in',
                data : accessToken
            });
        }

        res.status(400).json({
            success: false,
            message: 'Invalid password'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const decodeToken = async(req,res)=>{
    //const authHeader = req.header['authorization'];
    const token = req.headers['authorization'];


    if(!token){
        return res.status(401).json({
            success : false,
            message : 'Token Invalid'
        })
    }

    try{
        const decodeTok = jwt.verify(token,process.env.JWT_SECRET_KEY);
        return res.status(200).json({
            success : true,
            message : 'Token decoded successfully',
            data : decodeTok
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : 'Something went wrong'
        })
    }
}

const changePass = async(req,res)=>{
    const {oldPass , newPass} = req.body;

    if(!oldPass || !newPass){
        return res.status(404).json({
            success : false,
            message : 'Missing Old or New Password'
        });
    }

    const userId = req.userInfo.userId;
    const findUser = await User.findById(userId);

    if(!findUser){
        return res.status(404).json({
            success : false,
            message : 'User not found'
        })
    }

    

    const salt = await bcrypt.genSalt(10);
    //const hashedPass = await bcrypt.hash(oldPass,salt);
    const hashedPass1 = await bcrypt.hash(newPass,salt);
    const checkOldPass = await bcrypt.compare(oldPass , findUser.password);

    if(!checkOldPass){
        return res.status(400).json({
            success : true,
            message : 'Old password is not correct'
        })
    }

    findUser.password = hashedPass1;
    await findUser.save();

    res.status(200).json({
        success : true,
        message : 'Password changed successfully'
    })

}

module.exports = {register , login , decodeToken,changePass}