import { z } from "zod";

const optionalText = (max = 160) =>
  z
    .preprocess((val) => {
      if (typeof val === "string" && val.trim() === "") {
        return undefined;
      }
      return val;
    }, z.string().max(max).optional())
    .optional()
    .default("");

export const youthFormSchema = z.object({
  name: z.string().min(3, "Full name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  national_id: z.string().min(5, "Provide a valid national ID"),
  home_town: z.string().min(2, "Home town is required"),
  residential_community: z.string().min(2, "Residential community is required"),
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s]+$/, "Use digits only"),
  jhs_completed: z.boolean(),
  shs_qualification: optionalText(),
  certificate_qualification: optionalText(),
  diploma_qualification: optionalText(),
  first_degree: optionalText(),
  postgraduate_qualification: optionalText(),
  professional_qualification: optionalText(),
  work_experience_1: optionalText(200),
  work_experience_2: optionalText(200),
  work_experience_3: optionalText(200),
  work_experience_4: optionalText(200),
  employment_status: z.enum([
    "unemployed",
    "employed",
    "self-employed",
    "student",
  ]),
  current_employment: optionalText(),
  employment_notes: optionalText(300),
  skills: z
    .string()
    .min(3, "List at least one skill")
    .max(280, "Keep it under 280 characters"),
  interests: z
    .string()
    .min(3, "Tell us about your interests")
    .max(280, "Keep it under 280 characters"),
  availability_status: z.enum(["available", "not-available", "remote-only"]),
  preferred_work_location: optionalText(),
  salary_expectation: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => value === "" || !Number.isNaN(Number(value)),
      "Enter a valid number",
    ),
});

export type YouthFormInputValues = z.input<typeof youthFormSchema>;
export type YouthFormValues = z.output<typeof youthFormSchema>;

export const YOUTH_EXPERIENCE_FIELDS = [
  "work_experience_1",
  "work_experience_2",
  "work_experience_3",
  "work_experience_4",
] as const satisfies ReadonlyArray<keyof YouthFormInputValues>;

export const youthDefaultValues: YouthFormInputValues = {
  name: "",
  date_of_birth: "",
  national_id: "",
  home_town: "",
  residential_community: "",
  phone_number: "",
  jhs_completed: false,
  shs_qualification: "",
  certificate_qualification: "",
  diploma_qualification: "",
  first_degree: "",
  postgraduate_qualification: "",
  professional_qualification: "",
  work_experience_1: "",
  work_experience_2: "",
  work_experience_3: "",
  work_experience_4: "",
  employment_status: "unemployed",
  current_employment: "",
  employment_notes: "",
  skills: "",
  interests: "",
  availability_status: "available",
  preferred_work_location: "",
  salary_expectation: "",
};

export const formatYouthPayload = (values: YouthFormValues) => ({
  ...values,
  jhs_completed: values.jhs_completed ? 1 : 0,
  salary_expectation:
    values.salary_expectation && values.salary_expectation !== ""
      ? parseFloat(values.salary_expectation)
      : null,
  work_experience_5: "",
  work_experience_6: "",
  status: "pending",
});
