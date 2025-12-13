import { Sparkles } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FieldErrorText from "./FieldErrorText";
import type { YouthFormInputValues } from "@/lib/youth-form";

type WorkHistoryFieldsProps = {
  register: UseFormRegister<YouthFormInputValues>;
  errors: FieldErrors<YouthFormInputValues>;
  employmentStatus: YouthFormInputValues["employment_status"];
  experienceFields: readonly (keyof YouthFormInputValues)[];
};

function WorkHistoryFields({
  register,
  errors,
  employmentStatus,
  experienceFields,
}: WorkHistoryFieldsProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Sparkles className="h-5 w-5 text-blue-500" /> Work history &
        preferences
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="employment_status">Employment status</Label>
          <select
            id="employment_status"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            {...register("employment_status")}
          >
            <option value="unemployed" className="text-slate-900">
              Unemployed
            </option>
            <option value="employed" className="text-slate-900">
              Employed
            </option>
            <option value="self-employed" className="text-slate-900">
              Self-employed
            </option>
            <option value="student" className="text-slate-900">
              Student
            </option>
          </select>
          <FieldErrorText
            message={errors.employment_status?.message as string | undefined}
          />
        </div>
        <div>
          <Label htmlFor="availability_status">Availability</Label>
          <select
            id="availability_status"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            {...register("availability_status")}
          >
            <option value="available" className="text-slate-900">
              Immediately available
            </option>
            <option value="remote-only" className="text-slate-900">
              Remote only
            </option>
            <option value="not-available" className="text-slate-900">
              Not available
            </option>
          </select>
          <FieldErrorText
            message={errors.availability_status?.message as string | undefined}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="current_employment">
          {employmentStatus === "unemployed"
            ? "Most recent role"
            : "Current role / venture"}
        </Label>
        <Input
          id="current_employment"
          placeholder="Eg. Apprentice welder, Front desk associate"
          {...register("current_employment")}
        />
        <FieldErrorText
          message={errors.current_employment?.message as string | undefined}
        />
      </div>

      <div className="grid gap-3">
        {experienceFields.map((field, index) => (
          <div key={field as string}>
            <Label htmlFor={field as string}>{`Experience ${index + 1}`}</Label>
            <Textarea
              id={field as string}
              rows={2}
              placeholder="Share projects, apprenticeships or informal work"
              {...register(field)}
            />
            <FieldErrorText
              message={errors[field]?.message as string | undefined}
            />
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="employment_notes">Additional notes</Label>
        <Textarea
          id="employment_notes"
          rows={3}
          placeholder="Describe volunteer work, leadership roles or anything unique"
          {...register("employment_notes")}
        />
        <FieldErrorText
          message={errors.employment_notes?.message as string | undefined}
        />
      </div>
    </section>
  );
}

export default WorkHistoryFields;
