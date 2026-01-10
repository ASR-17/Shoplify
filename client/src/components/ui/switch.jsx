import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
      ref={ref}
      {...props}
      className={cn(
        // Track
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-white/30 shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // States
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-white/20",
        className
      )}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          // Thumb
          "pointer-events-none block h-4 w-4 rounded-full",
          "bg-white shadow-md ring-1 ring-black/20",
          "transition-transform",
          "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  )
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
