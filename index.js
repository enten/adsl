'use strict'

var util = require('util')

function ADSL (opts) {
  opts = opts || {}
  if (typeof opts === 'string') {
    opts = {level: opts}
  }
  if (typeof opts.levels === 'string') {
    opts.levels = ADSL.levels[opts.levels]
  }
  if (typeof opts.prefix === 'string') {
    var strPrefix = opts.prefix
    opts.prefix = function () { return strPrefix }
  }

  var level, levelIndex
  var levels = opts.levels || ADSL.levels[ADSL.defaultLevels]
  var transports = [].concat(opts.transport || ADSL.defaultTransport)

  var logger = Object.defineProperties({}, {
    'level': {
      get: function () { return level },
      set: function (value) {
        value = typeof value === 'number' ? levels[value] : value
        level = ~levels.indexOf(value) ? value : ADSL.defaultLevel
        levelIndex = levels.indexOf(level)
      }
    },
    'levelIndex': {
      get: function () { return levelIndex },
      set: function (value) { logger.level = levels[value] }
    },
    'log': {
      value: function () {
        var args = [].slice.call(arguments)
        var lvl = ~levels.indexOf(args[0]) ? args.shift() : ADSL.defaultLevel
        var lvlIndex = levels.indexOf(lvl)
        if (arguments[0] === 'trace') {
          lvl = 'trace'
          lvlIndex = levels.indexOf('debug')
        }
        var shouldLog = lvlIndex <= levelIndex
        var msg = util.format.apply(util, args)
        if (opts.prefix) {
          msg = util.format(opts.prefix(lvl, lvlIndex), msg)
        }
        transports.forEach(function (transport) {
          transport(msg, shouldLog, lvl, lvlIndex)
        })
      }
    },
    'trace': {
      value: function () {
        logger.log.apply(null, ['trace'].concat([].slice.call(arguments)))
      }
    }
  })

  levels.forEach(function (lvl) {
    logger[lvl] = logger.log.bind(null, lvl)
  })

  logger.level = opts.level

  return logger
}

ADSL.defaultLevel = 'info'
ADSL.defaultLevels = 'npm'
ADSL.defaultTransport = function (msg, shouldLog, lvl, lvlIndex) {
  shouldLog &&
    (console[ADSL.outputMap[lvl] || lvl] || console.log).call(console, msg)
}
ADSL.levels = {
  'console-log-level': ['fatal', 'error', 'warn', 'info', 'debug'],
  npm: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
  rfc5424: ['emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug']
}
ADSL.outputMap = {
  alert: 'error',
  crit: 'error',
  debug: 'log',
  emerg: 'error',
  notice: 'info',
  silly: 'log',
  verbose: 'log',
  warning: 'warn'
}

module.exports = ADSL
// 94!
