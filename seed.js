var mongoose = require("mongoose");
var Cg = require("./models/campground");
var Comment = require("./models/comment");

var campgrounds = [
  {
    name: "Salmon Creek",
    image: "https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104496f8c47caeecb5b8_340.jpg",
    description: "blah blah blah"
  },
  {
    name: "Granite Hill",
    image: "https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b014429df5c470a6edb5_340.jpg",
    description: "blah blah blah"
  },
  {
    name: "Mountain Goat's Rest",
    image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f8c47caeecb5b8_340.jpg",
    description: "blah blah blah"
  }
];

function seedDB() {
  Cg.remove({}, function(err) {
    if(err) {
      console.log("Error while cleaning data");
    } else {
      console.log("Successfully cleaned the data");

      campgrounds.forEach(function(tempObj) {
        Cg.create(tempObj, function(err, mcg) {
          console.log("Crated " + mcg);

          Comment.create(
            {
              text: "This is a great place",
              author: "Vishu"
            }, function(err, newComment) {
              if(err) {
                console.log("Error while creating comment");
              } else {
                mcg.comments.push(newComment);
                mcg.save();
              }
          });

        });
      });
    }
  });
}

module.exports = seedDB;
