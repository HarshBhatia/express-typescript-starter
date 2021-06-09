import { IUser } from "../common/types/interfaces";
import User from "../models/user";
import Controller from "./base";

const controller = Controller<IUser>({
  objectTitle: "User",
  createBodyFields: ["name", "email", "password"],
  updateBodyFields: ["name"],
  Model: User,
});

export default controller;
