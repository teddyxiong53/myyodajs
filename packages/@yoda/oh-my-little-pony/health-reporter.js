var _ = require('@yoda/util')._
var path = require('path')
var fs = require('fs')

var mkdirp = require('@yoda/util/fs').mkdirp

function HealthReporter (name, options) {
    if (typeof name !== 'string') {
        throw new TypeError('name must be string')
    }
    this.name = name 
    this.interval = _.get(options, 'interval', 500)
    this.timer = null
    this.reportPath = path.join('/tmp/health', `${name}-${process.pid}`)
}

HealthReporter.prototype.start = function start() {
    if (this.timer != null) {
        return 
    }
    this.timer  = setInterval (()=> {
        mkdirp('/tmp/health', (err)=> {
            if (err) {
                return 
            }
            fs.writeFile(this.reportPath, `${new Date().toISOString()}`, ()=>{})
        })
    }, this.interval)
}
HealthReporter.prototype.stop  =function stop () {
    clearInterval(this.timer)
    this.timer = null
}
module.exports = HealthReporter