"use client";

import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import HeroPanel from "@/components/youth/registration/HeroPanel";
import PersonalProfileFields from "@/components/youth/registration/PersonalProfileFields";
import EducationReadinessFields from "@/components/youth/registration/EducationReadinessFields";
import WorkHistoryFields from "@/components/youth/registration/WorkHistoryFields";
import SkillsFocusFields from "@/components/youth/registration/SkillsFocusFields";
import ServerStatusAlert from "@/components/youth/registration/ServerStatusAlert";
import type { SubmissionStatus } from "@/components/youth/registration/types";
import {
  YOUTH_EXPERIENCE_FIELDS,
  formatYouthPayload,
  youthDefaultValues,
  youthFormSchema,
  type YouthFormInputValues,
  type YouthFormValues,
} from "@/lib/youth-form";

type ViteEnv = {
  VITE_PUBLIC_API_BASE_URL?: string;
  VITE_PUBLIC_API_TOKEN?: string;
};

const getImportMetaEnv = (): ViteEnv => {
  try {
    return (import.meta as unknown as { env?: ViteEnv })?.env ?? {};
  } catch {
    return {};
  }
};

const importMetaEnv = getImportMetaEnv();

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  importMetaEnv.VITE_PUBLIC_API_BASE_URL ||
  "";
const API_TOKEN =
  process.env.NEXT_PUBLIC_API_TOKEN ||
  importMetaEnv.VITE_PUBLIC_API_TOKEN ||
  "";

const highlightStats = [
  { value: "8,500+", label: "Youth registered" },
  { value: "320", label: "Placements in 2025" },
  { value: "140", label: "Partner employers" },
  { value: "48", label: "Communities served" },
];

const focusTracks = [
  "Digital & Creative",
  "Skilled Trades",
  "Community Health",
  "Entrepreneurship",
];

type StepField = keyof YouthFormInputValues;

const personalStepFields: StepField[] = [
  "name",
  "phone_number",
  "date_of_birth",
  "national_id",
  "home_town",
  "residential_community",
];

const educationStepFields: StepField[] = [
  "shs_qualification",
  "certificate_qualification",
  "diploma_qualification",
  "first_degree",
  "postgraduate_qualification",
  "professional_qualification",
  "jhs_completed",
  "salary_expectation",
];

const workStepFields: StepField[] = [
  "employment_status",
  "availability_status",
  "current_employment",
  ...YOUTH_EXPERIENCE_FIELDS,
  "employment_notes",
];

const skillsStepFields: StepField[] = [
  "skills",
  "interests",
  "preferred_work_location",
];

export default function YouthClient() {
  const [serverStatus, setServerStatus] = useState<SubmissionStatus>({
    type: null,
    message: "",
  });
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<YouthFormInputValues, undefined, YouthFormValues>({
    resolver: zodResolver<YouthFormInputValues, undefined, YouthFormValues>(
      youthFormSchema,
    ),
    defaultValues: youthDefaultValues,
    mode: "onBlur",
  });

  const employmentStatus = watch("employment_status");

  const heroVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    }),
    [],
  );

  const formSteps = [
    {
      id: "personal",
      label: "Personal info",
      description: "Confirm your identity and contacts",
      fields: personalStepFields,
      content: <PersonalProfileFields register={register} errors={errors} />,
    },
    {
      id: "education",
      label: "Education",
      description: "Tell us your academic milestones",
      fields: educationStepFields,
      content: <EducationReadinessFields register={register} errors={errors} />,
    },
    {
      id: "work",
      label: "Experience",
      description: "Share roles and availability",
      fields: workStepFields,
      content: (
        <WorkHistoryFields
          register={register}
          errors={errors}
          employmentStatus={employmentStatus}
          experienceFields={YOUTH_EXPERIENCE_FIELDS}
        />
      ),
    },
    {
      id: "skills",
      label: "Skills & focus",
      description: "Highlight strengths and preferred placements",
      fields: skillsStepFields,
      content: <SkillsFocusFields register={register} errors={errors} />,
    },
  ];

  const stepProgress = Math.round(((currentStep + 1) / formSteps.length) * 100);
  const isLastStep = currentStep === formSteps.length - 1;

  const handleNextStep = async () => {
    const isValid = await trigger(formSteps[currentStep].fields);
    if (!isValid) return;
    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepSelect = (index: number) => {
    if (index > currentStep) return;
    setCurrentStep(index);
  };

  const onSubmit: SubmitHandler<YouthFormValues> = async (values) => {
    setServerStatus({ type: null, message: "" });
    const endpoint = `${API_BASE_URL}/youth/register`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        },
        body: JSON.stringify(formatYouthPayload(values)),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "We could not save your details.");
      }

      reset(youthDefaultValues);
      setCurrentStep(0);
      setServerStatus({
        type: "success",
        message:
          "Submission received. Our employment desk will reach out with opportunities that match you.",
      });
    } catch (error) {
      setServerStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-amber-200/40 blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-cyan-200/40 blur-[150px]" />
      </div>

      <main className="relative mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full">
          <HeroPanel
            stats={highlightStats}
            tracks={focusTracks}
            variants={heroVariants}
          />
        </div>

        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-2xl"
        >
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Youth registration card
                </p>
                <p className="text-xs">Guided flow with real-time validation</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Step {currentStep + 1} of {formSteps.length}
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {formSteps[currentStep].label}
                </p>
                <p className="text-sm text-slate-500">
                  {formSteps[currentStep].description}
                </p>
              </div>
              <p className="text-sm font-semibold text-emerald-600">
                {stepProgress}% complete
              </p>
            </div>
          </div>

          <div className="relative h-2 w-full rounded-full bg-slate-100 my-58">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-400"
              style={{ width: `${stepProgress}%` }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {formSteps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepSelect(index)}
                disabled={index > currentStep}
                className={`rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
                  index === currentStep
                    ? "border-emerald-400 bg-emerald-50 text-slate-900"
                    : index < currentStep
                      ? "border-slate-200 bg-white text-slate-700"
                      : "border-slate-100 bg-slate-50 text-slate-400"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide">
                  Step {index + 1}
                </p>
                <p className="text-sm font-medium">{step.label}</p>
                <p className="text-xs text-slate-500">{step.description}</p>
              </button>
            ))}
          </div>
        </motion.section>

        <ServerStatusAlert status={serverStatus} />

        <form
          className="w-full space-y-8"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-6">{formSteps[currentStep].content}</div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              By submitting you consent to follow-up via SMS, call or email.
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-slate-200"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              )}
              {isLastStep ? (
                <Button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      Submit registration <CheckCircle2 className="h-5 w-5" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-white hover:bg-sky-400"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
