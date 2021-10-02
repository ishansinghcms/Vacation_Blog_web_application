const Campground =       require("../models/campground"),
      Comment =          require("../models/campground"),
      User =             require("../models/user");


let middlewareobj = {};

middlewareobj.checkCampgroundsOwnership = function(req , res, next)
{
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id , function(error , foundC)
        {
            if(error){res.render("back")}
            else
            {       
                if(foundC.author.id.equals(req.user._id))  
                {
                    next();
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
        res.redirect("back")
    }
}

middlewareobj.isLoggedIn = function(req , res , next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error" , "Please need to be logged in!");
    res.redirect("/login");
}

module.exports = middlewareobj;