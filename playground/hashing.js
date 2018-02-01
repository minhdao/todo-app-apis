const {SHA256} = require('crypto-js');

var message = 'Kepp this secret';
var hashed = SHA256(message).toString();

console.log(`message:`, message);
console.log(`hased:`, hashed);

// user with id 2
var user_2 = {
    id: 2
};
// token provided for a user (id 2) to access something on the server
var token_2 = {
    user_2,
    token: SHA256(JSON.stringify(user_2)).toString()
};
console.log('user 2 token: ', token_2.token);

var user_3 = {
    id: 3
};
// token provided for a user (id 3) to access something on the server
var token_3 = {
    user_3,
    token: SHA256(JSON.stringify(user_3)).toString()
};
console.log('user 2 token: ', token_3.token);


// user 2 want to access user 3 data so they will try to forge a token
user_2.id = 3; // first change id from 2 to 3
token_2.token = SHA256(JSON.stringify(user_2)).toString(); // forge new token faking user 3
console.log('user 2 token after forging from user 3 id', token_2.token); // server might think this is user 3 and allow access for the faked user 3
console.log('user 3 token', token_3.token);

// forgery is an attack can be used to steal data
// to prevent this we can use 'salt' to add in the hash function
// 'salt' is simply a secret and random string added to hash function

var user_4 = {
    id: 4
};
var token_4 = {
    user_4,
    token: SHA256(JSON.stringify(user_4) + 'secret salt for user 4').toString()
};
console.log('user 4 token', token_4.token);

var user_5 = {
    id: 5
};
var token_5 = {
    user_5,
    token: SHA256(JSON.stringify(user_5) + 'secret salt for user 5').toString()
};
console.log('user 5 token', token_5.token);

// now user_5 tries to fake user_4 by forging a fake token
user_5.id = 4;
token_5.token = SHA256(JSON.stringify(user_5)).toString(); // but user_5 doesn't know the salt
// the fake token will be different than the real token because of the missing salt
console.log('user_5 fake token', token_5.token);
console.log('user_4 token', token_4.token);
