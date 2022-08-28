class Descriptor {
    constructor (runtime, name) {
        this.runtime = runtime
        this.component = runtime.component
        this.descriptor = runtime.descriptor
        this.namespace = name
    }
    emitToApp (appId, event, args) {
        var bridge = this.component.AppScheduler.getAppById(appId)
        
    }
}