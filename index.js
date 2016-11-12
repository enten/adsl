'use strict'

var util = require('util')

function ADSL (opts) {
  opts = opts || {}
  if (typeof opts === 'string') {
    opts = {level: opts}
  }
  if (typeof opts.prefix === 'string') {
    var strPrefix = opts.prefix
    opts.prefix = function () { return strPrefix }
  }

  var level, levelIndex, logger = {}
  var transports = [].concat(opts.transport || ADSL.defaultTransport)

  Object.defineProperties(logger, {
    'level': {
      get: function () { return level },
      set: function (value) {
        value = typeof value === 'number' ? ADSL.levels[value] : value
        level = ~ADSL.levels.indexOf(value) ? value : ADSL.defaultLevel
        levelIndex = ADSL.levels.indexOf(level)
      }
    },
    'levelIndex': {
      get: function () { return levelIndex },
      set: function (value) { logger.level = ADSL.levels[value]}
    },
    'log': {
      value: function () {
        var args = [].slice.call(arguments)
        var lvl = ~ADSL.levels.indexOf(args[0]) ? args.shift() : ADSL.defaultLevel
        var lvlIndex = ADSL.levels.indexOf(lvl)
        var shouldLog = lvlIndex >= levelIndex
        var msg = util.format.apply(util, args)
        if (opts.prefix) {
          msg = util.format(opts.prefix(lvl, lvlIndex), msg)
        }
        transports.forEach(function (transport) {
          transport(msg, shouldLog, lvl, lvlIndex)
        })
      }
    }
  })

  ADSL.levels.forEach(function (lvl) {
    logger[lvl] = logger.log.bind(null, lvl)
  })

  logger.level = opts.level

  return logger
}

ADSL.levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
ADSL.defaultLevel = 'info'
ADSL.outputMap = {
  trace: 'info',
  debug: 'info',
  fatal: 'error'
}
ADSL.defaultTransport = function (msg, shouldLog, lvl, lvlIndex) {
  shouldLog &&
    (console[ADSL.outputMap[lvl] || lvl] || console.log).call(console, msg)
}

module.exports = ADSL
