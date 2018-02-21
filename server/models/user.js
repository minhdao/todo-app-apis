const validator = require('validator');
// import mongoose module
const mongoose = require('mongoose');

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

// create user model
var User = mongoose.model('User', UserSchema);

// export model
module.exports = {
    User
};
