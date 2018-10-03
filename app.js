var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seed");
var Comment = require("./models/comment");



mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

/*
Campground.create(
  {
    name: "Granite Hill",
    image: "https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b014429df5c470a6edb5_340.jpg",
    description: "This is a huge Granite Hill"
  }, function(err, cg) {
    if(err) {
      console.log("Something went wrong while inserting data to db");
    } else {
      console.log("Successfully inserted : " + cg);
    }
  }
);
*/




app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, cg) {
    if(err) {
      console.log("Something went wrong while reading data from db");
    } else {
      res.render("campgrounds/index", {campgrounds: cg});
    }
  });

});

app.post("/campgrounds", function(req, res) {
  console.log(req.body);
  console.log("Name : " + req.body.name + ", " + "Image : " + req.body.image);
  var newCampObject = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
  };

  Campground.create(newCampObject, function(err, cg) {
    if(err) {
      console.log("Error while inserting new campground to database");
    } else {
      console.log("New campground created");
      console.log(cg);
    }
  });

  res.redirect("campgrounds/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, cg) {
    if(err) {
      console.log("Something went wrong while searching db for id " + req.params.id);
    } else {
      console.log(cg);
      res.render("campgrounds/show", {campgrounds: cg});
    }
  });
});


//================= COMMENT ROUTS

app.get("/campgrounds/:id/comments/new", function(req, res) {
  Campground.findById(req.params.id, function(err, tempObj) {
    if(err) {
      console.log("Error, couldn't find object with id " + req.params.id);
    } else {
      console.log("Found object for id " + req.params.id);
      console.log(tempObj);
      res.render("comments/new", {campgroundObj: tempObj});
    }
  });
});

app.post("/campgrounds/:id/comment", function(req, res) {
  console.log(req.params);
  Campground.findById(req.params.id, function(err, tempObj) {
    if(err) {
      console.log("Error");
      res.redirect("campgrounds/campgrounds");
    } else {
      console.log("===========");
      console.log(tempObj);
      console.log("===========");
      Comment.create(req.body.comment, function(err, tempComment) {
        if(err) {
          console.log("Couldn't save comment");
        } else {
          tempObj.comments.push(tempComment);
          tempObj.save();
          res.redirect("/campgrounds/" + tempObj._id);
        }
      });

    }
  });


});

app.listen(3000, function() {
  console.log("App started");
});
