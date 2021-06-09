import { Request, Response, Handler } from "express";
import mongoose from "mongoose";
import { logger } from "../helpers/loggers";

interface IError {
  errmsg?: string;
  stack?: object;
  message?: string;
}

export default (err: IError, req: Request, res: Response, next: Handler) => {
  logger.error(err);

  const { errmsg = "Error", stack = {}, message = "Error" } = err;

  let status = 500;
  if (err instanceof mongoose.Error.ValidationError) status = 400;

  // if (res.headersSent) return next(req, res, err);

  if (process.env.NODE_ENV == "production")
    return res
      .status(status)
      .json({ message: message.trim() || errmsg.trim() });

  return res
    .status(status)
    .json({ message: message.trim() || errmsg.trim(), stack });
};
