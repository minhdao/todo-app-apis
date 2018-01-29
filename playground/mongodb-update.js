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

    // db.collection('Todos').findOneAndUpdate(
    //     {_id: new ObjectID("5a6ecbf15c5f0a8306ab8652")},
    //     { $set: {
    //             completed: false
    //         }
    //     },
    //     {returnOriginal: false})
    //     .then((res) => {
    //     console.log(res);
    // });


    db.collection('Users').findOneAndUpdate(
        {name: 'minh'},
        { $inc: {
                age: 1
            }
        },
        {returnOriginal: false})
        .then((res) => {
        console.log(res);
    });
    
    // client.close();

});
