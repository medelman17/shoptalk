---
name: react-component-standards
description: React component standards for this codebase. Auto-applies when creating React components, reviewing component code, adding TypeScript props, or working with Tailwind CSS styling and shadcn/ui patterns.
---

# React Component Standards

## File Organization

```
src/components/
├── ui/              # Base UI primitives (shadcn pattern)
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
└── ai-elements/     # AI-specific visualizations
    ├── message.tsx
    ├── artifact.tsx
    └── reasoning.tsx
```

## Component Template

### Basic Component
```tsx
import { cn } from "@/lib/utils";

interface ComponentNameProps {
  className?: string;
  children?: React.ReactNode;
}

export function ComponentName({ className, children }: ComponentNameProps) {
  return (
    <div className={cn("base-styles-here", className)}>
      {children}
    </div>
  );
}
```

### Component with Variants (cva)
```tsx
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

## Styling Rules

### Always Use
- `cn()` from `@/lib/utils` for class merging
- Tailwind CSS utilities (no inline styles)
- CSS variables for theming (`--background`, `--foreground`, etc.)

### Never Use
- Inline styles (`style={{}}`)
- CSS modules
- Hardcoded colors (use CSS variables)

### Class Naming with cn()
```tsx
// Good
<div className={cn("flex items-center gap-2", isActive && "bg-accent", className)} />

// Bad
<div className={`flex items-center gap-2 ${isActive ? "bg-accent" : ""} ${className}`} />
```

## TypeScript Patterns

### Props Interface
```tsx
interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
```

### Extending HTML Elements
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline";
  isLoading?: boolean;
}
```

### Forwarding Refs
```tsx
import { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("...", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
```

## Server vs Client Components

### Default to Server Components
```tsx
// No directive needed - server component by default
export function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>;
}
```

### Use Client When Needed
```tsx
"use client";

import { useState } from "react";

export function InteractiveCard() {
  const [isOpen, setIsOpen] = useState(false);
  return <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>;
}
```

## Radix UI Integration

Components in `ui/` use Radix UI primitives:

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = forwardRef<...>(({ className, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="..." />
    <DialogPrimitive.Content
      ref={ref}
      className={cn("...", className)}
      {...props}
    />
  </DialogPrimitive.Portal>
));
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ChatMessage`, `ArtifactViewer` |
| Props interfaces | PascalCase + Props | `ChatMessageProps` |
| Event handlers | handle + Event | `handleClick`, `handleSubmit` |
| Boolean props | is/has/should prefix | `isLoading`, `hasError` |
| Files | kebab-case or same as component | `chat-message.tsx` or `ChatMessage.tsx` |

## Common Patterns

### Composition
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Render Props
```tsx
<Combobox>
  {({ open }) => (
    <ComboboxButton>{open ? "Close" : "Open"}</ComboboxButton>
  )}
</Combobox>
```

### Polymorphic Components
```tsx
interface BoxProps<T extends React.ElementType = "div"> {
  as?: T;
  children: React.ReactNode;
}

function Box<T extends React.ElementType = "div">({
  as,
  ...props
}: BoxProps<T>) {
  const Component = as || "div";
  return <Component {...props} />;
}
```
