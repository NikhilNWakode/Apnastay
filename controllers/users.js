const User = require("../models/user");


module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signup");
}

module.exports.createUser = async(req, res, next) => {
    try{
        let {username, password, email} = req.body;
    const newUser = new User({username, email});
    const registeredUser =await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) =>{
        if(err) return next(err);
        req.flash("success","Welcome to ApnaStay!");
        res.redirect("/listings");

    })
    

    }catch(error){
        console.log(error);
        req.flash("failure", error.message);
        res.redirect("/signup");
    }
    
}


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.loginUser = async (req, res) =>{
    req.flash("success","Welcome Back to ApnaStay!");
    res.redirect(res.locals.redirectUrl || "/listings");

}

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}