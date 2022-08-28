'use strict'

var fs = require('fs')
var path = require('path')
var logger = require('logger')('pony')
var yodaUtil = require('@yoda/util')

var HealthReporter = require('./health-reporter')

module.exports = {
    catchUncaughtError,
    HealthReporter,
    healthReport
}

var profiling = false

process.on('SIGUSR1', function() {
    var profiler = require('profiler')
    if (profiling) {
        logger.debug('stop profiling')
        profiler.stopProfiling()
        return
    }
    var timestamp = Math.floor(Date.now())
    var filename = `/data/cpu-profile-${process.pid}-${timestamp}.txt`
    profiler.startProfiling(filename)
    profiling = true
})

process.on('SIGUSR2', function() {
    var profiler = require('profiler')
    var timestamp = Math.floor(Date.now())
    var filename = `/data/heapdump-${process.pid}-${timestamp}.json`
    profiler.takeSnapshot(filename)
})

function catchUncaughtError (logfile, callback) {
    if (typeof logfile === 'function') {
        callback = logfile
        logfile = undefined
    }
    if (logfile) {
        yodaUtil.fs.mkdirpSync(path.dirname(logfile))
    }
    process.on('uncaughtException', err => {
        if (logfile) {
            fs.writeFileSync(logfile, `[${new Date().toISOString()}] <${process.title}> Uncaught Exception: ${err.stack}\n`)
        }
        callback && callback(err)
    })
    return module.exports
}

function healthReport(name) {
    var reporter  = new HealthReporter(name)
    reporter.start()
    return module.exports
}

