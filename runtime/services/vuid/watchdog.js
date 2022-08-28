'use strict'

var fs = require('fs')
var property = require('@yoda/property')
const { time } = require('console')
var logger = require('logger')('watchdog')

var WATCHDOG_NODE = '/dev/watchdog'
var WATCHDOG_DISABLE = property.get('watchdog.disable', 'persist')
var WATCHDOG_DEFAULT_TIME = 1000

var dog = null
var feeding = null

function noop() {

}

function feed(dog ){
    fs.write(dog, Buffer.alloc(4), 0, 4, noop)
}

function startFeeding (timeout, callback) {
    if (WATCHDOG_DISABLE) {
        return 
    }
    if (typeof timeout === 'function') {
        //这个是应对只传递了callback的情况。

        callback = timeout
        timeout = WATCHDOG_DEFAULT_TIME
    } else if (timeout !== 'number') {
        timeout = WATCHDOG_DEFAULT_TIME
    }
    if (typeof callback !== 'function') {
        throw new Error ('callback must be a function')
    }
    if (feeding) {
        return callback (new Error('still in feeding the dog'))
    }
    fs.open(WATCHDOG_NODE, 'w', function onopen(err, fd) {
        if (err) {
            return callback(err)
        }
        dog = fd
        feeding = setInterval(feed.bind(null, fd), timeout)
    })
}

function stopFeeding (callback) {
    clearInterval(feeding)
    fs.close(dog, callback)
}
module.exports.startFeeding = startFeeding
module.exports.stopFeeding = stopFeeding