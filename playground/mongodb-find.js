// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // use ES6 destructuring feature to pull out specific things from mongodb object

const dbAddress = 'mongodb://localhost:27017';

const dbName = 'TodoApp';

MongoClient.connect(dbAddress , (err, client) => {
    if (err) {
        // return from a function -> program stops
        return console.log('Something went wrong: ', err);
    }

    console.log('Connected to db: ', dbAddress);

    var db = client.db(dbName);

    // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    //     console.log('Todos: ');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Cannot query Todos', err);
    // });

    db.collection('Users').find({name: 'minh'}).toArray().then((docs) => {
        console.log('Users: ');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Cannot query users', err);
    });

    client.close();

});
