import mongoose from "mongoose";

export interface IControllerConfig<T extends mongoose.Document> {
  objectTitle: string;
  createBodyFields: Array<string>;
  updateBodyFields: Array<string>;
  Model: mongoose.Model<T>;
}

export interface IUser extends mongoose.Document {
  name?: string;
  id?: string;
  email: string;
  password: string;
}
