"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Feather,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const quickFacts = [
  { label: "Hometown", value: "Sefwi Boako, Western North Region" },
  { label: "Date of Birth", value: "February 24, 1980" },
  { label: "Political Party", value: "National Democratic Congress (NDC)" },
  { label: "Religion", value: "Christian" },
];

const educationHistory = [
  {
    institution: "Kwame Nkrumah University of Science and Technology",
    qualification: "MPhil",
    year: "2022",
  },
  { institution: "KNUST", qualification: "MBA", year: "2008" },
  {
    institution: "University of Cape Coast",
    qualification: "BCom",
    year: "2005",
  },
  {
    institution: "Institute of Chartered Accountants, Ghana",
    qualification: "Chartered Accountant",
    year: "2007",
  },
  {
    institution: "Chartered Institute of Taxation, Ghana",
    qualification: "Chartered Tax Advisor",
    year: "2012",
  },
  {
    institution: "Securities & Exchange, Ghana",
    qualification: "Investment Advisor's Rep.",
    year: "2015",
  },
];

const experiences = [
  { role: "Managing Partner", organization: "Masaada Consultants" },
  {
    role: "Director of Finance & Administration",
    organization: "Global Investment Bankers Ltd.",
  },
  {
    role: "Chief Financial Officer",
    organization: "Beige Capital Savings & Loans",
  },
  {
    role: "Facilitator/Lecturer",
    organization: "Kwame Nkrumah University of Science & Technology",
  },
];

const committees = [
  "Business Committee",
  "Environment, Science & Technology Committee",
];

const contactDetails = [
  {
    label: "Parliament House, Accra, Ghana",
    icon: MapPin,
  },
  {
    label: "info@parliament.gh",
    icon: Mail,
  },
  {
    label: "+233 30 263 3030",
    icon: Phone,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50 text-slate-900 transition-colors duration-700">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-12 top-16 h-64 w-64 rounded-full bg-emerald-200/40 blur-[120px]" />
        <div className="absolute -left-12 bottom-10 h-80 w-80 rounded-full bg-amber-200/40 blur-[140px]" />
      </div>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative mx-auto max-w-6xl space-y-14 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6 rounded-3xl border border-white/60 bg-white/85 p-10 shadow-lg backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-amber-100 text-amber-700">
                Coat of Arms
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-700">
                National Democratic Congress (NDC)
              </Badge>
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Hon. Kofi Benteh Afful
            </h1>
            <p className="text-lg text-slate-600">
              Member of Parliament, Sefwi Wiawso
            </p>
            <dl className="grid gap-6 sm:grid-cols-2">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="space-y-1 border-b border-slate-200 pb-4 transition-colors duration-300 hover:border-slate-400"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {fact.label}
                  </dt>
                  <dd className="text-base font-medium text-slate-900">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl border border-white/60 bg-gradient-to-br from-emerald-500/90 to-sky-500/90 p-1 shadow-2xl"
          >
            <div className="h-full rounded-[26px] bg-white/95 p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(16,185,129,0.25)]">
              <div className="flex items-center gap-3 text-emerald-600">
                <Shield className="h-10 w-10" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Mandate
                  </p>
                  <p className="text-xl font-semibold text-slate-900">
                    Serving since January 2025
                  </p>
                </div>
              </div>
              <p className="mt-4 text-base text-slate-600">
                &ldquo;My duty is to champion accountable governance,
                sustainable development and youth-first policies across Sefwi
                Wiawso.&rdquo;
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="bg-emerald-100/80 text-emerald-700">
                  Transparent governance
                </Badge>
                <Badge className="bg-sky-100/80 text-sky-700">
                  Youth empowerment
                </Badge>
                <Badge className="bg-amber-100/80 text-amber-700">
                  Sustainable growth
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="rounded-3xl border border-white/70 bg-white/90 px-10 py-12 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Biography
            </p>
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <p className="text-lg leading-relaxed text-slate-600">
              Hon. Kofi Benteh Afful was first elected as the Member of
              Parliament for Sefwi Wiawso in the December 2024 elections, taking
              office January 2025. Before entering politics, he built a
              distinguished career as a Chartered Accountant and Tax Advisor,
              serving in leadership roles across consulting firms, financial
              institutions, and academia. He is committed to sustainable
              development, youth empowerment, and ensuring transparent
              governance in his constituency.
            </p>
            <div className="space-y-4 rounded-2xl border border-slate-100/80 bg-white/70 p-6 transition-all duration-500 hover:border-emerald-100 hover:shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Current Priorities
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Accelerate youth employment pathways across the constituency.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Expand transparent, digital-first public services.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Protect natural resources through sustainable policy.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-sky-500" />
              <h2 className="text-2xl font-semibold">
                Education & Qualifications
              </h2>
            </div>
            <div className="mt-6 divide-y divide-slate-100 text-sm text-slate-600">
              {educationHistory.map((item) => (
                <div
                  key={`${item.institution}-${item.year}`}
                  className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_80px]"
                >
                  <p className="font-semibold text-slate-900">
                    {item.institution}
                  </p>
                  <p>{item.qualification}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                    {item.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-emerald-500" />
              <h2 className="text-2xl font-semibold">
                Professional Experience
              </h2>
            </div>
            <ol className="mt-6 space-y-6 border-l border-slate-200 pl-6">
              {experiences.map((experience) => (
                <li
                  key={experience.role}
                  className="relative pl-4 transition-transform duration-300 hover:translate-x-1"
                >
                  <span className="absolute -left-[34px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-emerald-500 bg-white" />
                  <p className="text-base font-semibold text-slate-900">
                    {experience.role}
                  </p>
                  <p className="text-sm text-slate-600">
                    {experience.organization}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-500" />
              <h2 className="text-2xl font-semibold">
                Parliamentary Committees
              </h2>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {committees.map((committee) => (
                <li
                  key={committee}
                  className="flex items-center gap-3 border-b border-slate-100 pb-3 transition-colors duration-300 hover:border-slate-300 last:border-none"
                >
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  <p className="font-semibold text-slate-900">{committee}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-900/10 bg-slate-900 text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(15,23,42,0.65)]">
            <div className="space-y-6 p-8">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-emerald-300" />
                <h2 className="text-2xl font-semibold">Get in Touch</h2>
              </div>
              <p className="text-base text-slate-200">
                Engage the parliamentary office for constituency matters, policy
                briefs, or collaborative initiatives. We respond within two
                business days.
              </p>
              <div className="space-y-4">
                {contactDetails.map(({ label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-white/90">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-white/60 bg-white/85 px-10 py-12 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Feather className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Commitment
            </p>
          </div>
          <p className="mt-4 text-lg text-slate-600">
            &ldquo;We are building a development agenda that is people-centered,
            fiscally responsible, and deeply rooted in the aspirations of the
            Western North Region. Every initiative is designed to reduce
            cognitive overload for citizens by making public services simpler,
            clearer, and more accessible.&rdquo;
          </p>
        </motion.section>
      </motion.section>
    </div>
  );
}
