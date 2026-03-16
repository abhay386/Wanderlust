const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
})
// username  and password  automatically will be created by passport-local-mongoose;
// so we don't need to create it explecitlly;

userSchema.plugin(passportLocalMongoose); // This adds the username , password and hasing automatically .
module.exports = mongoose.model("User",userSchema )