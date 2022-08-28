'use strict'

var logger = require('logger')('main')
var exodus = require('@yoda/exodus')

require('@yoda/oh-my-little-pony')
    .catchUncaughtError('/data/system/yodart-err.log')
    .healthReport('vuid')

var AppRuntime = require('../../app-runtime')

;(function () {
    activateProcess()
    entry()
})()

function activateProcess() {
    //这个是以为iotjs确实nextTick，用这种方式进行弥补。
    setInterval(()=> false, 1000);
}

function entry() {
    exodus((err) => {
        var runtime = new AppRuntime()
        runtime.init()
        require('./watchdog').startFeeding((err)=> {
            if (err) {
                process.exit(1)
            }
        })
    })
}