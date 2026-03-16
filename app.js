// This condition checks the current environment (development or production).
// If we are NOT in production, then load variables from the .env file.
// Meaning: during development we read our secret keys from .env,
// but in production the server already has real environment variables set,
// so we don't load .env there.

if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
// const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const warpAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review= require("./models/review.js");
const listing = require("./Routes/listing2.js");
const reviews = require("./Routes/reviews2.js");
const User = require("./Routes/user2.js");
const session = require("express-session");
const MangoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const { default: MongoStore } = require('connect-mongo');
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

// Fallback secret used only if SECRET is not provided (not recommended for production)
const sessionSecret = process.env.SECRET || "change-this-in-production";

const store  =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: sessionSecret
    },

    touchafter: 24*3600,
})


store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};


    


app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.set("view engine", "ejs"); // Corrected view engine
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.engine('ejs', ejsMate);

// const Mongo_Url ='mongodb://127.0.0.1:27017/wanderlust';



async function main(){
    await mongoose.connect(dbUrl)
}
main()
.then(()=>{
    console.log("connection Succesful")
}).catch((err)=>{
    console.log("error found in the connection of db");
})

// flash messages; ensure locals exist before any route renders
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/",(req, res)=>{
//     res.send("root is working")
// })

// Demo user => aunthicating;
// app.get("/demo",async(req,res)=>{
//   let fakeUser = new user({
//     email:"fakeuser@gmail.com",
//     username:"supername",
//   })
//    let userRegister = await user.register(fakeUser, "helloworld");
//    res.send(userRegister);
// })


app.use("/listings",listing);
app.use("/listings/:id/reviews",reviews)
app.use("/",User);


// Test route;
// app.get("/testListing", async (req,res)=>{
//   let newListing = new Listing({
//     title: "My new Villa",
//     discription:"By the beach",
//     price:1200,
//     Location:"Calangute, Goa",
//     Country:"India"
//   });
//   await newListing.save();
//   console.log("sample data was saved");
//   res.send("Succesful testing")
// })


// custom error for route not match or undefined route;
// Express 5 with path-to-regexp v6: use a RegExp catch-all
// Using Express 5 (path-to-regexp v6): string catch-alls like "*" or "/(.*)" throw pathToRegexpError; use a RegExp (/.*/) catch-all instead.
app.all(/.*/,(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
})

// Error handling middleware;
app.use((err,req,res,next)=>{
    let {status= 500,message="Something went wrong"} = err;
    res.render("error.ejs" ,{message})
    // res.status(status).send(message)
    
})

app.listen(port,()=>{
    console.log("Server is litening on port =>", port)
});
