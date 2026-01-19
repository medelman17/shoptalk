"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LocalSelector } from "./local-selector";
import { ClassificationSelector } from "./classification-selector";
import { SupplementDisplay } from "./supplement-display";
import { submitOnboarding, type OnboardingState } from "@/app/(authenticated)/onboarding/actions";
import type { Classification } from "@/lib/union";

interface OnboardingFormProps {
  /**
   * Initial values for the form (for settings page to edit existing data).
   */
  initialValues?: {
    localNumber?: string;
    classification?: Classification;
    classificationOther?: string;
  };
  /**
   * Whether this is being used in settings (shows different button text).
   */
  isSettings?: boolean;
}

/**
 * Combined onboarding form for Local selection and job classification.
 *
 * Features:
 * - Progressive disclosure: supplements shown after Local selection
 * - Real-time validation feedback
 * - Server Action form submission
 */
export function OnboardingForm({
  initialValues,
  isSettings = false,
}: OnboardingFormProps) {
  // Form state
  const [localNumber, setLocalNumber] = React.useState(
    initialValues?.localNumber ?? ""
  );
  const [classification, setClassification] = React.useState<Classification | undefined>(
    initialValues?.classification
  );
  const [classificationOther, setClassificationOther] = React.useState(
    initialValues?.classificationOther ?? ""
  );

  // Server Action state
  const initialState: OnboardingState = { success: false };
  const [state, formAction, isPending] = useActionState(
    submitOnboarding,
    initialState
  );

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
      <input type="hidden" name="classificationOther" value={classificationOther} />

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
        <p className="text-sm text-muted-foreground">
          Search by Local number, city, or state.
        </p>
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

      {/* Supplement Display - shows after Local selection */}
      <SupplementDisplay localNumber={localNumber} />

      {/* Classification Selection */}
      <div className="space-y-2">
        <Label htmlFor="classification-selector" className="text-base font-medium">
          Your Job Classification
        </Label>
        <p className="text-sm text-muted-foreground">
          Select the classification that best matches your current position.
        </p>
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
        size="lg"
        disabled={isPending || !isFormComplete}
      >
        {isPending
          ? "Saving..."
          : isSettings
          ? "Save Changes"
          : "Complete Setup"}
      </Button>
    </form>
  );
}
