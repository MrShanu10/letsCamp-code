const express    = require('express')
const router     = express.Router()
const passport   = require('passport')
const User       = require('../models/user')
const middleware = require('../middlewares')


router.get('/',function(req,res){
    res.render("Homepage")
})

router.get('/register',function(req,res){
    res.render('register')
})

router.post('/register',function(req,res){
    
    User.register(new User({
        username:req.body.username,
        email:req.body.email,
        number:req.body.number,
        role:req.body.role
    }),
    req.body.password,
    function(err,registeredUser){
        if(err){
            req.flash("error",err.message)
            console.log(err)
            return res.render('/register')
        } 
        passport.authenticate('local')(req,res,function(){
            req.flash("success","You have been registered")
            res.render('login')
        })
    })
})

router.get('/login',function(req,res){
    res.render('login')
})

router.post('/login',passport.authenticate('local',{
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
})
,function(req,res){
})

router.get('/logout',function(req,res){
    req.logOut()
    req.flash("success","Logged you out")
    res.redirect('/')
})

module.exports = router