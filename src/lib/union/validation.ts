import { z } from "zod";
import { CLASSIFICATIONS } from "./classifications";
import { isValidLocalNumber } from "./search";

/**
 * Valid classification IDs for schema validation.
 */
const classificationIds = CLASSIFICATIONS.map((c) => c.id) as [string, ...string[]];

/**
 * Zod schema for job classification.
 */
export const classificationSchema = z.enum(classificationIds, {
  message: "Please select a valid job classification",
});

/**
 * Zod schema for Local number.
 * Validates that it's a positive integer and exists in our dataset.
 */
export const localNumberSchema = z
  .string()
  .min(1, "Local number is required")
  .regex(/^\d+$/, "Local number must contain only digits")
  .transform((val) => parseInt(val, 10))
  .refine((num) => num > 0, "Local number must be positive")
  .refine(
    (num) => isValidLocalNumber(num),
    "Please select a valid Local union number"
  );

/**
 * Zod schema for the "Other" classification text field.
 */
export const classificationOtherSchema = z
  .string()
  .max(100, "Classification description must be 100 characters or less")
  .optional();

/**
 * Complete onboarding form schema.
 */
export const onboardingFormSchema = z
  .object({
    localNumber: z
      .string()
      .min(1, "Please select your Local union"),
    classification: classificationSchema,
    classificationOther: classificationOtherSchema,
  })
  .refine(
    (data) => {
      // If classification is "other", require classificationOther text
      if (data.classification === "other") {
        return (
          data.classificationOther !== undefined &&
          data.classificationOther.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Please describe your job classification",
      path: ["classificationOther"],
    }
  );

/**
 * Type for onboarding form data.
 */
export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;

/**
 * Schema for validating the Local number alone (for real-time validation).
 */
export const localSelectionSchema = z.object({
  localNumber: z.string().min(1, "Please select your Local union"),
});

/**
 * Server Action input schema (after form submission).
 * Uses string for localNumber since form data comes as strings.
 */
export const onboardingActionSchema = z.object({
  localNumber: z.string().min(1, "Local number is required"),
  classification: classificationSchema,
  classificationOther: z.string().optional(),
});

export type OnboardingActionInput = z.infer<typeof onboardingActionSchema>;

/**
 * Settings form schema (same fields but for profile updates).
 */
export const settingsFormSchema = onboardingFormSchema;

export type SettingsFormData = z.infer<typeof settingsFormSchema>;

/**
 * Validate onboarding form data and return typed result.
 */
export function validateOnboardingForm(data: unknown): {
  success: boolean;
  data?: OnboardingFormData;
  errors?: z.ZodError;
} {
  const result = onboardingFormSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
