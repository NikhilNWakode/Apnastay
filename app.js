const express =  require("express");
const app = express();
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://localhost:27017/apnastay";
const session =  require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { validateListing, validateReview } = require('./schema.js');
const Listing = require("./models/listing");
const Review = require("./models/review.js");
const User = require("./models/user");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js")
const user = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { storage } = require('./cloudinary/index.js');



// Middleware to override HTTP methods for PUT and DELETE requests
app.use(methodOverride('_method'));

// Set up EJS as the template engine
app.engine('ejs', ejsMate); // Use ejsMate for layout support


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
 // for parsing form data

main().then(() => {
    console.log("Database connection established");
}).catch((err) => {
    console.error("Database connection error:", err);
})

async function main(){
    await mongoose.connect(process.env.MONGO_URL || MONGO_URL);
}

  const store = MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 60 * 60
    });
// Configure session for authentication locally in development
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}

  


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", (req,res) => {
    res.redirect("/listings");
})

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/", user);
app.use("/listings", listing);
app.use("/listings/:id/reviews", review);






// Handle 404 errors
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});


app.use((err, req, res, next) => {
    // Fallback values if missing
    const { statusCode = 500, message = "Something went wrong!" } = err;

    console.error("Error caught:", err);

    res.status(statusCode).render("listings/error", { err });
});

app.listen(8080, () =>{
    console.log("Server is running on port 8080");
})

