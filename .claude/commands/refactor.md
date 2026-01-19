---
argument-hint: [file-or-description]
description: Safely refactor code with verification
---

Refactor: $ARGUMENTS

## Refactoring Process

### Step 1: Understand Current State
- Read and understand the existing code
- Identify what needs to change and why
- Note all usages/references to the code being changed

### Step 2: Plan the Refactor
- Break down into small, atomic changes
- Identify potential breaking changes
- Plan the order of operations

### Step 3: Execute Incrementally
For each change:
1. Make the change
2. Run type check (`pnpm tsc --noEmit`)
3. Verify no regressions
4. Move to next change

### Step 4: Update References
- Find all files that import/use the refactored code
- Update them to match new signatures/patterns
- Run type check after each update

### Step 5: Final Verification
- Full type check passes
- No unused exports or dead code
- Code is cleaner and more maintainable

## Guidelines

- Prefer small, focused changes over large rewrites
- Keep the refactor scope tight - don't fix unrelated issues
- If the refactor grows too large, break it into phases
- Don't change behavior - only structure (unless explicitly requested)

Ask clarifying questions about the goals before starting.
