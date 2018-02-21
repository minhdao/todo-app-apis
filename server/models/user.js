const validator = require('validator');
// import mongoose module
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// user schema for User model
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true,
        validate:{
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not an email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            access:{
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});

// user instance method to create auth token
// do NOT user arrow func since this binding needed
UserSchema.methods.genAuthToken = function () {
    // make it clearer when assign 'this' to a specific variable
    var user = this;
    var access = 'auth';
    var raw_sauce = 'abc123';
    var token = jwt.sign({_id: user._id.toHexString(), access}, raw_sauce).toString();
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    });
};

// override toJSON method to modify wut data to send back to user
// maybe creating a brand new function for this task is a better approach
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id', 'email']);
};

// create user model
var User = mongoose.model('User', UserSchema);

// export model
module.exports = {
    User
};
