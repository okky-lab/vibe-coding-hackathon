"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/default/ui/tooltip";

export function copyToClipboard(value: string) {
  navigator.clipboard.writeText(value);
}

export function CopyButton({
  value,
  className,
  tooltip = "Copy to Clipboard",
  ...props
}: React.ComponentProps<"button"> & {
  value: string;
  tooltip?: string;
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            data-copied={hasCopied}
            className={`bg-code absolute top-3 right-2 z-10 inline-flex size-7 items-center justify-center rounded-md opacity-70 hover:opacity-100 focus-visible:opacity-100 ${className ?? ""}`}
            onClick={() => {
              copyToClipboard(value);
              setHasCopied(true);
            }}
            {...props}
          >
            <span className="sr-only">Copy</span>
            {hasCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
          </button>
        }
      />
      <TooltipPopup>{hasCopied ? "Copied" : tooltip}</TooltipPopup>
    </Tooltip>
  );
}
