const express          = require('express')
const mongoose         = require('mongoose')
const flash            = require('connect-flash')
const passport         = require('passport')
const LocalStrategy    = require('passport-local')
const methodOverride   = require('method-override')

const bodyParser       = require('body-parser')
const { urlencoded }   = require('body-parser')
const Campground       = require('./models/post')
const Comment          = require('./models/comments')
const User             = require('./models/user')
const comments         = require('./models/comments')

const commentRoutes    = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes      = require('./routes/index')

const app = express()
mongoose.connect('mongodb://localhost/YelpCamp',{ 
    useNewUrlParser: true ,
    useUnifiedTopology: true, 
    useFindAndModify:false})

app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.set('view engine','ejs')
app.use(express.static(__dirname+'/public'))
app.locals.moment = require('moment')


//Passport Config
app.use(require('express-session')({
    secret:'This is YelpCamp based encryption',
    resave:false,
    saveUninitialized:false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

//passport.use(new LocalStrategy(User.authenticate()))
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Local Middlleware
app.use(function(req,res,next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use(commentRoutes)
app.use(campgroundRoutes)
app.use(indexRoutes)

app.listen(8000,(req,res) =>{
    console.log("Server started..")
})