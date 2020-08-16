const express    = require('express')
const router     = express.Router()
const Campground = require('../models/post')
const Comment    = require('../models/comments')
const middleware = require('../middlewares')

router.get('/campgrounds/:id/comment/new',middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        } else{
            res.render('AddComment',{campground:campground})
        }
    })
})

router.post('/campgrounds/:id/comment',middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        } else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err)
                } else{
                    comment.author.id=req.user._id
                    comment.author.username=req.user.username
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect('/campgrounds/'+campground._id)
                }
            })
        }
    })
})

router.get('/campgrounds/:id/comment/:comment_id/edit',middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash("error","Something went wrong!!!")
            console.log(err)
        } else{
            res.render('EditComment',{campground_id:req.params.id,comment:foundComment})
        }
    })
})

router.put('/campgrounds/:id/comment/:comment_id',middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err)
        } else{
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})

router.delete('/campgrounds/:id/comment/:comment_id',middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(err){
        if(err){
            console.log(err)
        }
        else{
            req.flash("success","Comment deleted successfully")
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})

module.exports = router