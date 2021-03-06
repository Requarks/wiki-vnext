const chalk = require('chalk')
const events = require('events')

/* global WIKI */

const LEVELS = ['error', 'warn', 'info', 'debug']
const LEVELSIGNORED = ['verbose', 'silly']
const LEVELCOLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'cyan'
}

class Logger extends events.EventEmitter {
  constructor () {
    super()

    let ignoreNextLevels = false

    LEVELS.forEach(lvl => {
      this[lvl] = (...args) => {
        if (ignoreNextLevels) {
          return
        }
        if (lvl === WIKI.config.logLevel) {
          ignoreNextLevels = true
        }
        this.log(lvl, ...args)
      }
    })

    LEVELSIGNORED.forEach(lvl => {
      this[lvl] = () => {}
    })
  }

  log (level, msg, ...args) {
    console.log(chalk`${new Date().toISOString()} {dim [${WIKI.INSTANCE_ID}]} {${LEVELCOLORS[level]}.bold ${level}}: ${msg}`)
  }
}

module.exports = {
  loggers: {},
  init () {
    return new Logger()
  }
}
