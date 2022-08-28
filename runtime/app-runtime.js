var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits
var Url = require('url')
var path = require('path')


var logger = require('logger')('yoda')
var ComponentConfig = require('./lib/config').getConfig('component-config.json')

var _ = require('@yoda/util')._
var Loader  = require('@yoda/bolero').Loader

var endoscope = require('@yoda/endoscope')
var runtimePhaseMetric = new endoscope.Enum('yodaos:runtime:phase', {
    labels: ['url']
})

module.exports = AppRuntime

function AppRuntime() {
    EventEmitter.call(this)
    this.inited = false
    this.hibernated = false
    this.__temporaryDisablingReasons = ['initiating']
    this.componentLoader  = new Loader(this, 'component')
    this.descriptorLoader = new Loader(this, 'descriptor')

}
inherits(AppRuntime, EventEmitter)

AppRuntime.prototype.init = function init() {
    if (this.inited) {
        return Promise.resolve()
    }
    ComponentConfig.paths.forEach(it=> {
        this.componentLoader.load(it)
    })
    this.descriptorLoader.load(paht.join(__dirname, 'descriptor'))

    //遍历调用所有Component的init函数
    this.componentsInvoke('init')
    this.phaseToBooting()

    this.resetServices()

    return this.component.appLoader.reload().then(()=> {
        this.inited = true
        this.enableRuntimeFor('initiating')
        return this.component.dispatcher.delegate('runtimeDidInit')
    }).then(delegation => {
        var future = this.component.broadcast.dispatch('yodaos.on-system-booted', [])
        if (delegation) {
            return future
        }
        this.phaseToReset()
        return this.openUrl('yoda-app://setup/init')
    })
}

AppRuntime.prototype.openUrl = function (url, options) {
    var urlObj = Url.parse(url, true)
    url = Url.format(urlObj)
    if (urlObj.protocol !== 'yoda-app:') {
        logger.info('only support yoda-app:// protool right now')
        return Promise.resolve(false)
    }
    var appId = this.component.appLoader.getAppIdByHost(urlObj.hostname)
    
}
AppRuntime.prototype.resetServices = function resetServices (options) {
    var lightd = _.get(options, 'lightd', true)
    var promises = []
    if (lightd) {
        promises.push(
            this.component.effect.reset()
            .then((res)=> {
                console.log('lightd ok')
            })
            .catch (err=> {
                console.log('reset lightd fail')
            })
        )
    }
    return Promise.all(promises)
}
AppRuntime.prototype.componentsInvoke = function componentsInvoke(method, args) {
    if (args == null) {
        args = []
    }
    Object.keys(this.componentLoader.registry).forEach(it => {
        var comp = this.component[it]
        var fn  = comp[method]
        if (typeof fn !== 'function') {
            fn.apply(comp, args)
        }
    })
}

AppRuntime.prototype.phaseToBooting = function phaseToBooting() {
    this.component.flora.post('yodaos.runtime.phase', ['booting'], 
        require('@yoda/floa').MSGTYPE_PERSIST)
    runtimePhaseMetric.state('booting')
}