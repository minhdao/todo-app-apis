const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

var userID      = '5a6f06cd5a2b8a0e24fad677';
var todoID      = '5a704933e0f67e15f2cee781';
var wrongID     = '5a704933e0f67e15f2cee781'; // correct id format but not exist on db
var invalidID   = '5a704933e0f67e15f2cee781234567'; // wrong id format -> cast error

// this can be used to check format of and ID
if (!ObjectID.isValid(invalidID)) {
    console.log(`Invalid ID ${invalidID}`);
}

Todo.find({
    _id: todoID
}).then((todos) => {
    console.log('***** find() query');
    if(!todos){
        return console.log('todo not found!');
    }
    console.log(todos);
}).catch((err) => {
    console.log(err);
});

Todo.findOne({
    _id: todoID
}).then((todo) => {
    console.log('***** findOne() query');
    if(!todo){
        return console.log('todo not found!');
    }
    console.log(todo);
}).catch((err) => {
    console.log(err);
});

Todo.findById(todoID).then((todo) => {
    console.log('***** findById() query');
    if(!todo){
        return console.log('todo not found!');
    }
    console.log(todo);
}).catch((err) => {
    console.log(err);
});

User.findById(userID).then((user) => {
    console.log('***** findById() user query');
    if(!user){
        return console.log('user not found!');
    }
    console.log(user);
}).catch((err) => {
    console.log(err);
});
