import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function PersonalStep({ formData, errors, onFieldChange }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <Label htmlFor="name" className="required-field">
          Full name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(event) => onFieldChange("name", event.target.value)}
          placeholder="Ama Mensima"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <Label htmlFor="date_of_birth" className="required-field">
          Date of birth
        </Label>
        <Input
          id="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={(event) =>
            onFieldChange("date_of_birth", event.target.value)
          }
          aria-invalid={Boolean(errors.date_of_birth)}
          aria-describedby={
            errors.date_of_birth ? "date_of_birth-error" : undefined
          }
        />
        {errors.date_of_birth && (
          <p id="date_of_birth-error" className="mt-1 text-sm text-red-600">
            {errors.date_of_birth}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <Label htmlFor="national_id" className="required-field">
          National ID number
        </Label>
        <Input
          id="national_id"
          value={formData.national_id}
          onChange={(event) => onFieldChange("national_id", event.target.value)}
          placeholder="GHA-1234567890"
          aria-invalid={Boolean(errors.national_id)}
          aria-describedby={
            errors.national_id ? "national_id-error" : undefined
          }
        />
        {errors.national_id && (
          <p id="national_id-error" className="mt-1 text-sm text-red-600">
            {errors.national_id}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <Label htmlFor="phone_number" className="required-field">
          Phone number
        </Label>
        <Input
          id="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={(event) =>
            onFieldChange("phone_number", event.target.value)
          }
          placeholder="020 000 0000"
          aria-invalid={Boolean(errors.phone_number)}
          aria-describedby={
            errors.phone_number ? "phone_number-error" : undefined
          }
        />
        {errors.phone_number && (
          <p id="phone_number-error" className="mt-1 text-sm text-red-600">
            {errors.phone_number}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <Label htmlFor="home_town" className="required-field">
          Home town
        </Label>
        <Input
          id="home_town"
          value={formData.home_town}
          onChange={(event) => onFieldChange("home_town", event.target.value)}
          placeholder="Sefwi Wiawso"
          aria-invalid={Boolean(errors.home_town)}
          aria-describedby={errors.home_town ? "home_town-error" : undefined}
        />
        {errors.home_town && (
          <p id="home_town-error" className="mt-1 text-sm text-red-600">
            {errors.home_town}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <Label htmlFor="residential_community" className="required-field">
          Residential community
        </Label>
        <Input
          id="residential_community"
          value={formData.residential_community}
          onChange={(event) =>
            onFieldChange("residential_community", event.target.value)
          }
          placeholder="New Town"
          aria-invalid={Boolean(errors.residential_community)}
          aria-describedby={
            errors.residential_community
              ? "residential_community-error"
              : undefined
          }
        />
        {errors.residential_community && (
          <p
            id="residential_community-error"
            className="mt-1 text-sm text-red-600"
          >
            {errors.residential_community}
          </p>
        )}
      </div>
    </div>
  );
}

function EducationStep({ formData, onFieldChange }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900">
        <p>Share only the stages you have completed. Leave the rest empty.</p>
      </div>
      <label className="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Input
          type="checkbox"
          checked={formData.jhs_completed}
          onChange={(event) =>
            onFieldChange("jhs_completed", event.target.checked)
          }
          className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
        />
        <span className="text-sm text-slate-700">
          I completed Junior High School (JHS)
        </span>
      </label>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="shs_qualification">SHS qualification</Label>
          <Input
            id="shs_qualification"
            value={formData.shs_qualification}
            onChange={(event) =>
              onFieldChange("shs_qualification", event.target.value)
            }
            placeholder="General Arts, Science, etc."
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="certificate_qualification">Certificate</Label>
          <Input
            id="certificate_qualification"
            value={formData.certificate_qualification}
            onChange={(event) =>
              onFieldChange("certificate_qualification", event.target.value)
            }
            placeholder="Certificate in Computer Science"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="diploma_qualification">Diploma</Label>
          <Input
            id="diploma_qualification"
            value={formData.diploma_qualification}
            onChange={(event) =>
              onFieldChange("diploma_qualification", event.target.value)
            }
            placeholder="Diploma in Business Administration"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="first_degree">First degree</Label>
          <Input
            id="first_degree"
            value={formData.first_degree}
            onChange={(event) =>
              onFieldChange("first_degree", event.target.value)
            }
            placeholder="BSc Computer Science"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="postgraduate_qualification">Postgraduate</Label>
          <Input
            id="postgraduate_qualification"
            value={formData.postgraduate_qualification}
            onChange={(event) =>
              onFieldChange("postgraduate_qualification", event.target.value)
            }
            placeholder="MBA, MSc, etc."
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="professional_qualification">Professional</Label>
          <Input
            id="professional_qualification"
            value={formData.professional_qualification}
            onChange={(event) =>
              onFieldChange("professional_qualification", event.target.value)
            }
            placeholder="ACCA, CIM, etc."
          />
        </div>
      </div>
    </div>
  );
}

function WorkStep({ formData, onFieldChange, experienceFields }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* TODO: change the normal select to shadcn select components */}
        <div className="space-y-3">
          <Label htmlFor="employment_status">Employment status</Label>
          <select
            id="employment_status"
            value={formData.employment_status}
            onChange={(event) =>
              onFieldChange("employment_status", event.target.value)
            }
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <option value="unemployed">Unemployed</option>
            <option value="employed">Employed</option>
            <option value="self_employed">Self employed</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div className="space-y-3">
          <Label htmlFor="availability_status">Availability</Label>
          <select
            id="availability_status"
            value={formData.availability_status}
            onChange={(event) =>
              onFieldChange("availability_status", event.target.value)
            }
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <option value="available">Available for work</option>
            <option value="part_time">Available part-time</option>
            <option value="unavailable">Not available right now</option>
          </select>
        </div>
        <div className="space-y-3">
          <Label htmlFor="current_employment">Current role (if any)</Label>
          <Input
            id="current_employment"
            value={formData.current_employment}
            onChange={(event) =>
              onFieldChange("current_employment", event.target.value)
            }
            placeholder="e.g. Teacher at ABC School"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="preferred_work_location">Preferred location</Label>
          <Input
            id="preferred_work_location"
            value={formData.preferred_work_location}
            onChange={(event) =>
              onFieldChange("preferred_work_location", event.target.value)
            }
            placeholder="Within constituency, Accra, etc."
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="salary_expectation">Salary expectation (GHS)</Label>
          <Input
            id="salary_expectation"
            type="number"
            min="0"
            step="0.01"
            value={formData.salary_expectation}
            onChange={(event) =>
              onFieldChange("salary_expectation", event.target.value)
            }
            placeholder="Monthly amount"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Work experience snapshots
          </h3>
          <span className="text-xs text-slate-500">
            Optional · up to 6 entries
          </span>
        </div>
        <div className="grid gap-4">
          {experienceFields.map((field) => (
            <Input
              key={field}
              value={formData[field]}
              onChange={(event) => onFieldChange(field, event.target.value)}
              placeholder="Role · Organisation · Year"
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="employment_notes">Anything else we should know?</Label>
        <Textarea
          id="employment_notes"
          rows={4}
          value={formData.employment_notes}
          onChange={(event) =>
            onFieldChange("employment_notes", event.target.value)
          }
          placeholder="Career goals, relocation limits, training needs, etc."
        />
      </div>
    </div>
  );
}

function SkillsStep({
  formData,
  onFieldChange,
  requiredPersonalFields,
  fieldCopy,
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Textarea
            id="skills"
            rows={4}
            value={formData.skills}
            onChange={(event) => onFieldChange("skills", event.target.value)}
            placeholder="UI design, carpentry, welding, data entry"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="interests">Interests & causes</Label>
          <Textarea
            id="interests"
            rows={4}
            value={formData.interests}
            onChange={(event) => onFieldChange("interests", event.target.value)}
            placeholder="Digital skills training, community health, etc."
          />
        </div>
      </div>

      <Card className="border-slate-200 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Quick review
          </CardTitle>
          <CardDescription>
            Confirm that the essentials look right before you submit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
            {requiredPersonalFields.map((field) => (
              <div
                key={field}
                className="rounded-xl border border-white/60 bg-white px-4 py-3 shadow-sm"
              >
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {fieldCopy[field]}
                </dt>
                <dd className="font-semibold text-slate-900">
                  {formData[field] || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

export { PersonalStep, EducationStep, WorkStep, SkillsStep };
