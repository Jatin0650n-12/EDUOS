const express = require('express')
const {User} = require('../models/authModel');
const {register , login , decodeToken,changePass} = require('../controllers/auth-controller')
const authMiddleWare = require('../middlewares/auth-middleware');
const router = express.Router()


router.post('/register',register);
router.post('/login',login);
router.get('/tokenVal' , decodeToken);
router.post('/changePass',authMiddleWare, changePass);


module.exports = router;


