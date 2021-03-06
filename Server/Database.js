"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = exports.insert = void 0;
const Mongo = require("mongodb");
console.log("Database starting");
let databaseURL = "mongodb+srv://eia2:EI3YUugClITD2pNH@eiall.sdwaz.mongodb.net/EIAll?retryWrites=true&w=majority";
let databaseName = "EIAll";
let db;
let fireworkDefinitions;
// running on heroku?
// if (process.env.NODE_ENV == "production") {
//     //    databaseURL = "mongodb://username:password@hostname:port/database";
//     databaseURL = "mongodb://eia2:EI3YUugClITD2pNH@eiall.sdwaz.mongodb.net/EIAll";
//     databaseName = "EIAll";
// }
// try to connect to database, then activate callback "handleConnect" 
Mongo.MongoClient.connect(databaseURL, handleConnect);
// connect-handler receives two standard parameters, an error object and a database object
function handleConnect(_e, _db) {
    if (_e)
        console.log("Unable to connect to database, error: ", _e);
    else {
        console.log("Connected to database!");
        db = _db.db(databaseName);
        fireworkDefinitions = db.collection("fireworkDefinitions");
    }
}
function insert(_doc) {
    // try insertion then activate callback "handleInsert"
    fireworkDefinitions.insertOne(_doc, handleInsert);
}
exports.insert = insert;
// insertion-handler receives an error object as standard parameter
function handleInsert(_e) {
    console.log("Database insertion returned -> " + _e);
}
// try to fetch all documents from database, then activate callback
function findAll(_callback) {
    // cursor points to the retreived set of documents in memory
    var cursor = fireworkDefinitions.find();
    // try to convert to array, then activate callback "prepareAnswer"
    cursor.toArray(prepareAnswer);
    // toArray-handler receives two standard parameters, an error object and the array
    // implemented as inner function, so _callback is in scope
    function prepareAnswer(_e, fireworkDefinitionArray) {
        if (_e)
            _callback("Error" + _e);
        else
            // stringify creates a json-string, passed it back to _callback
            _callback(JSON.stringify(fireworkDefinitionArray));
    }
}
exports.findAll = findAll;
//# sourceMappingURL=Database.js.map