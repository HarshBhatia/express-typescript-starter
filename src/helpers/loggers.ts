import winston from "winston";
import expressWinston from "express-winston";
const msg = `HTTP {{req.method}} {{req.url}} {{res.statusCode}}{{res.body}}{{Object.keys(req.body).length?'Body:'+JSON.stringify(req.body,null,2):''}}`;

let alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: "[LOGGER]",
  }),
  winston.format.timestamp({
    format: "DD-MM-YY hh:mm:ss A",
  }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

export const reqLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: "logs/requests.log" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        alignColorsAndTime
      ),
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YY hh:mm:ss A" }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  meta: true,
  msg,
  expressFormat: false,
  colorize: true,
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YY hh:mm:ss A" }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/verbose.log" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        alignColorsAndTime
      ),
    }),
  ],
});
