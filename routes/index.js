var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Campground = require('../models/campgrounds');
var _ = require ('underscore')

//LANDING
router.get("/", function(req, res) {
    Campground.find({}, {image: 1}, (err, campgrounds) => {
        if(err) {
            req.flash('problem', 'Problem getting campgrounds.')
        } else {
            random_camps = _.sample(campgrounds, 5);
            res.render("landing", {campgrounds: _.sample(campgrounds, 5)});
        }
    });
});

//REGISTER
router.get("/register", function(req, res){
    res.render("login/register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            return res.render('login/register', {err: err});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash('greeting', `Registration successful. Welcome to Yelp Camp, ${user.username}!`);
            res.redirect("/campgrounds");
        });
    });
});


//LOGIN
router.get("/login", function(req, res){
    res.render("login/login", {error: req.flash("error")});
});

//AUTHENTICATE LOGIN
router.post(
    "/login", 
    passport.authenticate("local", 
    {
        failureRedirect: "/login",
        failureFlash: true
    }),
    function(req, res){
        req.flash('greeting',`Welcome back, ${req.user.username}!`);
        if (!req.session.whence) {
            res.redirect('/campgrounds');
        } else {
            var whence = req.session.whence;
            req.session.whence = "";
            res.redirect(whence);
        }
});
    
//LOGOUT
    
router.get("/logout", function(req,res){
    req.logout();
    req.flash('greeting','Thank you, come again!');
    res.redirect("/");
});

module.exports = router;