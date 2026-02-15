import { Variants, motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { sanitizeHtml } from "@/lib/utils";

export type EventStat = {
  label: string;
  value: string;
  detail: string;
};

type EventsHeroProps = {
  title: string;
  description: string;
  stats: EventStat[];
  variants?: Variants;
};

function EventsHero({ title, description, stats, variants }: EventsHeroProps) {
  return (
    <motion.section
      variants={variants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-emerald-500/90 to-sky-500/90 p-1 shadow-2xl"
    >
      <div className="h-full rounded-[32px] bg-white/95 px-8 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-white text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">
            Field Notes
          </Badge>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Events & Engagements
          </p>
        </div>

        <motion.h1
          className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="mt-4 max-w-3xl text-lg text-slate-600"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description || "") }}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-3xl font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-slate-500">
                {stat.label}
              </p>
              <p className="text-xs text-slate-400">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default EventsHero;
