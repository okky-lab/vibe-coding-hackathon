"use client";

import * as React from "react";
import { CheckIcon, CopyIcon, TerminalIcon } from "lucide-react";

import { copyToClipboard } from "@/components/docs/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/default/ui/tabs";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/default/ui/tooltip";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export function CodeBlockCommand({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
}: {
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
}) {
  const [packageManager, setPackageManager] = React.useState<PackageManager>("pnpm");
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  const tabs = React.useMemo(
    () => ({
      pnpm: __pnpm__,
      npm: __npm__,
      yarn: __yarn__,
      bun: __bun__,
    }),
    [__npm__, __pnpm__, __yarn__, __bun__],
  );

  const copyCommand = React.useCallback(() => {
    const command = tabs[packageManager];
    if (!command) return;
    copyToClipboard(command);
    setHasCopied(true);
  }, [packageManager, tabs]);

  return (
    <div className="overflow-x-auto">
      <Tabs value={packageManager} className="gap-0" onValueChange={(value) => setPackageManager(value as PackageManager)}>
        <div className="flex items-center gap-2 border-b border-border/50 px-3 py-1">
          <div className="flex size-4 items-center justify-center rounded-[1px] bg-foreground opacity-70">
            <TerminalIcon className="size-3 text-code" />
          </div>
          <TabsList className="rounded-none bg-transparent p-0">
            {Object.keys(tabs).map((key) => (
              <TabsTrigger key={key} value={key}>
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="no-scrollbar overflow-x-auto">
          {Object.entries(tabs).map(([key, value]) => (
            <TabsContent key={key} value={key} className="mt-0 px-4 py-3.5">
              <pre>
                <code className="relative font-mono text-sm leading-none" data-language="bash">
                  {value}
                </code>
              </pre>
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              className="absolute top-2 right-2 z-10 inline-flex size-7 items-center justify-center rounded-md bg-transparent opacity-70 hover:opacity-100 focus-visible:opacity-100"
              onClick={copyCommand}
            >
              <span className="sr-only">Copy</span>
              {hasCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
            </button>
          }
        />
        <TooltipPopup>{hasCopied ? "Copied" : "Copy to Clipboard"}</TooltipPopup>
      </Tooltip>
    </div>
  );
}
