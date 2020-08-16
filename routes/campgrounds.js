const express = require('express')
const router     = express.Router()
const Campground = require('../models/post')
const middleware = require('../middlewares')

router.get('/campgrounds',function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }
        else{
            res.render('Campgrounds',{campgrounds:allCampgrounds})
        }
    })
    
})

router.get('/campground/new',middleware.isLoggedIn,function(req,res){
    res.render('AddCampground')
})

router.post('/campgrounds',middleware.isLoggedIn,function(req,res){
    const name = req.body.name
    const image = req.body.image
    const desc = req.body.description
    const price = req.body.price
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name:name,image:image,description:desc,price:price,author:author}
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            req.flash("error",err.message)
            console.log(err)
        }
        else{
            req.flash("success","Campground Addedd Successfully!!!")
            res.redirect('/campgrounds')
        }
    })
})

router.get('/campgrounds/:id',function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
        if(err){
            console.log(err)
        } else{
            res.render('show',{campground:foundCampground})
        }
    })
})

router.get('/campgrounds/:id/edit',middleware.isCorrectUser,function(req,res){
    
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err)
        } else{
            res.render('edit',{campground:foundCampground})
        }
    })
    
})

router.put('/campgrounds/:id',middleware.isCorrectUser,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            console.log(err)
        } else{
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})

router.get('/campgrounds/:id/delete',middleware.isCorrectUser,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error",err.message)
            console.log(err)
        } else{
            res.render('delete',{campground:foundCampground})
        }
    })
})

router.delete('/campgrounds/:id',middleware.isCorrectUser,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error",err.message)
            console.log(err)
        } else{
            req.flash("success","Campground deleted Suceessfully!!!")
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router