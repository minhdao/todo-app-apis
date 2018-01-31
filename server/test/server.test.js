const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

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

// wipe out data inside Todo collection before testing
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
});

// POST /todos
describe('POST /todos', () => {
    it('should create new todo', (done) => {
        var text = 'todo test';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    done();
                }).catch((err) => {
                	done(err);
                });
            });
    });

    it ('should not create new todo for invalid request', (done) => {
        var text = '';
        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .end(done);
    });
});

// GET /todos
describe('GET /todos', () => {
    it ('should get all todos in database', (done) => {
        request(app)
            .get('/todos')
            .expect((res) => {
            	expect(res.body.todos.length).toBe(todos.length);
            })
            .end(done);
    });
});

// GET /todos/:id
describe('GET /todos', () => {
    it ('should get todo with specific id in database', (done) => {
        var id = '5a704933e0f67e15f2cee781';
        request(app)
            .get(`/todos/${id}`)
            .expect((res) => {
            	expect(res.body.todo._id).toBe(id);
            })
            .end(done);
    });
});
