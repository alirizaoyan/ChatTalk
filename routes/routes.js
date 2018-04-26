// app/routes.js

module.exports = function(app,  passport) {


app.use(ignoreFavicon);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================


    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form


    app.get('/', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    app.get('/chat', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('chat.ejs');
    });
    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
   app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    app.get('/anasayfa', isLoggedIn, function(req, res) {

        res.render('ChatPage.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // process the login form
    app.post('/', passport.authenticate('local-login', {
        successRedirect : '/anasayfa', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    //Farklı porta yönlendirme yapabilmek için önce gelen her isteği karşılayacak bir isteğin yönlendirildiği bir kod yazılıyor.
    //Devamında gelen parametreye göre sayfa yönlendirmeleri yapılıyor.

    app.get('*', isLoggedIn, function(req, res) {

        var gelenIstek = (req.url).slice(1,8);

        if(gelenIstek === 'goruntu')
        {

            res.render('One-to-One.ejs');
        }
        else if(gelenIstek === "confere")
        {
            res.render('Video_Conference.ejs');
        }

    });


};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();


    // if they aren't redirect them to the home page
    res.redirect('/');
}
function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({nope: true});
    } else {
        next();
    }
}

