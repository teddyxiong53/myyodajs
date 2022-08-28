module.exports = {
    AppScheduler : {
        status: {
            notRunning: 'not running',
            creating: 'creating',
            running: 'running',
            suspending: 'suspending',
            error: 'error',
            exited: 'exited'
        },
        modes: {
            default: 0,
            instrument: 1,
            debug: 2
        }
    }
}