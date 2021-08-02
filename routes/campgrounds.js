const express =          require("express"),
      router =           express.Router(),
      Campground =       require("../models/campground"),
      Comment =          require("../models/comment"),
      middleWare =       require("../middleware");  //####iif we require a directory, it will automatically require the contents the contents of index.js i.e., file named as "index.js" acts as a the main file and is automatically. 
      
//INDEX route -- show all campgrounds
router.get("/" , function(req , res)
{
        Campground.find({} , function(error , all_campgrounds)
        { //##  // {} means all campgrounds in the collection.
                if(error)
                {
                console.log(error);
                }
                else
                {
                res.render("campgrounds/index" , {cg1: all_campgrounds});
                }
        });
// res.render("campgrounds" , {cg1:cg});
});


//NEW route -- show form to create new campground
router.get("/new" , middleWare.isLoggedIn , function(req , res)
{
        res.render("campgrounds/new");
})


//CREATE route -- add new route to db
router.post("/" , middleWare.isLoggedIn , function(req , res)
{
        let n = req.body.name;
        let i =  req.body.img;
        let desc =  req.body.des;
        let aut =
        {
            id: req.user._id,
            username: req.user.username     
        }
        let obj = {name: n , image : i , description: desc , author: aut}  //######
        //## create a new campground and save it to db.
        Campground.create(obj , function(error , newlycreated)  
        { 
                if(error)
                {
                console.log(error);
                }
                else
                {
                res.redirect("/campgrounds");  
                }
        });

        // cg.push(obj);
        // res.redirect("/campgrounds");
})


//SHOW route -- shows more info about one campground.
router.get("/:id" , function(req , res)
{
        //find the campground with provided ID
        // element id will be equal to req.params.id
        Campground.findById(req.params.id).populate("comments").exec(function(error , foundcampground)  //##
        {
                if(error)
                {
                console.log(error);
                }
                else
                {
                //render show template with that campground
                res.render("campgrounds/show" , {d: foundcampground});
                }
        });
        
})

//EDIT campground
router.get("/:id/edit" , middleWare.checkCampgroundsOwnership , function(req , res)
{
        // is user logged in?
        // if not, redirect
        Campground.findById(req.params.id , function(error , foundC)
        {
                // does user own the campground--otherwise redirect
                // foundC.author.id is an object whereas req.user._is is a string. whule displaying in the terminal they look equal, but they are not.
                // so instead of "===" we use ."equals()"               
                res.render("campgrounds/edit" , {foundCC: foundC});         
        });
});

//UPDATE campground
router.put("/:id" , middleWare.checkCampgroundsOwnership , function(req , res)
{
        //finding and updating in one line.
        Campground.findByIdAndUpdate(req.params.id , req.body.c , function(error , updated)  //format (ID_that_we_are_looking_for , updated_data , callback_function)
        {
                if(error){res.redirect("/campgrounds")}
                else
                {
                        res.redirect("/campgrounds/" + req.params.id);
                }
        })
})

//DESTROY campground
router.delete("/:id" , middleWare.checkCampgroundsOwnership , function(req , res)
{               
        Campground.findByIdAndRemove(req.params.id , function(error)
        {
                if(error){res.redirect("/campgrounds")}
                else{res.redirect("/campgrounds")}
        })
})

module.exports = router;