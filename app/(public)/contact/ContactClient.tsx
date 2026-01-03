"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactHighlights = [
  {
    title: "Office Address",
    items: [
      "MP&rsquo;s Office, Sefwi Wiawso Municipal Assembly",
      "P.O Box 25, Sefwi Wiawso",
      "Western North Region, Ghana",
      "Ghana Post GPS: WG-0002-7111",
    ],
    icon: MapPin,
  },
  {
    title: "Phone Numbers",
    items: ["Constituency Secretary: (+233) 548 531 963"],
    icon: Phone,
  },
  {
    title: "Email Addresses",
    items: [
      "General Inquiries: info@swma.gov.gh",
      "Constituency Issues: issues@swma.gov.gh",
    ],
    icon: Mail,
  },
  {
    title: "Office Hours",
    items: [
      "Monday – Friday: 8:00 AM – 5:00 PM",
      "Weekends: Closed (Emergencies only)",
    ],
    icon: Clock,
  },
];

const socialLinks = [
  { label: "Facebook", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function ContactClient() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-emerald-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-200/30 blur-[160px]" />
      </div>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Contact Us
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            We&rsquo;re here to listen to your concerns and suggestions
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600">
            Reach out using any of the channels below or send us a quick
            message.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-sm">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
                Contact Information
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Reach out directly through these channels
              </h2>
              <p className="text-base text-slate-600">
                Our constituency team responds within one business day.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {contactHighlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-2xl border border-slate-100 bg-white/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                      <highlight.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {highlight.title}
                    </p>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {highlight.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white/85 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Share2 className="h-5 w-5 text-sky-500" />
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
                  Follow Us
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-900">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-full border border-slate-200 px-4 py-2 transition hover:border-emerald-200 hover:text-emerald-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg"
            >
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
                  Send Us a Message
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Fill out the form and we&rsquo;ll respond soon
                </h2>
              </div>

              <form className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    className="border-slate-200 focus-visible:border-emerald-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="border-slate-200 focus-visible:border-emerald-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="(+233)"
                    className="border-slate-200 focus-visible:border-emerald-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="Let us know how we can help"
                    className="border-slate-200 focus-visible:border-emerald-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Message *
                  </label>
                  <Textarea
                    rows={5}
                    placeholder="Share more context here..."
                    className="border-slate-200 focus-visible:border-emerald-400"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400"
                >
                  Send Message
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-3xl border border-slate-900/10 bg-slate-900 p-8 text-white shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-emerald-300" />
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">
                  Find Us
                </p>
              </div>
              <h3 className="mt-4 text-2xl font-semibold">
                Visit our constituency office in Sefwi Wiawso
              </h3>
              <p className="mt-3 text-sm text-white/80">
                Meet the team, attend office hours, or submit documents in
                person for quicker processing.
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/90">
                <p>MP&rsquo;s Office, Sefwi Wiawso Municipal Assembly</p>
                <p>P.O Box 25, Sefwi Wiawso</p>
                <p>Western North Region, Ghana</p>
                <p>Ghana Post GPS: WG-0002-7111</p>
              </div>
              <Button
                variant="outline"
                className="mt-6 w-full rounded-full border-white/30 text-white hover:bg-white/10"
              >
                Open Maps
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
