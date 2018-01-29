const mongoose = require('mongoose');

// set up mongoose to use Promise
mongoose.Promise = global.Promise;

// connect mongoose to the mongo db
mongoose.connect('mongodb://localhost:27017/TodoApp');

// create Todo model
var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// instance of the model
var newTodo = new Todo({
    text: 'buy more shorts',
    completed: false,
    completedAt: undefined
});
// save new todo into database
newTodo.save().then((doc) => {
    console.log('Successfully saved todo', doc);
}, (err) => {
    console.log('Cannot save todo', err);
});
