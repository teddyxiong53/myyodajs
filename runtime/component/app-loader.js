var fs = require('fs')
var promisify = require('util').promisify
var logger = require('logger')('app-loader')

var _ = require('@yoda/util')._
var defaultConfig = require('../lib/config').getConfig('app-loader-config.json')
var readdirAsync = promisify(fs.readdir)
var readFileAsync = promisify(fs.readFile)
var statAsync  = promisify(fs.stat)

module.exports = AppChargeur

function AppChargeur (runtime) {
    this.runtime = runtime
    this.config = this.markupConfig(defaultConfig)

    this.hostAppIdMap = {}
    this.appManifests = {}

    this.broadcasts = {
        'yodaos.on-system-booted': [],
        'yodaos.on-phase-reset': [],
        'yodaos.on-phase-ready': [],
        'yodaos.on-time-changed': []
    }
}

AppChargeur.prototype.reload = function reload(appId) {
    if (appId) {
        return
    }
    this.hostAppIdMap = {}
    this.appManifests = {}
    Object.keys(this.broadcasts).forEach(it=> {
        this.broadcasts[it] = []
    })
    return this.loadPaths(this.config.paths)
}

AppChargeur.prototype.markupConfig = function markupConfig(config) {
    if (config == null || typeof config !== 'object') {
        config = {}
    }
    ;['paths', 'lightAppIds'].forEach(key=> {
        if (!Array.isArray(config[key])) {
            config[key] = []
        }
    })
    return config 
}

AppChargeur.prototype.loadApp =  function loadApp(root) {
    
}