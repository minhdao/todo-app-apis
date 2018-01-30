const express = require('express');
const bodyParser = require('body-parser');

// load in/import the mongoose
var {mongoose} = require('./db/mongoose.js');
// load in models
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
