var express = require('express');
var router = express.Router();
var loginCtrl= require('../controller/loginController');

router.get('',loginCtrl.index);
router.get('/signup',loginCtrl.kayit);
router.post('/',loginCtrl.indexPost);
router.post('/signup',loginCtrl.kayitPost);
module.exports = router;