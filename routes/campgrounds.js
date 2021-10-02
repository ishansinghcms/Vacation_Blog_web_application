const express =          require("express"),
      router =           express.Router(),
      Campground =       require("../models/campground"),
      Comment =          require("../models/comment"),
      middleWare =       require("../middleware");

//INDEX route
router.get("/" , function(req , res)
{
        Campground.find({} , function(error , all_campgrounds)
        {
                if(error)
                {
                console.log(error);
                }
                else
                {
                res.render("campgrounds/index" , {cg1: all_campgrounds});
                }
        });
});

//NEW route
router.get("/new" , middleWare.isLoggedIn , function(req , res)
{
        res.render("campgrounds/new");
})

//CREATE route
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
        let obj = {name: n , image : i , description: desc , author: aut}

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
})

//SHOW route
router.get("/:id" , function(req , res)
{
        Campground.findById(req.params.id).populate("comments").exec(function(error , foundcampground)
        {
                if(error)
                {
                console.log(error);
                }
                else
                {
                res.render("campgrounds/show" , {d: foundcampground});
                }
        });
})

//EDIT campground
router.get("/:id/edit" , middleWare.checkCampgroundsOwnership , function(req , res)
{
        Campground.findById(req.params.id , function(error , foundC)
        {
                res.render("campgrounds/edit" , {foundCC: foundC});         
        });
});

//UPDATE campground
router.put("/:id" , middleWare.checkCampgroundsOwnership , function(req , res)
{
        Campground.findByIdAndUpdate(req.params.id , req.body.c , function(error , updated)
        {
                if(error)
                {
                        res.redirect("/campgrounds")
                }
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