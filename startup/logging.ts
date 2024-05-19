import winston from "winston";
// import "winston-mongodb";

const logger = winston.createLogger({
  transports: [
    // new winston.transports.MongoDB({
    //   db: "mongodb://localhost:27017/vidly",
    //   collection: "log",
    //   options: {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   },
    //   level: "info",
    // }),

    new winston.transports.File({
      filename: "uncautchlogger.log",
      handleExceptions: true,
      handleRejections: true,
    }),

    new winston.transports.Console({
      level: "info", 
      handleExceptions: true,
      handleRejections: true,
      format: winston.format.printf(({ message }) => {
        // 只显示消息字符串部分
        return `${message}`;
      }),
    }),
  ],
});

export default logger;
