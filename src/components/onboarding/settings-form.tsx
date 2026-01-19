"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LocalSelector } from "./local-selector";
import { ClassificationSelector } from "./classification-selector";
import { SupplementDisplay } from "./supplement-display";
import {
  updateSettings,
  type SettingsState,
} from "@/app/(authenticated)/(app)/settings/actions";
import type { Classification } from "@/lib/union";

interface SettingsFormProps {
  /**
   * Initial values from the user's current profile.
   */
  initialValues: {
    localNumber: string;
    classification: string;
  };
}

/**
 * Parse classification value that might contain "other: description".
 */
function parseClassification(value: string): {
  classification: Classification;
  other?: string;
} {
  if (value.startsWith("other:")) {
    return {
      classification: "other",
      other: value.replace("other:", "").trim(),
    };
  }
  return { classification: value as Classification };
}

/**
 * Settings form for updating union profile.
 *
 * Similar to OnboardingForm but:
 * - Uses updateSettings action
 * - Shows success message on save
 * - Doesn't redirect after submission
 */
export function SettingsForm({ initialValues }: SettingsFormProps) {
  // Parse initial classification
  const parsed = parseClassification(initialValues.classification || "");

  // Form state
  const [localNumber, setLocalNumber] = React.useState(
    initialValues.localNumber ?? ""
  );
  const [classification, setClassification] = React.useState<
    Classification | undefined
  >(parsed.classification || undefined);
  const [classificationOther, setClassificationOther] = React.useState(
    parsed.other ?? ""
  );

  // Server Action state
  const initialState: SettingsState = { success: false };
  const [state, formAction, isPending] = useActionState(
    updateSettings,
    initialState
  );

  // Clear success message after a delay
  React.useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        // State will be reset on next form interaction
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  // Check if form has changes
  const hasChanges =
    localNumber !== initialValues.localNumber ||
    classification !== parsed.classification ||
    classificationOther !== (parsed.other ?? "");

  // Check if form is complete
  const isFormComplete =
    localNumber &&
    classification &&
    (classification !== "other" || classificationOther.trim());

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden inputs for form submission */}
      <input type="hidden" name="localNumber" value={localNumber} />
      <input type="hidden" name="classification" value={classification ?? ""} />
      <input
        type="hidden"
        name="classificationOther"
        value={classificationOther}
      />

      {/* Success message */}
      {state.success && state.message && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {state.message}
        </div>
      )}

      {/* Form error */}
      {state.errors?._form && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.errors._form.join(", ")}
        </div>
      )}

      {/* Local Selection */}
      <div className="space-y-2">
        <Label htmlFor="local-selector" className="text-base font-medium">
          Your Local Union
        </Label>
        <LocalSelector
          value={localNumber}
          onValueChange={setLocalNumber}
          disabled={isPending}
        />
        {state.errors?.localNumber && (
          <p className="text-sm text-destructive">
            {state.errors.localNumber.join(", ")}
          </p>
        )}
      </div>

      {/* Supplement Display */}
      <SupplementDisplay localNumber={localNumber} />

      {/* Classification Selection */}
      <div className="space-y-2">
        <Label
          htmlFor="classification-selector"
          className="text-base font-medium"
        >
          Your Job Classification
        </Label>
        <ClassificationSelector
          value={classification}
          otherValue={classificationOther}
          onValueChange={setClassification}
          onOtherValueChange={setClassificationOther}
          disabled={isPending}
        />
        {state.errors?.classification && (
          <p className="text-sm text-destructive">
            {state.errors.classification.join(", ")}
          </p>
        )}
        {state.errors?.classificationOther && (
          <p className="text-sm text-destructive">
            {state.errors.classificationOther.join(", ")}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isPending || !isFormComplete || !hasChanges}
      >
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
