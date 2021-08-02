const Campground =       require("../models/campground"),
      Comment =          require("../models/campground"),
      User =             require("../models/user");


let middlewareobj = {};

middlewareobj.checkCampgroundsOwnership = function(req , res, next)
{
    if(req.isAuthenticated())// Is user logged in?
    {
        Campground.findById(req.params.id , function(error , foundC)
        {
            if(error){res.render("back")}
            else
        {       // does user own the campground--otherwise redirect
                // foundC.author.id is an object whereas req.user._is is a string. whule displaying in the terminal they look equal, but they are not.
                // so instead of "===" we use ."equals()"
                if(foundC.author.id.equals(req.user._id))  // Is it the tha same user who created the campground?
                {
                    next(); // continue to compile the next code in the route.
                }
                else
                {
                    req.flash("error" , "Permission denied")
                    res.redirect("back");
                }
            }
        })
    }
    else
    {
        req.flash("error" , "You need to be logged in!")
        res.redirect("back")  //## this will take the user back to the previous page.
    }
}

middlewareobj.isLoggedIn = function(req , res , next)  //also used in this file
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error" , "Please need to be logged in!"); // connected to aaa.js
    res.redirect("/login");
}

module.exports = middlewareobj;