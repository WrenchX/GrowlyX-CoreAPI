const db = require("./database")
const fs = require('fs')
const express = require('express')
const app = express()
const router = express.Router
const { use } = require('./middlewares/limiter')
const rateLimit = require('express-rate-limit')

const whitelist = JSON.parse(fs.readFileSync("./config/whitelist.json").toString())
const blacklist = JSON.parse(fs.readFileSync("./config/blacklist.json").toString())

const config = JSON.parse(fs.readFileSync("./config/config.json").toString())

const run = () => {

// create middleware from your rate limiting package to later conditionally apply
    const limiter = rateLimit({
        windowMs: 60 * 1000,
        max: config.webserver.limit,
        message: {error: 'You have exceeded the requests in 1 min limit! Please try again soon.'},
        headers: true,
    })

    const rateLimiter = (req, res, next) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // implement your ip address limiting here
        // you should have one of three outcomes
        // 1. You call next() to allow the routing to continue for this request
        // 2. You call next(someError) to abort routing and fall-through to
        //    your Express error handler
        // 3. You send a response using something like res.status(xxx).send(),
        //    thus ending the request

        // if the IP address is on the whitelist, then let it go
        if (whitelist.indexOf(ip) >= 0) {
            // continue routing
            next()
            return
        }

        // block this request if the IP address is on the blacklist
        if (blacklist.indexOf(ip) >= 0) {
            res.status(403).send({"error": 'You cannot use this service!'});
            return;
        }

        // apply rate limiter middleware
        limiter(req, res, next);
    }

    const port = config.webserver.port
    app.use(rateLimiter);
    app.get('/player', (req, res) => {
        if (req.query.uuid) {
            db.getPlayerByUUID(req.query.uuid, (data) => {
                res.send(data)
            })
        } else if (req.query.name != null) {
            db.getPlayerByName(req.query.name, (data) => {
                res.send(data)
            })
        }
    })
    app.get('/leaderboards', (req, res) => {
        if (req.query.cat && req.query.order && req.query.count) {

            db.getLeader(req.query.order, req.query.count, req.query.cat, (data) => {
                res.json(data)
            })


        } else {
            res.json({
                "status": 204,
                "error": "Missing parameter, check docs!"
            })
        }
    })
    app.get('*', (req, res) => {
        res.send({
            error: 404,
            message: 'Oopsie, seems like your code has an error :(.'
        })
    })
    app.listen(port)
}

module.exports = {
    run
}