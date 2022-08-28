const { time } = require('console')
var fs = require('fs')
var path = require('path')

var logger = require('logger')('bolero/logger')
var _ = require('@yoda/util')._

class Loader {
    constructor (runtime, property) {
        this.registry = {}
        this.cache = {}
        this.runtime = runtime
        this.property = property
        if(this.runtime[property] === null) {
            this.runtime[this.property] = {}
        }
        this.target  = this.runtime[this.property]
    }

    load (compDir) {
        //compDir是Component的目录
        var entities 
        try {
            entities = fs.readFileSync(compDir)

        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err
            }
            entities = []
            logger.error(`${compDir} not exists, skipping ...`)
        }
        return entities.filter(it=> _.endsWith('.js'))
            .map(it=> {
                this.register(path.basename(it, '.js'), path.join(compDir, it))
            })
    }
    register (name, filename) {
        name = _.camelCase(name)
        if (this.registry[name]) {
            throw new Error(`Conflict on ${name}`)
        }
        this.registry[name] = filename
        Object.defineProperty(this.target, name, {
            enumerable: true,
            configurable: true,
            get: () => {
                var instance  = this.cache[name]
                if (!instance) {
                    var Klass = require(filename)
                    instance = new Klass(this.runtime)
                    this.cache[name] = instance
                }
                return instance
            }
        })
    }
    registerClass (name, Klass) {

    }
}
module.exports = Loader
