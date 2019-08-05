var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'blogpost'
    }]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema)
