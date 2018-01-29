// const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb'); // use ES6 destructuring feature to pull out specific things from mongodb object

const dbAddress = 'mongodb://localhost:27017';

const dbName = 'TodoApp';

MongoClient.connect(dbAddress , (err, client) => {
    if (err) {
        // return from a function -> program stops
        return console.log('Something went wrong: ', err);
    }

    console.log('Connected to db: ', dbAddress);

    var db = client.db(dbName);

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Cannot insert document into Todos: ', err);
    //     }
    //     console.log('Insert document successfully into Todos: ', JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'minh',
        age: 27
    }, (err, result) => {
        if (err) {
            return console.log('Cannot insert document into Users collection:', err);
        }
        console.log('Successfully insert document into Usrs collection:', JSON.stringify(result.ops, undefined, 2));
    });

    client.close();

});
