---
argument-hint: [issue-description]
description: Systematically debug an issue
---

Debug this issue: $ARGUMENTS

## Debugging Process

### Step 1: Understand the Problem
- What is the expected behavior?
- What is the actual behavior?
- When did this start happening?
- Can you reproduce it consistently?

### Step 2: Gather Information
- Check for error messages in console/terminal
- Review recent changes to related files
- Identify the code path involved

### Step 3: Form Hypotheses
- List possible causes (most likely first)
- Identify which files/functions to investigate

### Step 4: Investigate
- Read the relevant code
- Add logging if needed to trace execution
- Check for edge cases and null/undefined handling

### Step 5: Fix
- Make the minimal change needed to fix the issue
- Ensure the fix doesn't introduce regressions

### Step 6: Verify
- Confirm the original issue is resolved
- Run type checking: `pnpm tsc --noEmit`
- Run any relevant tests

## Instructions

Work through each step methodically. Ask clarifying questions if the issue description is unclear. Show your reasoning at each step.
