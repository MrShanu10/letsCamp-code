const mongoose = require('mongoose')
const mongooseLocalStrategy = require('passport-local-mongoose')

const UserSchema = mongoose.Schema({

    username:String,
    password:String,
    email:String,
    number:Number,
    role:String
})

UserSchema.plugin(mongooseLocalStrategy,{ usernameField : 'email' })

module.exports = mongoose.model("User",UserSchema)
