import { pgTable, text, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Define the datums table type first
import type { PgTableWithColumns } from "drizzle-orm/pg-core";

// Define the datums table with self-referential relationship
export const datums: PgTableWithColumns<any> = pgTable("datums", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  isAbsolute: boolean("is_absolute").notNull().default(true),
  zOffset: decimal("z_offset", { precision: 10, scale: 2 }).notNull(),
  parentId: integer("parent_id").references((): any => datums.id),
});

// Define objects table after datums is defined
export const objects = pgTable("objects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  bottomDatumId: integer("bottom_datum_id").references(() => datums.id),
  bottomOffset: decimal("bottom_offset", { precision: 10, scale: 2 }).notNull(),
  topDatumId: integer("top_datum_id").references(() => datums.id),
  topOffset: decimal("top_offset", { precision: 10, scale: 2 }).notNull(),
});

// Schema for datum insert operations
export const insertDatumSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  isAbsolute: z.boolean(),
  zOffset: z.number(),
  parentId: z.number().nullable(),
});

// Schema for datum select operations
export const selectDatumSchema = createSelectSchema(datums);

// Types for TypeScript
export type Datum = InferSelectModel<typeof datums>;
export type InsertDatum = z.infer<typeof insertDatumSchema>;

// Schema for object operations
export const insertObjectSchema = createInsertSchema(objects, {
  bottomOffset: z.string().transform((val) => Number(val)),
  topOffset: z.string().transform((val) => Number(val)),
});

export const selectObjectSchema = createSelectSchema(objects);
export type Object = InferSelectModel<typeof objects>;
export type InsertObject = z.infer<typeof insertObjectSchema>;
