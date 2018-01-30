const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

// wipe out data inside Todo collection before testing
beforeEach((done) => {
    Todo.remove({}).then(() => {
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
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                	done(err);
                });
            });

    });
});
