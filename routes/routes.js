

module.exports = function(app,  passport) {
    app.get('/',function(req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});

    });

    app.get('/signup', function(req, res) {

        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true// allow flash messages
    }));
    app.get('/anasayfa', function(req, res) {

        if(req.session.email) {

            res.render('ChatPage.ejs', {

                user : req.user // get the user out of session and pass to template
            });
            console.log("user : " + req.user);
        } else {
            res.write('<h1>Please login first.</h1>');
            res.end('<a href="/">Login</a>');
        }

    });
    //Farklı porta yönlendirme yapabilmek için önce gelen her isteği karşılayacak bir isteğin yönlendirildiği bir kod yazılıyor.
    //Devamında gelen parametreye göre sayfa yönlendirmeleri yapılıyor.

    app.get('*', isLoggedIn, function(req, res) {

        var gelenIstek = (req.url).slice(1,8);

        if(gelenIstek === 'goruntu')
        {
            console.log("görüntü geldi");

            res.render('One-to-One.ejs');
        }
        else if(gelenIstek === "confere")
        {
            res.render('Video_Conference.ejs');
        }

    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/',function (req,res) {
        const User   = require('../models/kullanici');
        User.findOne({ email: req.body.email},(err,data)=>{
            if(err)
                console.log(err);
            else
            {
                if(data != null){

                    module.exports.posta = data.email;

                    req.session.email = req.body.email;
                    console.log("session : " + req.session.email);
                    if(req.body.email ===data.email) {
                        console.log("Başarılı");

                        res.render('ChatPage.ejs', {

                            user : data // get the user out of session and pass to template
                        });
                    }
                    else {
                        console.log("Başarısız");
                        //res.write("<html><body>alert('Yanlış kullanıcı Adı ya da parola');</body></html>");

                        res.render('login.ejs');
                        // res.end();
                    }


                }
                else{
                    console.log("yok");
					alert("Böyle bir şey yohhk");
                }

            }

        });


    });




};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
    {

        return next();

    }
    console.log("req.url : " + req.url);
    // if they aren't redirect them to the home page

    var gelenIstek = (req.url).slice(1,8);

    if(gelenIstek === 'goruntu')
    {
        console.log("görüntü geldi");

        res.render('One-to-One.ejs');
    }
    else if(gelenIstek === "confere")
    {
        res.render('Video_Conference.ejs');
    }
    else
        res.redirect('/');



    //res.redirect('/');
    //console.log("req.header : " + req.headers.referer);
}
function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({nope: true});
    } else {
        next();
    }
}


