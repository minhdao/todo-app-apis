const mongoose = require('mongoose');

// set up mongoose to use Promise
mongoose.Promise = global.Promise;

// connect mongoose to the mongo db
mongoose.connect('mongodb://localhost:27017/TodoApp');
