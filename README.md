# adsl

> Another dead simple logger based on the awesome [console-log-level](https://github.com/watson/console-log-level).


A dead simple logger. Will log to STDOUT or STDERR depending on the
chosen log level. It uses `console.info`, `console.warn` and
`console.error` and hence supports the same API.

Log levels supported: trace, debug, info, warn, error and fatal.

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install adsl
```

## Example usage

```js
var log = require('adsl')({ level: 'info' })

log.trace('a') // will not do anything
log.debug('b') // will not do anything
log.info('c')  // will output 'c\n' on STDOUT
log.warn('d')  // will output 'd\n' on STDERR
log.error('e') // will output 'e\n' on STDERR
log.fatal('f') // will output 'f\n' on STDERR
```

## Options

Configure the logger by passing an options object:

```js
var log = require('adsl')({
  level: 'info',
  prefix: (level) => level.toUpperCase(),
  transport: function (loggerLevel, loggerLevelNumber) {
    let fatalLines = 0

    return (message, prefix, level, levelNumber) => {
      if (level === 'fatal' && ++fatalLines > 100) {
        request.post('http://logger-provider/log/fatal', {message})
          .then(() => fatalLines = 0)
      }
      if (levelNumber >= loggerLevelNumber) {
        console.log(prefix ? `${prefix} ${message}` : message)
      }
    }
  }
})
```

### level

A `string` to specify the log level. Defaults to `info`.

### prefix

Specify this option if you want to set a prefix for all log messages.
This must be a `string` or a `function` that returns a string.

## transport

Hight-order function which returns message output handler.
This must be a `function` or an `array` of functions.

default to : [`require('adsl').defaultTransport`](https://github.com/enten/adsl/blob/master/index.js#L41)

## License

MIT
