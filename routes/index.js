const express =          require("express"),
      router =           express.Router(), //#### express router  //## app-->router
      passport =         require("passport"),
      User = require("../models/user");

router.get("/" , function(req , res)
{     
        res.render("landing")
})

// show register form
router.get("/register" , function(req , res)
{
        res.render("register");
})

//handle sign up logic
// no middleware --- because we first have to create a new user and then authenticate.
router.post("/register" , function(req , res)  // 
{       
        let newuser = new User({username: req.body.username});
        User.register(newuser , req.body.password , function(error , user)
        {
                if(error)
                {
                        req.flash("error" , error.message) //error is in-built 
                        res.render("register");   // with return there is no need of else statement
                }
                else
                {
                        passport.authenticate("local")(req , res , function()
                        {
                                req.flash("success" , "Welcome to our Vacation Blog: " + user.username)
                                res.redirect("/campgrounds");
                        })
                }
                
        })
})

// show login form
router.get("/login" , function(req , res)
{
        res.render("login");
})

//handling login logic
//middleware ---- because user is presumed to exist already so we just have to authenticate
router.post("/login" , passport.authenticate("local" , 
{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
}) ,  function(req , res)
      {
        //this callback function is not responsible for anything. If we want we can remove it.
      });

router.get("/logout" , function(req , res) 
{
        req.logout();   
        req.flash("success" , "Logged you out!")
        res.redirect("/campgrounds");
})

module.exports = router;