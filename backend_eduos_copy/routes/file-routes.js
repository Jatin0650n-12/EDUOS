const express = require('express')
// const {User} = require('../models/authModel');
const {uploadFile,getAllFiles,downloadFile} = require('../controllers/file-controller')
// const authMiddleWare = require('../middlewares/auth-middleware');
const router = express.Router()


router.post('/upload', uploadFile);
router.get('/getfiles', getAllFiles);
router.get('/download/:id', downloadFile);


module.exports = router;


