// import mongoose module
const mongoose = require('mongoose');

// create user model
var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }
});

// export model
module.exports = {
    User
};
