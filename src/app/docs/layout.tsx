import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { Node as PageTreeNode, Root as PageTreeRoot } from "fumadocs-core/page-tree";
import Image from "next/image";

import { docsSource } from "@/lib/docs-source";

const VIBE_CODING_SECTION_NAME = "바이브 코딩 결과";
const VIBE_CODING_LIST_NAME = "바이브 코딩 목록";
const VIBE_CODING_LIST_URL = "/team";

function injectVibeCodingShortcut(children: PageTreeNode[]): PageTreeNode[] {
  const result: PageTreeNode[] = [];

  for (const child of children) {
    if (child.type === "folder") {
      const folderNode: PageTreeNode = {
        ...child,
        children: injectVibeCodingShortcut(child.children),
      };

      const isVibeCodingFolder = typeof child.name === "string" && child.name === VIBE_CODING_SECTION_NAME;
      if (isVibeCodingFolder) {
        result.push({ type: "separator" });
        result.push({
          type: "page",
          name: VIBE_CODING_LIST_NAME,
          url: VIBE_CODING_LIST_URL,
        });
      }

      result.push(folderNode);
      continue;
    }

    result.push({ ...child });
  }

  return result;
}

function createSidebarTree(root: PageTreeRoot): PageTreeRoot {
  const nextRoot: PageTreeRoot = {
    ...root,
    children: injectVibeCodingShortcut(root.children),
  };

  if (root.fallback) {
    nextRoot.fallback = createSidebarTree(root.fallback);
  }

  return nextRoot;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const tree = createSidebarTree(docsSource.getPageTree());

  return (
    <DocsLayout
      tree={tree}
      sidebar={{
        enabled: true,
        defaultOpenLevel: 2,
        collapsible: true,
      }}
      nav={{
        enabled: false,
        title: (
          <span className="inline-flex items-center" aria-label="홈으로 이동">
            <Image
              src="/okky-logo.png"
              alt="OKKY 로고"
              width={28}
              height={28}
              className="rounded-sm object-contain"
              priority
            />
          </span>
        ),
      }}
      containerProps={{ className: "docs-no-hover bg-background [--fd-header-height:0px]" }}
    >
      {children}
    </DocsLayout>
  );
}
