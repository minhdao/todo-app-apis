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
            	expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });
});
