const express =          require("express"),
      router =           express.Router({mergeParams: true}),  //#### express router //## app-->router
                                                               // mergeParams will merge the params from campgrounds and comments together. 
      Campground =       require("../models/campground"),
      Comment =          require("../models/comment"),
      middleWare =       require("../middleware");  //####iif we require a directory, it will automatically require the contents the contents of index.js i.e., file named as "index.js" acts as a the main file and is automatically. 

//NEW route
router.get("/new" , middleWare.isLoggedIn , function(req , res)
{
        Campground.findById(req.params.id , function(error , campground)
        {
                if(error){console.log(error);}
                else
                {
                        res.render("comments/new" , {cc: campground})
                }
        })
})

//CREATE route
router.post("/" , middleWare.isLoggedIn , function(req , res)
{
        Campground.findById(req.params.id , function(error , campgroundXX)
        {
                if(error){res.redirect("/campgrounds");}
                else
                {
                        Comment.create(req.body.commentX , function(error , comment)
                        {
                                if(error)
                                {
                                        req.flash("error" , "Something went wrong")
                                        console.log(error);
                                }
                                else
                                {
                                        //=========================================================================
                                        //##add current user's username and id to comment before pushing
                                        comment.author.id = req.user._id;  // user is the current logged in user 
                                        comment.author.username = req.user.username;
                                        //##save comment
                                        comment.save();
                                        //=========================================================================
                                        campgroundXX.comments.push(comment);
                                        campgroundXX.save();
                                        req.flash("success" , "Successfully created comment!")
                                        res.redirect("/campgrounds/" + campgroundXX._id)
                                }
                        })
                }
        })
        
        
})

//COMMENTS EDIT
router.get("/:comment_id/edit" , checkCommentsOwnership , function(req , res)
{
        Comment.findById(req.params.comment_id , function(error , foundcomment)
        {
                if(error){res.redirect("back")}
                else
                {
                        res.render("comments/edit" , {campID: req.params.id , commentXX: foundcomment}) // we dont have to find the campground id because we already have it in the url (refer to aaa.js page) 
                }
        })
});

//COMMENTS UPDATE
router.put("/:comment_id" , checkCommentsOwnership , function(req , res)
{
        Comment.findByIdAndUpdate(req.params.comment_id , req.body.commentX , function(error , updatedComment)  //format (ID_that_we_are_looking_for , updated_data , callback_function)
        {
                if(error){res.redirect("back")}
                else
                {
                        res.redirect("/campgrounds/" + req.params.id);
                }
        })
})

//COMMENTS DESTROY
router.delete("/:comment_id" , checkCommentsOwnership , function(req , res)
{
        Comment.findByIdAndRemove(req.params.comment_id , function(error)
        {
                if(error){res.redirect("back")}
                else
                {
                        req.flash("success" , "Comment deleted!")
                        res.redirect("/campgrounds/" + req.params.id)
                }
        })
})

function checkCommentsOwnership(req , res, next)
{
    if(req.isAuthenticated())// Is user logged in?
    {
        Comment.findById(req.params.comment_id , function(err , foundComment)
        {
            if(err)
            {
                req.flash("error" , "Campground not found");
                res.redirect("back")
            }
            else
            {   // does user own the comment--otherwise redirect
                // foundComment.author.id is an object whereas req.user._is is a string. whule displaying in the terminal they look equal, but they are not.
                // so instead of "===" we use ."equals()"
                
                if(foundComment.author.id.equals(req.user._id))  // Is it the tha same user who created the campground?
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

module.exports = router;