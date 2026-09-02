import { defineCollection, defineContentConfig } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: "page",
      source: "projects/**",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        category: z.enum(["video", "blender", "dev"]),
        tags: z.array(z.string()).default([]),
        cover: z.string().optional(),
        featured: z.boolean().default(false),
        role: z.string().optional(),
        links: z
          .array(z.object({ label: z.string(), url: z.string() }))
          .default([]),
      }),
    }),
    blog: defineCollection({
      type: "page",
      source: "blog/**",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        category: z.enum(["life", "javascript", "blender"]),
        tags: z.array(z.string()).default([]),
        pinned: z.boolean().default(false),
        cover: z.string().optional(),
      }),
    }),
  },
});
