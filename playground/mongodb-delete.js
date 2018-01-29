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

    // deleteMany -> delete everything which matches the query
    // db.collection('Todos').deleteMany({text: 'Something to do'}).then((res) => {
    //     console.log(res.result);
    // });

    // deleteOne -> delete first one that matches the query
    // db.collection('Todos').deleteOne({text: 'Something todo'}).then((res) => {
    //     console.log(res.result);
    // });

    // find one and delete
    // db.collection('Todos').findOneAndDelete({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Users').deleteMany({name: 'tien'}).then((res) => {
    //     console.log(res.result);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5a6ebf29789c050b11d0b169")}).then((res) => {
        console.log(res);
    });
    // client.close();

});
