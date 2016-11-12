const adsl = require('.')
const colors = require('colors')
const fs = require('fs')
const os = require('os')

function colorsTransport (styles, msg, shouldLog, lvl, lvlIndex) {
  if (colors.supportsColor && styles[lvl]) {
    msg = styles[lvl](msg)
  }
  return adsl.defaultTransport(msg, shouldLog, lvl, lvlIndex)
}

function streamTransport (wstream, msg, shouldLog, level, levelIndex) {
  wstream.write(`${levelIndex} ${new Date()} ${msg}${os.EOL}`)
}

var logWriteStream = fs.createWriteStream('log.txt')

const log = adsl({
  level: 'info',
  prefix (level) {
    return level.toUpperCase()
  },
  transport: [
    streamTransport.bind(null, logWriteStream),
    colorsTransport.bind(null, {
      trace: colors.grey,
      debug: colors.grey,
      info: colors.cyan,
      warn: colors.red,
      error: colors.bgRed,
      fatal: colors.bgRed
    })
  ]
})

log.info('current level:', log.level, log.levelIndex)
log.info('visible')
log.debug('invisible')

log.level = 'debug'

log.info('current level:', log.level, log.levelIndex)
log.info('foo')
log.debug('bar')

logWriteStream.end(os.EOL)
