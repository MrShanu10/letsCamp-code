const myObj = { }

myObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next()
    } 
    req.flash("error","You must log in first!!")
    res.redirect('/login')
}

myObj.isCorrectUser = function(req,res,next){
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error","Campground Not Found")
            console.log(err)
        } else{
            if(req.user.role==('admin') || foundCampground.author.id.equals(req.user._id)){
                next()
            }
            else{
                req.flash("error","Sorry.You don't have permission to do that.")
                res.redirect("back")
            }
        }    
        })
    }
    else{
        req.flash("error","You need to be logged In")
        res.redirect("back")
    }
}

myObj.checkCommentOwnership  = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","Something went wrong!!!")
                res.redirect("back")
            } else{
                if(foundComment.author.id.equals(req.user._id)){
                    next()
                } else{
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back")
                }
            } 
        })       
    }
    else{
        req.flash("error","YOu need to be logged In")
        res.redirect("back")
    }
}

module.exports = myObj