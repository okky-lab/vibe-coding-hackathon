import { type InferPageType, loader } from "fumadocs-core/source";
import { docs as docsCollection } from "fumadocs-mdx:collections/server";

const docsCollectionSource = docsCollection.toFumadocsSource();

export const docsSource = loader(docsCollectionSource, {
  baseUrl: "/docs",
});

export type DocsSourcePage = InferPageType<typeof docsSource>;
