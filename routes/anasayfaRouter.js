var express = require('express');
var router = express.Router();
var ctrlAnasayfa = require('../controller/anasayfaController');

router.get('/',ctrlAnasayfa.index);

module.exports = router;