import { Target } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldErrorText from "./FieldErrorText";
import type { YouthFormInputValues } from "@/lib/youth-form";

const educationFields: Array<{
  id: string;
  name: keyof YouthFormInputValues;
  label: string;
  placeholder: string;
}> = [
  {
    id: "shs_qualification",
    name: "shs_qualification",
    label: "Highest SHS qualification",
    placeholder: "WASSCE, TVET, etc",
  },
  {
    id: "certificate_qualification",
    name: "certificate_qualification",
    label: "Certificate",
    placeholder: "Optional",
  },
  {
    id: "diploma_qualification",
    name: "diploma_qualification",
    label: "Diploma",
    placeholder: "Optional",
  },
  {
    id: "first_degree",
    name: "first_degree",
    label: "First degree",
    placeholder: "Optional",
  },
  {
    id: "postgraduate_qualification",
    name: "postgraduate_qualification",
    label: "Postgraduate",
    placeholder: "Optional",
  },
  {
    id: "professional_qualification",
    name: "professional_qualification",
    label: "Professional cert.",
    placeholder: "Eg. ACCA, CA, NVTI",
  },
];

type EducationReadinessFieldsProps = {
  register: UseFormRegister<YouthFormInputValues>;
  errors: FieldErrors<YouthFormInputValues>;
};

function EducationReadinessFields({
  register,
  errors,
}: EducationReadinessFieldsProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Target className="h-5 w-5 text-emerald-500" /> Education & readiness
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {educationFields.map(({ id, name, label, placeholder }) => (
          <div key={id}>
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} placeholder={placeholder} {...register(name)} />
            <FieldErrorText
              message={errors[name]?.message as string | undefined}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            {...register("jhs_completed")}
          />
          Completed JHS
        </label>
        <label className="flex flex-1 flex-col text-xs text-slate-400 sm:text-sm">
          <span>Salary expectation (GHS)</span>
          <Input
            type="number"
            min={0}
            step="50"
            placeholder="Optional"
            className="mt-1"
            {...register("salary_expectation")}
          />
        </label>
        <FieldErrorText
          message={errors.salary_expectation?.message as string | undefined}
        />
      </div>
    </section>
  );
}

export default EducationReadinessFields;
