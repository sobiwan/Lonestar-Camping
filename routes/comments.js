var express = require("express"),
    router = express.Router({mergeParams:true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");
    
//================
//COMMENTS ROUTES
//================

//Comments New

router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

//Comments Create

router.post("/", middleware.isLoggedIn, function(req,res){
   //look up campground using ID
   Campground.findById(req.params.id, function(err, campground) {
       if (err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
    //create new comment
            Comment.create(req.body.comment, function(err,comment){
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log (err);

                } else {
            //add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
            //save comment
                    comment.save();
            //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
            //redicrect to campground show page
                    req.flash("success", "You've made a mark on the world! Comment Added.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
       }
   });
});

// EDIT Route - COMMENTS

router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req,res){
   Comment.findById(req.params.comment_id, function(err, foundComment) {
       if(err){
           res.redirect("back");
       } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
   })
});

//UPDATE Route - COMMENTS

router.put("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
        } else {
           res.redirect("/campgrounds/"+ req.params.id);
        }
   }); 
});

//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
        } else {
           req.flash("success", "Comment Deleted!")
           res.redirect("/campgrounds/"+ req.params.id);
        }   
    });
});

module.exports = router;