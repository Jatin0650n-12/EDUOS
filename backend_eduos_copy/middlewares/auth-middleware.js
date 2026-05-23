require('dotenv').config()
const jwt = require('jsonwebtoken')

const authMiddleWare = async(req , res , next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    try{
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET_KEY)
        req.userInfo = decodedToken;
        next();
    }catch(e){
        return res.status(404).json({
            success : false,
            message : 'either token missing or invalid'
        });
    }
    // next();
}

module.exports = authMiddleWare