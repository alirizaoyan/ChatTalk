
var Kullanici = require('../models/kullanici');



module.exports.index= function (req,res) {
    res.render('login');
}
module.exports.indexPost= function (req,res) {



        //Kullanici.find({"kullaniciAdi": req.body.kullaniciAdi})

        Kullanici.find(function (err,docs) {
            for(var i =0; i<docs.length;i++) {

                if(req.body.sifre=== docs[i].sifre && req.body.kullaniciAdi === docs[i].kullaniciAdi)
                {

                    res.render('ChatPage');

                }
                else
                {

                   //res.render('login');
                    res.send(500,"Kullanıcı Adı ya da parola hatalı");
                }
            }
            
        });

}
module.exports.kayit = function (req,res) {
    res.render('sign-up');
}
module.exports.kayitPost = function (req,res) {
    var yeniKullanici = new Kullanici(
        {
            kullaniciAdi: req.body.kullaniciAdi,
            sifre: req.body.sifre
        }
    );

    yeniKullanici.save(function (err) {
        
    });
    res.render('sign-up');
}