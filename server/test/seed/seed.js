const {Todo} = require('./../../models/todo.js');

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

// populate todos
var popTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};

module.exports = {
    todos,
    popTodos
};
