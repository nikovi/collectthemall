var express = require("express");
var router = express.Router();
var Figure = require("../models/figure");
var middleware = require("../middleware");

router.get("/", function(req, res){
    Figure.find({}, function(err, allFigures){
       if(err){
           console.log(err);
       } else {
          res.render("figures/index",{figures: allFigures, page: "figures"});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newFigure = {name: name, price: price, image: image, description: desc, author: author};
    
    Figure.create(newFigure, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/figures");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("figures/new");
});

router.get("/:id", function (req, res){
    Figure.findById(req.params.id).populate("comments").exec(function (err, foundFigure){
        if(err){
            console.log(err);
        }else{
            if (!foundFigure) {
                return res.status(400).send("Item not found.");
            }
            res.render("figures/show", {figure: foundFigure});
        }
    });
});
 
router.get("/:id/edit", middleware.checkFigureOwnership, function (req, res) {
    Figure.findById(req.params.id, function (err, foundFigure) {
        if (!foundFigure) {
            return res.status(400).send("Item not found.");
        }
        res.render("figures/edit", {figure: foundFigure});
    });
});
    

router.put("/:id", middleware.checkFigureOwnership , function(req,res){
    Figure.findByIdAndUpdate(req.params.id, req.body.figure, function(err, updatedFigure){
        if(err){
            res.redirect("/figures");
        } else {
            res.redirect("/figures/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkFigureOwnership, function(req, res){
   Figure.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/figures");
       }else{
           res.redirect("/figures");
       }
   });
});

module.exports = router;