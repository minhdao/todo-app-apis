const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');

// create some test data
var todos = [{
    text: 'do this'
}, {
    text: 'do that'
}, {
    text: 'do something'
}, {
    _id: '5a704933e0f67e15f2cee781',
    text: 'do something'
}];

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var users = [{
    _id: userOneId,
    email: 'minh@email.com',
    password: '123456abc!',
    tokens: [
        {
            access:'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
        }
    ]
}, {
    _id: userTwoId,
    email: 'tien@email.com',
    password: 'hello12345678'
}];

// populate todos
var popTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};

// populate users
var popUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    });
};

module.exports = {
    todos,
    popTodos,
    users,
    popUsers
};