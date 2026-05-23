const mongoose = require('mongoose')

const registerUser = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    }, 
    phone : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['user' , 'admin'],
        default : 'user'
    }
} , {timestamps : true})


const User = mongoose.model('users', registerUser);
module.exports = {User}