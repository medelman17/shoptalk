"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CLASSIFICATIONS,
  requiresOtherText,
  type Classification,
} from "@/lib/union";

interface ClassificationSelectorProps {
  value?: Classification;
  otherValue?: string;
  onValueChange: (classification: Classification) => void;
  onOtherValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Dropdown selector for job classification.
 *
 * Features:
 * - Shows all UPS Teamster job classifications
 * - Displays description for each option
 * - Shows text input when "Other" is selected
 */
export function ClassificationSelector({
  value,
  otherValue,
  onValueChange,
  onOtherValueChange,
  disabled = false,
  className,
}: ClassificationSelectorProps) {
  const showOtherInput = value && requiresOtherText(value);

  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={(val) => onValueChange(val as Classification)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your job classification..." />
        </SelectTrigger>
        <SelectContent>
          {CLASSIFICATIONS.map((classification) => (
            <SelectItem
              key={classification.id}
              value={classification.id}
              className="flex flex-col items-start py-2"
            >
              <span>{classification.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showOtherInput && (
        <div className="mt-3">
          <Label htmlFor="classification-other" className="text-sm">
            Please describe your job classification
          </Label>
          <Input
            id="classification-other"
            value={otherValue ?? ""}
            onChange={(e) => onOtherValueChange?.(e.target.value)}
            placeholder="Enter your job classification..."
            className="mt-1.5"
            disabled={disabled}
            maxLength={100}
          />
        </div>
      )}
    </div>
  );
}
