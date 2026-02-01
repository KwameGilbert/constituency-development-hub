import { Sparkles } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FieldErrorText from "./FieldErrorText";
import type { YouthFormInputValues } from "@/lib/youth-form";

type SkillsFocusFieldsProps = {
  register: UseFormRegister<YouthFormInputValues>;
  errors: FieldErrors<YouthFormInputValues>;
};

function SkillsFocusFields({ register, errors }: SkillsFocusFieldsProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Sparkles className="h-5 w-5 text-purple-500" /> Skills & focus
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Key skills</Label>
        <Textarea
          id="skills"
          rows={3}
          placeholder="Product design, cocoa aggregation, solar install, etc"
          {...register("skills")}
        />
        <FieldErrorText
          message={errors.skills?.message as string | undefined}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="interests">Areas you want to grow</Label>
        <Textarea
          id="interests"
          rows={3}
          placeholder="Leadership training, software internships, small business finance..."
          {...register("interests")}
        />
        <FieldErrorText
          message={errors.interests?.message as string | undefined}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferred_work_location">Preferred work location</Label>
        <Input
          id="preferred_work_location"
          placeholder="Eg. Sefwi Wiawso, Accra, Remote"
          {...register("preferred_work_location")}
        />
        <FieldErrorText
          message={
            errors.preferred_work_location?.message as string | undefined
          }
        />
      </div>
    </section>
  );
}

export default SkillsFocusFields;
