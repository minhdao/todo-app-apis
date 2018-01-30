const express = require('express');
const bodyParser = require('body-parser');

// load in/import the mongoose
var {mongoose} = require('./db/mongoose.js');
// load in models
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

// middleware
app.use(bodyParser.json()); // take json -> object

// routes config
app.post('/todos', (req, res) => {
    // create todo model object
    var todo = new Todo({
        text: req.body.text
    });

    // save todo into database
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.send(err);
    });
});

// start server
app.listen(3000, () => {
    console.log('Server started on port 3000...');
});
