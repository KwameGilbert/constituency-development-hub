import { AlertCircle, Check } from "lucide-react";

import { CardHeader, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function YouthStepper({ steps, currentStep, progressValue, status }) {
  return (
    <CardHeader className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{steps[currentStep].title}</span>
        </div>
        <Progress value={progressValue} className="h-2 bg-slate-100" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <div
              key={step.id}
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm transition",
                isCompleted
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : isActive
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-500"
              )}
            >
              <div className="flex items-center gap-2 font-semibold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border text-xs">
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                {step.title}
              </div>
              <p className="mt-2 text-xs text-white/80 sm:text-[0.7rem]">
                {step.blurb}
              </p>
            </div>
          );
        })}
      </div>
      <Separator />
      <CardDescription className="text-sm text-slate-500">
        {steps[currentStep].blurb}
      </CardDescription>
      {status.type && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          )}
        >
          {status.type === "success" ? (
            <Check className="mt-0.5 h-5 w-5" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </CardHeader>
  );
}

export default YouthStepper;
