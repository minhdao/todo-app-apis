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
describe('GET /todos/:id', () => {
    it ('should get todo with specific id in database', (done) => {
        var id = '5a704933e0f67e15f2cee781';
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
            	expect(res.body.todo._id).toBe(id);
            })
            .end(done);
    });
    it ('should return status 404 for INVALID id', (done) => {
        var invalidID = '5a704933e0f67e15f2cee781xxxxxxxx';
        request(app)
            .get(`/todos/${invalidID}`)
            .expect(404)
            .end(done);
    });
    it ('should return status 404 for WRONG id', (done) => {
        var wrongID = '5a704933e0f67e15f2cee123';
        request(app)
            .get(`/todos/${wrongID}`)
            .expect(404)
            .end(done);
    });
});

// DELETE /todos/:id
describe('DELETE /todos/:id', () => {
    it ('should delete todo with specific id in database', (done) => {
        var id = '5a704933e0f67e15f2cee781';
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
            	expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(id).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
    it ('should return status 404 for INVALID id', (done) => {
        var invalidID = '5a704933e0f67e15f2cee781xxxxxxxx';
        request(app)
            .delete(`/todos/${invalidID}`)
            .expect(404)
            .end(done);
    });
    it ('should return status 404 for WRONG id', (done) => {
        var wrongID = '5a704933e0f67e15f2cee123';
        request(app)
            .delete(`/todos/${wrongID}`)
            .expect(404)
            .end(done);
    });
});

// PATCH /todos/:id
describe('PATCH /todos/:id', () => {
    it ('should update todo with specific id in database', (done) => {
        var id = '5a704933e0f67e15f2cee781';
        var text = 'this should be updated';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
            	expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });
});
