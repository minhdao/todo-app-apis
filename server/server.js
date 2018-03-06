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
var {authenticate} = require('./middleware/authenticate.js');

var app = express();

// middleware
app.use(bodyParser.json()); // take json -> object

// routes config
app.post('/todos',authenticate, (req, res) => {
    // create todo model object
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
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
app.get('/users/me',authenticate , (req, res) => {
    res.send(req.user.tailorData());
});

// login {email, password}
app.post('/users/login', (req, res) => {

    // pick out email and password from the body object
    var body = _.pick(req.body, ['email', 'password']);
    // create user models with provided body data
    var email = body.email;
    var password = body.password;

    // find user by provided email and validate the provided password
    // User.findByEmail(email).then((user) => {
    //     if(!user){
    //         return Promise.reject();
    //     }
    //     user.validatePassword(password).then((result) => {
    //         if(!result){
    //             return Promise.reject();
    //         }
    //         console.log(result);
    //         user.genAuthToken();
    //         res.status(200).send(user.tailorData());
    //     });
    // }).catch((error) => {
    //     res.status(401).send({});
    // });

    // login with provided email and password from user
    User.login(email, password).then((user) => {
        user.genAuthToken().then((token) => {
            res.header('x-auth', token).status(200).send(user.tailorData());
        });
    }).catch((error) => {
        res.status(401).send({});
    });
});

// DELETE token/logout user
app.delete('/users/logout',authenticate, (req, res) => {
    req.user.logout(req.token).then(() => {
       res.status(200).send({});
    }, () => {
       res.status(401).send({});
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
