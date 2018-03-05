const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {todos, popTodos, users, popUsers} = require('./seed/seed.js');
const {User} = require('./../models/user.js');

// wipe out and populate new data inside User and Todo collections before testing
beforeEach(popUsers);
beforeEach(popTodos);

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

// GET /users/me
describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
            })
            .end(done);
    });
    it('should return 401 if NOT authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'some wrong token')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

// POST /users
describe('POST /users', () => {
    it('should create new user provided with valid inputs', (done) => {
        var email = 'unique@email.com';
        var password = 'password!!@343';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                // expect token generated
                expect(res.headers['x-auth']).toBeTruthy();
                // expect res body contain same email sent in
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                // check inside the database itself
                User.findOne({email}).then((user) => {
                    // expect user exist and has values
                    expect(user).toBeTruthy();
                    // expect password hashed inside db
                    expect(user.password).not.toBe(password);
                    done();
                });
            });
    });
});
