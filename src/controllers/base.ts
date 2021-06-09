import { Request, Response } from "express";
import * as _ from "lodash";
import * as mongoose from "mongoose";
import MongoQS from "mongo-querystring";
import { IControllerConfig } from "../common/types/interfaces";

// query-string parser
const qs = new MongoQS({
  blacklist: {
    page: true,
    size: true,
    sortBy: true,
    orderBy: true,
    fields: true,
  },
});

const { PAGE_SIZE = "10" } = process.env;

export default function Controller<T extends mongoose.Document>(
  config: IControllerConfig<T>
) {
  const {
    objectTitle = "Object",
    createBodyFields = ["id"],
    updateBodyFields = ["id"],
    Model,
  } = config;
  return {
    get: async (req: Request, res: Response) => {
      const { id = "" } = req.params;
      if (!id) {
        return res.status(400).json({ message: `Id or slug not provided` });
      }

      // @ts-ignore
      const document: T | null = await Model.findOne({
        $or: [{ id }, { slug: id }],
      });

      if (!document) {
        return res.status(404).json({
          message: `A ${objectTitle} does not exist with the id or slug provided`,
        });
      }
      return res.json(document);
    },

    create: async (req: Request, res: Response) => {
      const document = _.pick(req.body, createBodyFields);

      const result = new Model(document);
      await result.save();

      return res.json({
        message: `${objectTitle} added successfully`,
        id: result.id,
      });
    },

    delete: async (req: Request, res: Response) => {
      const { id = "" } = req.params;
      if (!id) {
        return res.status(400).json({ message: `Id or slug not provided` });
      }

      // @ts-ignore
      const result = await Model.deleteOne({ $or: [{ id }, { slug: id }] });

      if (!result.ok) {
        return res.status(500).json({
          message: `Could not delete ${objectTitle} with id : ${id}.`,
        });
      }

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: `An ${objectTitle} does not exist with the id provided: ${id}`,
        });
      }

      return res.json({ message: `${objectTitle} deleted successfully`, id });
    },

    update: async (req: Request, res: Response) => {
      const { id = "" } = req.params;

      if (!id) {
        return res.status(400).json({ message: `Id or slug not provided` });
      }

      const updates = _.pick(req.body, updateBodyFields);

      const result = await Model.updateOne(
        // @ts-ignore
        { $or: [{ id }, { slug: id }] },
        { $set: { ...updates } }
      );

      if (!result.ok) {
        return res.status(500).json({
          message: `Could not delete ${objectTitle} with id : ${id}.`,
        });
      }

      if (result.nModified === 0) {
        return res.status(404).json({
          message: `An ${objectTitle} does not exist with the id provided: ${id}`,
        });
      }

      return res.json({ message: `${objectTitle} updated successfully`, id });
    },

    getMultiple: async (req: Request, res: Response) => {
      const {
        page = 1,
        size = parseInt(PAGE_SIZE),
        sortBy = "dateUpdated",
        orderBy = "desc",
        fields = "-_id",
      }: any = req.query;

      const query = qs.parse(req.query);
      const count = await Model.countDocuments(query);

      const documents = await Model.find(query, fields.replace(",", " "), {
        skip: (page - 1) * size,
        limit: size,
        sort: { [sortBy]: orderBy === "desc" ? -1 : 1 },
      });

      if (!documents) {
        return res.status(404).json({ message: `No ${objectTitle}(s) found` });
      }

      return res.json({
        data: documents,
        count,
      });
    },
  };
}
