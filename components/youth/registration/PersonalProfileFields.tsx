import { Rocket } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldErrorText from "./FieldErrorText";
import type { YouthFormInputValues } from "@/lib/youth-form";

const personalFields: Array<{
  name: keyof YouthFormInputValues;
  label: string;
  placeholder: string;
  type?: string;
  id: string;
}> = [
  {
    id: "name",
    name: "name",
    label: "Full name",
    placeholder: "Ama Yaa Mensah",
  },
  {
    id: "phone",
    name: "phone_number",
    label: "Phone number",
    placeholder: "054 000 1234",
  },
  {
    id: "dob",
    name: "date_of_birth",
    label: "Date of birth",
    placeholder: "",
    type: "date",
  },
  {
    id: "national_id",
    name: "national_id",
    label: "National ID",
    placeholder: "GHA-000000000-0",
  },
  {
    id: "home_town",
    name: "home_town",
    label: "Home town",
    placeholder: "Sefwi Wiawso",
  },
  {
    id: "residential_community",
    name: "residential_community",
    label: "Residential community",
    placeholder: "New Akwaboa",
  },
];

type PersonalProfileFieldsProps = {
  register: UseFormRegister<YouthFormInputValues>;
  errors: FieldErrors<YouthFormInputValues>;
};

function PersonalProfileFields({
  register,
  errors,
}: PersonalProfileFieldsProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Rocket className="h-5 w-5 text-amber-500" /> Personal profile
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {personalFields.map(({ id, name, label, placeholder, type }) => (
          <div key={id} className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              {...register(name)}
            />
            <FieldErrorText
              message={errors[name]?.message as string | undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default PersonalProfileFields;
