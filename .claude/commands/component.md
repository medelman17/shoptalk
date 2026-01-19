---
argument-hint: [component-name]
description: Generate a React component with TypeScript and Tailwind
---

Create a new React component: $ARGUMENTS

## Instructions

1. Determine the appropriate location:
   - UI primitives → `src/components/ui/`
   - AI visualizations → `src/components/ai-elements/`
   - Feature components → `src/components/[feature]/`

2. Follow these patterns:
   - Use TypeScript with proper prop interfaces
   - Use `cn()` from `@/lib/utils` for class merging
   - Use `cva` (class-variance-authority) for variants if needed
   - Use Tailwind CSS for styling (no inline styles)
   - Add `"use client"` directive only if needed (interactivity, hooks)

3. Component structure:
   ```tsx
   import { cn } from "@/lib/utils"

   interface ComponentNameProps {
     className?: string
     // ... other props
   }

   export function ComponentName({ className, ...props }: ComponentNameProps) {
     return (
       <div className={cn("base-styles", className)} {...props}>
         {/* content */}
       </div>
     )
   }
   ```

4. If the component needs variants, use cva:
   ```tsx
   import { cva, type VariantProps } from "class-variance-authority"
   ```

Ask clarifying questions about the component's purpose and variants before implementing.
