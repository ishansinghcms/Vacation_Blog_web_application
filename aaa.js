const   express =                require("express"),
        app =                    express(),
        bodyParser =             require("body-parser"),
        mongoose =               require("mongoose"), 
        flash =                  require("connect-flash"),
        passport =               require("passport"),
        LocalStragedy =          require("passport-local"),
        Campground =             require("./models/campground"), 
        methodOverride =         require("method-override"), 
        Comment =                require("./models/comment")
        User =                   require("./models/user"),
        seedDB =                 require("./seeds"),
        //requiring routes files
        commentRoutes =           require("./routes/comments"),
        campgroundRoutes =       require("./routes/campgrounds"),
        indexRoutes =             require("./routes/index")

//APP config
//=====================================================
mongoose.connect("mongodb://localhost/yelp_camp"); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
 seedDB();

// PASSPORT config
//=====================================================
app.use(require("express-session")(
{
        secret: "abc",
        resave: false,
        saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStragedy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========================================================"COMMON TEMPLATE"=====================================================================================
app.use(function(req , res , next)  // whatever function we provide in "app.use" is called in every route
{       //middleware that is called on every route.
        res.locals.currentUser = req.user;  //  #### to pass currentUser=req.user to every route i.e. "res.locals" passes anything to every route in the file.
                                            // req.user will give the user data from I guess user.js
        res.locals.message1 = req.flash("error"); // "error" can be any name
        res.locals.message2 = req.flash("success"); // "success" can be any name
        next();  //to move on to the next code in every route.
})
//==============================================================================================================================================================

//=====================================================
app.use("/" , indexRoutes);
app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);
//=====================================================

app.listen(4000);