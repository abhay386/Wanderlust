const express = require("express");
const router = express.Router();
// const user = require("../models/user.js");
const warpAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/user.js");

// Using Router;

router.route("/signup")
.get(userController.renderSignupForm)
.post(warpAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login);
// router.get("/signup",userController.renderSignupForm);


// router.post("/signup",warpAsync(userController.signup));

// router.get("/login",userController.renderLoginForm)

// Here we are using the middleware passport were we have given some values ;
// passport.authenticate => so it will aunthicate the user , "local"=> this is the strategy we  are using ; 
// failureRedirect:'/login  => if the auncthication fails then which page should we redirect on
// failureFlash:true => This means that if the authencation fails then we will be sending the failure message or flash message; if it's value will be false then the message would not appear;


// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login)


router.get("/logout",userController.logout)

module.exports = router;