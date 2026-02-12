import defaultMdxComponents from "fumadocs-ui/mdx";
import { BracesIcon, FileCode2Icon, TerminalIcon } from "lucide-react";
import type { MDXComponents } from "mdx/types";

import { CodeBlockCommand } from "@/components/docs/code-block-command";
import { CopyButton } from "@/components/docs/copy-button";
import {
  Alert as ShadAlert,
  AlertDescription as ShadAlertDescription,
  AlertTitle as ShadAlertTitle,
} from "@/components/ui/alert";
import { cn } from "@/lib/cn";

function getLanguageIcon(language?: string) {
  if (!language) return <FileCode2Icon className="size-4 opacity-70" />;

  switch (language) {
    case "bash":
    case "shell":
    case "sh":
      return <TerminalIcon className="size-4 opacity-70" />;
    case "json":
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
    case "css":
      return <BracesIcon className="size-4 opacity-70" />;
    default:
      return <FileCode2Icon className="size-4 opacity-70" />;
  }
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
      <h1 className={cn("font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight", className)} {...props} />
    ),
    h2: ({ className, ...props }: React.ComponentProps<"h2">) => (
      <h2
        className={cn(
          "font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+.steps]:mt-0! [&+.steps>h3]:mt-4! [&+h3]:mt-6! [&+p]:mt-4!",
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn(
          "font-heading mt-12 scroll-m-28 text-lg font-normal tracking-tight [&+p]:mt-4! *:[code]:text-xl",
          className,
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
      <h4 className={cn("font-heading mt-8 scroll-m-28 text-base font-medium tracking-tight", className)} {...props} />
    ),
    h5: ({ className, ...props }: React.ComponentProps<"h5">) => (
      <h5 className={cn("mt-8 scroll-m-28 text-base font-medium tracking-tight", className)} {...props} />
    ),
    h6: ({ className, ...props }: React.ComponentProps<"h6">) => (
      <h6 className={cn("mt-8 scroll-m-28 text-base font-medium tracking-tight", className)} {...props} />
    ),
    a: ({ className, ...props }: React.ComponentProps<"a">) => (
      <a className={cn("font-medium underline underline-offset-4", className)} {...props} />
    ),
    p: ({ className, ...props }: React.ComponentProps<"p">) => (
      <p className={cn("leading-relaxed not-first:mt-6", className)} {...props} />
    ),
    strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className={cn("font-medium", className)} {...props} />
    ),
    mark: ({ className, ...props }: React.ComponentProps<"mark">) => (
      <mark
        className={cn("rounded-sm bg-yellow-300/70 px-1 text-foreground dark:bg-yellow-500/35", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
      <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
      <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }: React.ComponentProps<"li">) => <li className={cn("mt-2", className)} {...props} />,
    blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
      <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />
    ),
    Alert: ({ className, ...props }: React.ComponentProps<typeof ShadAlert>) => (
      <ShadAlert className={cn("not-prose my-6", className)} {...props} />
    ),
    AlertTitle: ({ className, ...props }: React.ComponentProps<typeof ShadAlertTitle>) => (
      <ShadAlertTitle className={cn(className)} {...props} />
    ),
    AlertDescription: ({ className, ...props }: React.ComponentProps<typeof ShadAlertDescription>) => (
      <ShadAlertDescription className={cn(className)} {...props} />
    ),
    hr: ({ ...props }: React.ComponentProps<"hr">) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, ...props }: React.ComponentProps<"table">) => (
      <div className="my-6 no-scrollbar w-full overflow-y-auto rounded-lg border">
        <table
          className={cn(
            "relative my-0! w-full overflow-hidden border-none bg-transparent! text-sm [&_tbody_tr:last-child]:border-b-0",
            className,
          )}
          {...props}
        />
      </div>
    ),
    tr: ({ className, ...props }: React.ComponentProps<"tr">) => <tr className={cn("m-0 border-b", className)} {...props} />,
    th: ({ className, ...props }: React.ComponentProps<"th">) => (
      <th
        className={cn(
          "px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.ComponentProps<"td">) => (
      <td
        className={cn(
          "px-4 py-2 text-left whitespace-nowrap [[align=center]]:text-center [[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    figcaption: ({ className, children, ...props }: React.ComponentProps<"figcaption">) => {
      const language =
        "data-language" in props && typeof props["data-language"] === "string" ? props["data-language"] : undefined;

      return (
        <figcaption
          className={cn(
            "flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70",
            className,
          )}
          {...props}
        >
          {getLanguageIcon(language)}
          {children}
        </figcaption>
      );
    },
    pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => (
      <pre
        className={cn(
          "no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-data-highlighted-line:px-0 has-data-line-numbers:px-0 has-data-[slot=tabs]:p-0",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    ),
    figure: ({ className, ...props }: React.ComponentProps<"figure">) => <figure className={cn(className)} {...props} />,
    code: ({
      className,
      __raw__,
      __src__,
      __npm__,
      __yarn__,
      __pnpm__,
      __bun__,
      ...props
    }: React.ComponentProps<"code"> & {
      __raw__?: string;
      __src__?: string;
      __npm__?: string;
      __yarn__?: string;
      __pnpm__?: string;
      __bun__?: string;
    }) => {
      if (typeof props.children === "string") {
        return (
          <code
            className={cn(
              "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] wrap-break-word outline-none",
              className,
            )}
            {...props}
          />
        );
      }

      const isNpmCommand = __npm__ && __yarn__ && __pnpm__ && __bun__;
      if (isNpmCommand) {
        return <CodeBlockCommand __npm__={__npm__} __yarn__={__yarn__} __pnpm__={__pnpm__} __bun__={__bun__} />;
      }

      return (
        <>
          {__raw__ && <CopyButton value={__raw__} data-src={__src__} />}
          <code {...props} />
        </>
      );
    },
  };
}
