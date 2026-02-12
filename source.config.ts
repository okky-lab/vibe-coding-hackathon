import { defineCollections, defineConfig, defineDocs } from "fumadocs-mdx/config";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import remarkMath from "remark-math";
import { z } from "zod";

import { transformers } from "./src/lib/highlight-code";

const docsPageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  summary: z.string().optional(),
  full: z.boolean().optional(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.string().optional(),
  order: z.number().optional(),
});

const teamSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  contact: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const docs = defineDocs({
  dir: "contents/docs",
  docs: {
    async: true,
    files: ["**/*.{md,mdx}"],
    schema: docsPageSchema,
  },
  meta: {
    files: ["**/meta.json"],
  },
});

export const faqs = defineCollections({
  type: "doc",
  dir: "contents/faqs",
  files: ["**/*.{md,mdx}"],
  schema: faqSchema,
});

export const team = defineCollections({
  type: "doc",
  dir: "contents/team",
  files: ["**/*.{md,mdx}"],
  schema: teamSchema,
});

export default defineConfig({
  mdxOptions: {
    rehypePlugins: [
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          transformers,
        },
      ],
    ],
    remarkPlugins: [remarkMath],
    remarkImageOptions: false,
    rehypeCodeOptions: false,
  },
});
