---
to: src/routes/<%= name.toLowerCase() %>.ts
---

import express from "express";
import controller from "../controllers/<%= name.toLowerCase() %>";
const router = express.Router();

router.route("/").get(controller.getMultiple).post(controller.create);

router
  .route("/:id")
  .get(controller.get)
  .put(controller.update)
  .delete(controller.delete);

  export default router;