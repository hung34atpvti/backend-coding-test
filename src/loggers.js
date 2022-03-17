const winston = require('winston');
const { format, transports } = require('winston');

const logTransports = [];
logTransports.push(
  new transports.Console({
    level: 'debug',
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      format.align(),
      format.printf(
        info =>
          ` ${info.level}: ${[info.timestamp]}: ===> App: ${info.app}, Stage: ${
            info.stage
          }, ${info.message}`
      )
    )
  })
);

logTransports.push(
  new transports.File({
    level: 'info',
    filename: './logs/info.log',
    format: format.json({
      replacer: (key, value) => {
        if (key === 'info') {
          return {
            message: value.message,
            stack: value.stack
          };
        }
        return value;
      }
    })
  })
);

logTransports.push(
  new transports.File({
    level: 'error',
    filename: './logs/error.log',
    format: format.json({
      replacer: (key, value) => {
        if (key === 'error') {
          return {
            message: value.message,
            stack: value.stack
          };
        }
        return value;
      }
    })
  })
);

const loggers = winston.createLogger({
  transports: logTransports,
  defaultMeta: {
    app: process.env.APP || 'APP',
    stage: process.env.STAGE || 'STAGE'
  }
});

module.exports = loggers;
