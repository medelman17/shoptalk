"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { completeOnboarding } from "@/lib/db/user-profile";
import { onboardingActionSchema, getSupplementIds } from "@/lib/union";

export type OnboardingState = {
  success: boolean;
  errors?: {
    localNumber?: string[];
    classification?: string[];
    classificationOther?: string[];
    _form?: string[];
  };
};

/**
 * Server Action to complete user onboarding.
 *
 * Validates form data, calculates supplement chain, and updates user profile.
 */
export async function submitOnboarding(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  // Get authenticated user
  const clerkId = await requireAuth();

  // Extract form data
  const rawData = {
    localNumber: formData.get("localNumber"),
    classification: formData.get("classification"),
    classificationOther: formData.get("classificationOther"),
  };

  // Validate form data
  const validationResult = onboardingActionSchema.safeParse(rawData);

  if (!validationResult.success) {
    const errors: OnboardingState["errors"] = {};
    for (const issue of validationResult.error.issues) {
      const path = issue.path[0] as keyof NonNullable<OnboardingState["errors"]>;
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path]!.push(issue.message);
    }
    return { success: false, errors };
  }

  const { localNumber, classification, classificationOther } = validationResult.data;

  // Additional validation for "other" classification
  if (classification === "other" && !classificationOther?.trim()) {
    return {
      success: false,
      errors: {
        classificationOther: ["Please describe your job classification"],
      },
    };
  }

  // Calculate supplement IDs from Local number
  const supplementIds = getSupplementIds(parseInt(localNumber, 10));

  // Build classification value (include "other" description if applicable)
  const classificationValue =
    classification === "other" && classificationOther
      ? `other: ${classificationOther.trim()}`
      : classification;

  try {
    // Complete onboarding
    await completeOnboarding(clerkId, {
      local_number: localNumber,
      classification: classificationValue,
      supplement_ids: supplementIds,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return {
      success: false,
      errors: {
        _form: ["Something went wrong. Please try again."],
      },
    };
  }

  // Redirect to main app (must be outside try/catch - redirect() throws)
  redirect("/");
}
