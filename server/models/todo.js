// import mongoose module
const mongoose = require('mongoose');

// create todo models
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        require: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {
    Todo
};
