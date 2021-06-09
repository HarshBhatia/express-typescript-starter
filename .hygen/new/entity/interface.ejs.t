---
inject: true
to: src/common/types/interfaces.ts
append: true
---


export interface I<%= name %> extends mongoose.Document {
  id?: string;
}
