const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.createUser)); 

router.get("/login", userController.renderLoginForm,)

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), userController.loginUser);

router.get("/logout", userController.logoutUser);

module.exports = router;