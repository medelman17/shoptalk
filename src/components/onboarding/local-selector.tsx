"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getAutocompleteSuggestions,
  getLocalByNumber,
  formatLocalDisplay,
  type LocalSearchResult,
} from "@/lib/union";

interface LocalSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Searchable combobox for selecting a Local union number.
 *
 * Features:
 * - Search by Local number, city, or state
 * - Shows suggested popular Locals when empty
 * - Displays Local name and location after selection
 */
export function LocalSelector({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select your Local union...",
  className,
}: LocalSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Get search results based on query
  const searchResults = React.useMemo(() => {
    return getAutocompleteSuggestions(searchQuery, 15);
  }, [searchQuery]);

  // Get display text for selected value
  const selectedLocal = React.useMemo(() => {
    if (!value) return null;
    const localNumber = parseInt(value, 10);
    return getLocalByNumber(localNumber);
  }, [value]);

  const displayText = selectedLocal
    ? formatLocalDisplay(selectedLocal)
    : placeholder;

  const handleSelect = (local: LocalSearchResult) => {
    onValueChange(local.number.toString());
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select Local union"
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {selectedLocal && (
              <MapPin className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate">{displayText}</span>
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by number, city, or state..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              No Local unions found. Try a different search.
            </CommandEmpty>
            <CommandGroup
              heading={searchQuery ? "Search Results" : "Popular Locals"}
            >
              {searchResults.map((local) => (
                <CommandItem
                  key={local.number}
                  value={local.number.toString()}
                  onSelect={() => handleSelect(local)}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Local {local.number}</span>
                    <span className="text-xs text-muted-foreground">
                      {local.city}, {local.state}
                    </span>
                  </div>
                  {value === local.number.toString() && (
                    <Check className="size-4 shrink-0" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
