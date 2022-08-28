'use strict'
var util  = require('util')

var native 
try {
    native = require('./logger.node')

} catch (e) {
    console.log('use console stdout as @yoda/logger output target')
    var consoleLevels = [
        () => {},//none
        console.debug, //verbose
        console.debug, //debug
        console.info,
        console.warn,
        console.error
    ]
    native = {
        enableCloud: function() {},
        print: function native (lvl, tag, line) {
            var fn = consoleLevels[lvl]
            var level = Object.keys(logLevels)[lvl-1]
            fn(`${new Date().toISOString()} [${level.toUpperCase()}] <${tag}>`, line)
        }
    }
}
var logLevels = {
    'none': 0,
    'verbose': 1,
    'debug': 2,
    'info': 3,
    'warning': 4,
    'error': 5
}

function Logger(name) {
    this.name = name || 'default'
}

function createLoggerFunction(level) {

}

Logger.prototype.verbose = createLoggerFunction('verbose')
Logger.prototype.debug = createLoggerFunction('debug')
Logger.prototype.info = createLoggerFunction('info')
Logger.prototype.warn = createLoggerFunction('warn')
Logger.prototype.error = createLoggerFunction('error')

module.exports = function (name) {
    return new Logger(name)
}