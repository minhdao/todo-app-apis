require('./config/config.js'); // load in config file

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

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
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    // create todo model object
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    // save todo into database
    // user.save().then(() => { // this code run save 2 times - can be improved
    //     return user.genAuthToken();
    // }).then((token) => {
    //     res.header('x-auth', token).send(user);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // });

    user.genAuthToken().then((token) => {
        res.header('x-auth', token).send(user.tailorData());
    }).catch((error) => {
        res.status(400).send(error);
    });
});

// private route with token to authenticate user
app.get('/users/me', (req, res) => {
    console.log('/users/me');
    var token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if (!user) {

        }
        console.log(user);
        res.send(user.tailorData());
    }).catch((error) => {
        res.status(401).send();        
    });
});

// start server
var port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started port ${port}`);
});

// export
module.exports = {
    app
};
