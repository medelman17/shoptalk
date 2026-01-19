"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { updateUserProfile } from "@/lib/db/user-profile";
import { onboardingActionSchema, getSupplementIds } from "@/lib/union";

export type SettingsState = {
  success: boolean;
  message?: string;
  errors?: {
    localNumber?: string[];
    classification?: string[];
    classificationOther?: string[];
    _form?: string[];
  };
};

/**
 * Server Action to update user profile settings.
 *
 * Similar to onboarding but doesn't set onboarding_completed_at
 * and stays on the settings page.
 */
export async function updateSettings(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
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
    const errors: SettingsState["errors"] = {};
    for (const issue of validationResult.error.issues) {
      const path = issue.path[0] as keyof NonNullable<SettingsState["errors"]>;
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
    // Update profile
    await updateUserProfile(clerkId, {
      local_number: localNumber,
      classification: classificationValue,
      supplement_ids: supplementIds,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return {
      success: false,
      errors: {
        _form: ["Something went wrong. Please try again."],
      },
    };
  }

  // Revalidate the settings page (must be outside try/catch - revalidatePath throws)
  revalidatePath("/settings");

  return {
    success: true,
    message: "Your profile has been updated.",
  };
}
