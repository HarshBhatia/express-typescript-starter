---
to: src/models/<%= name.toLowerCase() %>.ts
---

import shortid from "shortid";
import mongoose, { Model, Schema } from "mongoose";
import mongooseIntl from "mongoose-intl";
import mongooseSlugPlugin from "mongoose-slug-plugin";

import { I<%= name %> } from "../common/types/interfaces";

export const schema = new Schema(
  {
    id: { type: String, default: shortid.generate },
  },
  {
    id: false,
    skipVersioning: { state: true, updatedAt: true },
    timestamps: { createdAt: "dateCreated", updatedAt: "dateUpdated" },
    useNestedStrict: true,
    strict: true,
    toJSON: { virtuals: true },
  }
);

schema.plugin(mongooseSlugPlugin, { tmpl: "<%=name%>" });

schema.plugin(mongooseIntl, {
  languages: ["en", "hi"],
  defaultLanguage: "en",
});

export default mongoose.model("<%= name %>", schema) as Model<I<%= name %>>;
