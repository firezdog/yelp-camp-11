var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    flash = require('connect-flash'),
    methodOverride = require('method-override');

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

// change this
mongoose.connect(`mongodb://root:root1234@ds225294.mlab.com:25294/yelp_camp`);

app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

seedDB();

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "dasnichtsselbstnichtet",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MAKE USER AVAILABLE TO ALL ROUTES
app.use((req, res, next) => { 
    res.locals.user = req.user;
    res.locals.problem = req.flash('problem');
    res.locals.greeting = req.flash('greeting');
    next();
});

//REQUIRE ROUTES
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 8000, process.env.IP, function() {
    console.log("YelpCamp Server has started on port 8000.");
});