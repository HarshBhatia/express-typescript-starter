import { Request, Response } from "express";

export default function (req: Request, res: Response) {
  res.status(404).json({ message: "This route does not exist" });
}
