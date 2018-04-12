//ALL THE MIDDLEWARE GOES IN HERE
var middlewareObj = {},
    Campground = require("../models/campground"),
    Comment = require("../models/comment");
    
middlewareObj.checkCampgroundOwner = function (req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
               req.flash('error', 'Sorry, that campground does not exist!');
               res.redirect("back");
            } else {
            //does user own the Campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You Shall Not Pass!... Sorry you don't have permission to do that.");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "Indentify Yourself! ... please login.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwner = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
               req.flash('error', 'Sorry, that comment does not exist!');
               res.redirect("back");
            } else {
            //does user own the Comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You Shall Not Pass!... Sorry you don't have permission to do that.");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "Indentify Yourself! ... please login.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Indentify Yourself! ... please login.")
    res.redirect("/login");
};

module.exports = middlewareObj;