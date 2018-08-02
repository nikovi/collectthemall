var express = require("express");
var router = express.Router({mergeParams: true});
var Figure = require("../models/figure");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Figure.findById(req.params.id, function(err, figure){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {figure: figure});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Figure.findById(req.params.id, function(err, figure){
        if(err){
            console.log(err);
            res.redirect("/figures");
        }else{
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Something went wrong");
                   console.log(err);
               }else{
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   figure.comments.push(comment);
                   figure.save();
                   req.flash("success", "Succesfully added comment");
                   res.redirect("/figures/"+figure._id);
               }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {figure_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/figures/" + req.params.id);
        }
    })
})

router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("/figures/" + req.params.id);
        }
    })
});

module.exports = router;