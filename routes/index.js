var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


//Landing Page
router.get("/", function(req,res){
   res.render("landing"); 
});

//====================
//AUTHENTICATION ROUTES
//====================

//REGISTER ROUTES

//Renddr Sign Up Form
router.get("/register", function(req, res) {
    res.render("register");
})



//Sign Up Logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            req.flash("error", err.message);
            console.log(err)
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Hello " + user.username +", Welcome Welcome Welcome!")    
                res.redirect("/campgrounds");
            });
        }
    });
});

//LOGIN/OUT ROUTES

//Renddr Login Form
router.get("/login", function(req, res) {
   res.render("login") 
});

//Login Logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

//Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Huh? Do you have something better to do?! ... You are now logged out");
    res.redirect("/campgrounds");
})

module.exports = router;
