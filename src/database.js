const fs = require("fs")
const {MongoClient} = require('mongodb');
const assert = require('assert');

const config = JSON.parse(fs.readFileSync("./config/config.json").toString())

const port = () => {
    if (config.database.port.length !== 0) {
        return ':' + config.database.port
    } else {
        return ''
    }
}
// Connection URL
const uri = 'mongodb+srv://' + config.database.username + ':' + config.database.password + '@' + config.database.host + port() + '/' + config.database.dbname + '?retryWrites=true&w=majority';

const getPlayerByName = (search, callback) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});
    client.connect(function (err) {
        assert.strictEqual(null, err);

        const db = client.db(config.database.dbname);

        // Get the collection
        const collection = db.collection(config.database.collection);
        // Find some documents
        collection.find({'name': search}).toArray(function (err, docs) {
            assert.strictEqual(err, null);
            client.close();
            docs.forEach((item, index) => {
                delete item.canSeeStaffMessages
                delete item.ipAddress
                delete item.authSecret
                delete item.lastAuthAddress
            })
            if (docs.length !== 0) {
                if (callback)
                    callback(docs);
            } else {
                if (callback)
                    callback({
                        "status": 204,
                        "error": "No player found!"
                    })
            }
        });
    });

}

const getPlayerByUUID = (search, callback) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});
    client.connect(function (err) {
        assert.strictEqual(null, err);

        const db = client.db(config.database.dbname);

        // Get the collection
        const collection = db.collection(config.database.collection);
        // Find some documents
        collection.find({'uuid': search}).toArray(function (err, docs) {
            assert.strictEqual(err, null);
            client.close();
            docs.forEach((item, index) => {
                delete item.canSeeStaffMessages
                delete item.ipAddress
                delete item.authSecret
                delete item.lastAuthAddress
            })
            if (docs.length !== 0) {
                if (callback)
                    callback(docs);
            } else {
                if (callback)
                    callback({
                        "status": 204,
                        "error": "No player found!"
                    })
            }
        });
    });

}

const getLeader = (order, count, cat, callback) => {
    if (count > 50) {
        count = 50
    }
    if (["coins", "karma"].indexOf(cat) > -1) {

        const client = new MongoClient(uri, {useUnifiedTopology: true});
        client.connect(function (err) {
            assert.strictEqual(null, err);

            const db = client.db(config.database.dbname);

            const returnEmpty = (err) => {
                callback({
                    "status": 204,
                    "error": `Wrong usage of parameter: ${err}`
                })
            }

            // Get the collection
            const collection = db.collection(config.database.collection);
            // Find some documents
            const sortOrder = () => {
                switch (order.toLowerCase()) {
                    case "up":
                        return -1
                    case "down":
                        return 1
                    default:
                        returnEmpty("Wrong value for the order query.")
                }
            }
            collection.find().sort({cat: sortOrder()}).limit(parseInt(count)).toArray(function (err, docs) {
                assert.strictEqual(err, null);
                client.close();
                docs.forEach((item, index) => {
                    delete item.canSeeStaffMessages
                    delete item.ipAddress
                    delete item.authSecret
                    delete item.lastAuthAddress
                })
                if (docs.length !== 0) {
                    if (callback)
                        callback(docs);
                } else {
                    if (callback)
                        callback({
                            "status": 204,
                            "error": "No player found!"
                        })
                }
            });
        });
    } else {
        if (callback)
            callback({
                "status": 204,
                "error": "Wrong query usage!"
            })
    }
}


module.exports = {
    getPlayerByName,
    getPlayerByUUID,
    getLeader
}