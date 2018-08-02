var Figure = require("../models/figure");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkFigureOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Figure.findById(req.params.id, function(err, foundFigure){
           if(err){
               req.flash("error", "Figure not found");
               res.redirect("back");
           }else{
            if(!foundFigure) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
            if(foundFigure.author.id.equals(req.user._id)) {
                next();
            }else{
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentsOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                } 
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;