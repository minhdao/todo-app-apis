const validator = require('validator');
// import mongoose module
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcryptjs = require('bcryptjs');

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

// middleware to check(if pass modified) and hash password before saving to database
UserSchema.pre('save', function (next) {
    var user = this;
    // only hash password when it's first created or modified
    if (user.isModified('password')){
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
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
// UserSchema.methods.toJSON = function () {
//     var user = this;
//     var userObj = user.toObject();
//     return _.pick(userObj, ['_id', 'email']);
// };

// function to tailor data to send back to user
// so overriding toJSON not needed
UserSchema.methods.tailorData = function () {
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id', 'email']);
};

// Model method to find user by Token
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// Model method to find user by email
UserSchema.statics.findByEmail = function (email) {
    var User = this;
    return User.findOne({
        'email': email
    });
};

// Instance method to validate password
UserSchema.methods.validatePassword = function (password) {
    var user = this;
    return bcryptjs.compare(password, user.password);
};

// Model method to login user
UserSchema.statics.login = function (email, password) {
    var User = this;

    return User.findOne({
        'email': email
    }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return bcryptjs.compare(password, user.password).then((result) => {
            if (result){
                return Promise.resolve(user);
            }else{
                return Promise.reject();
            }
        });
    });
};

// Instance method to logout user
UserSchema.methods.logout = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
};

// create user model
var User = mongoose.model('User', UserSchema);

// export model
module.exports = {
    User
};
