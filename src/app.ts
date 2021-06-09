import * as dotenv from "dotenv";
import "express-async-errors";

import http from "http";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import compression from "compression";
import queryParser from "express-query-int";

import errorHandler from "./middlewares/error";
import notFoundHandler from "./middlewares/notFound";
import { reqLogger, logger } from "./helpers/loggers";

import userRouter from "./routes/user";

dotenv.config();

const { PORT = 5001, DB_URL } = process.env;

if (!DB_URL) {
  throw Error("DB Url missing.");
}

// db
mongoose.connect(DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

mongoose.connection
  .on("open", () => logger.info("💿 MongoDB connected"))
  .on("error", logger.error);

const app = express();

// middlewares
app.use(cors());
app.use(reqLogger);
app.use(helmet());
app.use(compression());
app.use(queryParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.send("OK!");
});

app.use("/users", userRouter);

// term middlewares
app.use(errorHandler);
app.use(notFoundHandler);

const server = http.createServer(app);
server.listen(PORT, () => {
  logger.info(`🏁 Server running on ${PORT}`);
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

function shutDown() {
  logger.warn("Received kill signal, shutting down gracefully");
  server.close(() => {
    logger.info("Closed out all connections");
    process.exit(0);
  });
}
