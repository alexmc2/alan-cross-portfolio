// components/ui/input.tsx
import * as React from "react";

import { cn } from "@/lib/utils";

const formFieldBaseClasses =
  "w-full min-w-0 rounded-md border border-input bg-muted text-base text-foreground shadow-none transition-[background-color,border-color,box-shadow,color] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring focus-visible:ring-offset-0 dark:border-input dark:bg-muted/40 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:ring-ring/30 dark:focus-visible:border-ring aria-invalid:border-destructive aria-invalid:outline-destructive/40 aria-invalid:ring-destructive/20 aria-invalid:focus-visible:ring-destructive/30 aria-invalid:focus-visible:border-destructive dark:aria-invalid:border-destructive dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 dark:aria-invalid:focus-visible:ring-destructive/40";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 px-3 py-2 md:text-sm",
        "file:inline-flex file:h-8 file:items-center file:justify-center file:rounded-md file:border-0 file:bg-muted file:px-3 file:text-sm file:font-medium file:text-foreground dark:file:bg-muted/60",
        formFieldBaseClasses,
        className
      )}
      {...props}
    />
  );
}

export { Input, formFieldBaseClasses };
