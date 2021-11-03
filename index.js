var express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , Strategy = require('passport-discord').Strategy
  , app      = express();
// Login
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ['identify'];
var prompt = 'consent'

passport.use(new Strategy({
    clientID: process.env.id,
    clientSecret: process.env.secret,
    callbackURL: process.env.url,
    scope: scopes,
    prompt: prompt
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/callback',
    passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { res.redirect('/') } // auth success
);
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/info', checkAuth, function(req, res) {
    //console.log(req.user)
    res.json(req.user);
});


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/callback")
}

// Routers
var home = require('./router/home.js');
app.use("/",home)
app.use(express.static(__dirname+"/public"))

// Connect to port
app.listen(80);