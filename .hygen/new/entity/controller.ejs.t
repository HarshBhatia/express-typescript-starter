---
to: src/controllers/<%= name.toLowerCase() %>.ts
---

import { I<%= name %> } from "../common/types/interfaces";
import <%= name %> from "../models/<%= name.toLowerCase() %>";
import Controller from "./base";

const controller = Controller<I<%= name %>>({
  objectTitle: "<%= name %>",
  createBodyFields: [],
  updateBodyFields: [],
  Model: <%= name %>,
});

export default controller;
