const ADSL = require('.')
const fs = require('fs')
const os = require('os')

function streamTransport(wstream, loggerLevel, loggerLevelNum) {
  return (message, prefix, level, levelNum) =>
    wstream.write(
      `${levelNum} ${new Date().toISOString()} ${prefix} ${message}${os.EOL}`)
}

var logWriteStream = fs.createWriteStream('log.txt')

const log = ADSL({
  level: 'info',
  prefix: level => level.toUpperCase(),
  transport: [
    ADSL.defaultTransport,
    streamTransport.bind(null, logWriteStream)
  ]
})

log.info('foo')
log.debug('bar')

logWriteStream.end(os.EOL)

// $ node example.js
// INFO foo
//
// $ cat log.txt
// 2 2016-11-11T04:59:53.539Z INFO foo
// 1 2016-11-11T04:59:53.540Z DEBUG bar
