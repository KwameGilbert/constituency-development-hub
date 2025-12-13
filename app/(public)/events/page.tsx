"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, DownloadCloud, MapPin } from "lucide-react";

import EventCard, { type EventItem } from "@/components/events/EventCard";
import EventFilters from "@/components/events/EventFilters";
import EventsHero, { type EventStat } from "@/components/events/EventsHero";
import { Button } from "@/components/ui/button";

const heroStats: EventStat[] = [
  {
    label: "Constituency stops",
    value: "48",
    detail: "Since January 2025",
  },
  {
    label: "Policy forums",
    value: "12",
    detail: "Energy, youth, and health",
  },
  {
    label: "Community partners",
    value: "36",
    detail: "Traditional, civic, and faith groups",
  },
  {
    label: "Volunteer hours",
    value: "2,400+",
    detail: "Logged by local teams",
  },
];

const eventsData: EventItem[] = [
  {
    id: "ev-001",
    title: "Youth Skills Acceleration Clinic",
    summary:
      "Hands-on mentorship with artisans and digital mentors focused on employability for senior high school graduates.",
    date: "12 Feb 2025",
    time: "9:00 AM",
    location: "Sefwi Wiawso Innovation Hub",
    attendees: "120+ young innovators",
    category: "Community",
    impact:
      "Matched 45 participants to ongoing apprenticeship opportunities and funded new toolkits for three cooperatives.",
    media: {
      image: {
        url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1000&q=80",
        alt: "Facilitators mentoring youth innovators",
      },
      video: {
        url: "#",
        label: "Hands-on clinic recap",
        duration: "02:41",
      },
    },
  },
  {
    id: "ev-002",
    title: "Parliamentary Briefing on Cocoa Roads",
    summary:
      "Presented updates to local media and chiefs on the phased rehabilitation of feeder roads across the cocoa belt.",
    date: "21 Feb 2025",
    time: "2:30 PM",
    location: "Sefwi Boako Palace Forecourt",
    attendees: "20 traditional leaders",
    category: "Infrastructure",
    impact:
      "Secured community monitoring teams to verify contractor milestones and keep residents informed in real time.",
    media: {
      image: {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
        alt: "Community members reviewing road maps",
      },
      video: {
        url: "#",
        label: "Briefing Q&A snippets",
        duration: "01:58",
      },
    },
  },
  {
    id: "ev-003",
    title: "Constituency Health Outreach",
    summary:
      "Mobile screening with nurses, NHIS officers, and volunteers delivering basic care and insurance renewals.",
    date: "01 Mar 2025",
    time: "8:00 AM",
    location: "Asafo Community Park",
    attendees: "310 residents",
    category: "Community",
    impact:
      "Registered 186 new NHIS cards and referred 27 critical cases to the district hospital for follow-up.",
    media: {
      image: {
        url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80",
        alt: "Nurse taking vitals at a mobile clinic",
      },
    },
  },
  {
    id: "ev-004",
    title: "Education Stakeholder Roundtable",
    summary:
      "Dialogue with head teachers, PTA leaders, and tertiary alumni on resourcing STEM labs in deprived schools.",
    date: "09 Mar 2025",
    time: "4:00 PM",
    location: "Sefwi Wiawso Municipal Assembly Hall",
    attendees: "42 education advocates",
    category: "Education",
    impact:
      "Mobilized alumni pledges for lab refurbishments and co-designed a device sharing program with ICT tutors.",
    media: {
      image: {
        url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=80",
        alt: "Stakeholders discussing STEM lab plans",
      },
      video: {
        url: "#",
        label: "Roundtable highlights",
        duration: "03:12",
      },
    },
  },
  {
    id: "ev-005",
    title: "Women in Agribusiness Forum",
    summary:
      "Showcase of processing innovations, microcredit partners, and agritech tools tailored for women farmer groups.",
    date: "16 Mar 2025",
    time: "10:00 AM",
    location: "Wiawso Civic Plaza",
    attendees: "95 agripreneurs",
    category: "Community",
    impact:
      "Linked five cooperatives to low-interest financing and unveiled a produce aggregation calendar for 2025.",
    media: {
      image: {
        url: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1000&q=80",
        alt: "Women agripreneurs showcasing produce",
      },
    },
  },
  {
    id: "ev-006",
    title: "Energy & Climate Policy Forum",
    summary:
      "Consultation with engineers, researchers, and civil society on clean mini-grids and climate adaptation funding.",
    date: "25 Mar 2025",
    time: "1:00 PM",
    location: "Regional Coordinating Council Auditorium",
    attendees: "60 policy partners",
    category: "Parliament",
    impact:
      "Documented proposals submitted to the national committee on renewable energy incentives for forest fringe towns.",
    media: {
      image: {
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
        alt: "Energy experts discussing climate plans",
      },
      video: {
        url: "#",
        label: "Policy forum recap",
        duration: "04:05",
      },
    },
  },
];

const eventFilters = [
  "All",
  "Community",
  "Parliament",
  "Infrastructure",
  "Education",
];

const timelineUpdates = [
  {
    id: "timeline-1",
    date: "08 Feb 2025",
    title: "Logistics prep",
    detail:
      "Advance team surveyed venues and secured interpreters for mixed-language engagements.",
  },
  {
    id: "timeline-2",
    date: "20 Feb 2025",
    title: "Media briefing",
    detail:
      "Shared progress scorecards with regional press to support transparent reporting.",
  },
  {
    id: "timeline-3",
    date: "05 Mar 2025",
    title: "Volunteer onboarding",
    detail:
      "Trained 75 new constituency volunteers on data collection for field visits.",
  },
];

function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const heroVariants = useMemo(
    () => ({ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }),
    []
  );

  const filteredEvents = useMemo(() => {
    if (activeFilter === "All") return eventsData;
    return eventsData.filter((event) => event.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-[120px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-200/30 blur-[160px]" />
      </div>

      <main className="relative mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <EventsHero
          title="Tracking every field visit, forum, and policy stop"
          description="Follow the engagements Hon. Kofi Benteh Afful attends across the constituency and Parliament. Each record will sync with the backend feed soon; for now we are showcasing representative highlights."
          stats={heroStats}
          variants={heroVariants}
        />

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-sm"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                Filter feed
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Browse events by focus area
              </h2>
            </div>
            <EventFilters
              filters={eventFilters}
              activeFilter={activeFilter}
              onSelect={setActiveFilter}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4 text-emerald-500" />
            <span>{filteredEvents.length} records shown</span>
            <span className="text-slate-300">•</span>
            <span>
              Backend syncing soon&mdash;showing dummy data for layout testing.
            </span>
          </div>
        </motion.section>

        <section className="grid gap-6 md:grid-cols-2">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-emerald-500" />
              <h3 className="text-xl font-semibold">Field timeline</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              We are documenting every logistical note so you can replay how an
              engagement was prepared and followed up.
            </p>
            <div className="mt-6 space-y-6 border-l border-slate-200 pl-6">
              {timelineUpdates.map((update) => (
                <div key={update.id} className="relative">
                  <span className="absolute -left-[34px] top-2 h-3 w-3 rounded-full border-2 border-emerald-500 bg-white" />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {update.date}
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {update.title}
                  </p>
                  <p className="text-sm text-slate-600">{update.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-900/10 bg-slate-900 p-8 text-white shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              Coming soon
            </p>
            <h3 className="mt-4 text-3xl font-semibold">
              Subscribe for the full live event feed
            </h3>
            <p className="mt-3 text-base text-white/80">
              We are wiring the backend feed so you can search and export every
              event Hon. Afful attends. Expect filters by date range, town, and
              policy theme.
            </p>
            <Button
              variant="outline"
              className="mt-8 inline-flex items-center gap-2 rounded-full border-white/40 px-6 py-3 text-white hover:bg-white/10"
            >
              <DownloadCloud className="h-4 w-4" />
              Download sample brief
            </Button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default EventsPage;
