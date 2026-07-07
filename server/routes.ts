import type { Express } from "express";
import { db } from "../db";
import { datums, objects } from "@db/schema";
import { eq } from "drizzle-orm";
import { calculateAbsoluteOffset } from "./utils";

export function registerRoutes(app: Express) {
  app.get("/api/datums", async (req, res) => {
    try {
      const result = await db.select().from(datums);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch datums" });
    }
  });

  app.post("/api/datums", async (req, res) => {
    try {
      const result = await db.insert(datums).values(req.body).returning();
      res.json(Array.isArray(result) ? result[0] : result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create datum" });
    }
  });

  app.put("/api/datums/:id", async (req, res) => {
    try {
      const result = await db
        .update(datums)
        .set({
          name: req.body.name,
          isAbsolute: req.body.isAbsolute,
          zOffset: req.body.zOffset,
          parentId: req.body.parentId
        })
        .where(eq(datums.id, parseInt(req.params.id)))
        .returning();
      
      res.json(Array.isArray(result) ? result[0] : result);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: "Failed to update datum" });
    }
  });

  app.delete("/api/datums/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Find child datums that reference this datum
      const childDatums = await db
        .select()
        .from(datums)
        .where(eq(datums.parentId, id));

      // Update each child datum to be absolute with current absolute position
      for (const child of childDatums) {
        const absolutePosition = calculateAbsoluteOffset(child, await db.select().from(datums));
        await db
          .update(datums)
          .set({
            isAbsolute: true,
            zOffset: absolutePosition.toString(),
            parentId: null
          })
          .where(eq(datums.id, child.id));
      }

      // Now safe to delete the datum
      await db
        .delete(datums)
        .where(eq(datums.id, parseInt(req.params.id)));
      res.status(204).send();
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: "Failed to delete datum" });
    }
  });

  // Object CRUD operations
  app.get("/api/objects", async (req, res) => {
    try {
      const result = await db.select().from(objects);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch objects" });
    }
  });

  app.post("/api/objects", async (req, res) => {
    try {
      const result = await db.insert(objects).values(req.body).returning();
      res.json(Array.isArray(result) ? result[0] : result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create object" });
    }
  });

  app.put("/api/objects/:id", async (req, res) => {
    try {
      const result = await db
        .update(objects)
        .set(req.body)
        .where(eq(objects.id, parseInt(req.params.id)))
        .returning();
      
      res.json(Array.isArray(result) ? result[0] : result);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: "Failed to update object" });
    }
  });

  app.delete("/api/objects/:id", async (req, res) => {
    try {
      await db.delete(objects).where(eq(objects.id, parseInt(req.params.id)));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete object" });
    }
  });
}
