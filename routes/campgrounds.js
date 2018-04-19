var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");


//=================
//CAMPGROUND ROUTES
//=================

//INDEX - show all campgrounds
router.get("/", function(req,res){
    //Get all campground form DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user, page:'campgrounds'});   
        }
    })
});

//NEW - show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new")
    
});

//CREATE
router.post ("/", middleware.isLoggedIn, function(req,res){
    //get data from form and add to array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
            id: req.user._id,
            username: req.user.username
        };
    var newCampground = {name: name, image:image, price:price, description:desc, author: author};
    //Create a new Campgroudna and save to Database ... if save redirect
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    })
});

//SHOW
router.get("/:id", function(req,res){
    //find campground with ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        } else {
            //show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});


//UPDATE Campground Route
router.put("/:id", middleware.checkCampgroundOwner, function(req,res){
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campground");
        } else {
           res.redirect("/campgrounds/"+ req.params.id);
        }
   });
});

//DESTROY Campground Route
router.delete("/:id", middleware.checkCampgroundOwner, function(req,res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
        } else {
           req.flash("success", "Campground Deleted!")
           res.redirect("/campgrounds");
        }   
    });
});



module.exports = router;
