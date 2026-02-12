declare module "fumadocs-mdx:collections/server" {
  import type { Source } from "fumadocs-core/source";

  type DocsCollection = {
    toFumadocsSource: () => Source;
  };

  type CollectionDoc<T> = T & {
    info: {
      path: string;
    };
  };

  export const docs: DocsCollection;
  export const faqs: Array<
    CollectionDoc<{
      question: string;
      answer: string;
      category?: string;
      order?: number;
    }>
  >;
  export const team: Array<
    CollectionDoc<{
      name: string;
      role: string;
      bio: string;
      contact?: string;
      imageUrl?: string;
      projectName?: string;
      projectSummary?: string;
      projectUrl?: string;
      repositoryUrl?: string;
      demoUrl?: string;
      submittedAt?: string;
      order?: number;
    }>
  >;
}
