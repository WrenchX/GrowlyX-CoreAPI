const fs = require("fs")

const path = "./config/config.json"

const generateConfig = (callback) => {
    //check if config already exists, if it does, cancel.
    try {
        if (fs.existsSync(path)) {
            //exists
            if (callback)
                callback()
            return
        }
        //declare default values
        const config = {
            "database": {
                "host": "localhost",
                "port": "27017",
                "username": "groot",
                "password": "lemmeInPls",
                "dbname": "data",
                "collection": "players"
            },
            "webserver": {
                "port": "80",
                "limit": 10
            }
        }
        //write them
        fs.writeFileSync(path, JSON.stringify(config, null, 4))
        if (callback)
            callback()
    } catch (err) {
    }


}

module.exports = {
    generateConfig
}