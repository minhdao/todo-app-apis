const mongoose = require('mongoose');

// set up mongoose to use Promise
mongoose.Promise = global.Promise;

// connect mongoose to the mongo db
mongoose.connect('mongodb://localhost:27017/TodoApp');

// create Todo model
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

// instance of the model
var newTodo = new Todo({
    text: ' eat ',
});
// save new todo into database
newTodo.save().then((doc) => {
    console.log('Successfully saved todo', doc);
}, (err) => {
    console.log('Cannot save todo', err);
});
