import { Variants, motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";

type HighlightStat = {
  value: string;
  label: string;
};

type HeroPanelProps = {
  stats: HighlightStat[];
  tracks: string[];
  variants: Variants;
};

function HeroPanel({ stats, tracks, variants }: HeroPanelProps) {
  return (
    <motion.section
      variants={variants}
      initial="hidden"
      animate="visible"
      className="flex flex-1 flex-col justify-center gap-8 rounded-3xl bg-white/90 p-8 shadow-xl"
    >
      <Badge className="w-max bg-amber-100 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
        Youth Futures 2026
      </Badge>

      <div className="space-y-6">
        <motion.h1
          className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          Register once, unlock curated training and work pathways across the
          constituency.
        </motion.h1>
        <motion.p
          className="max-w-2xl text-lg text-slate-600"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Share your background and the skills you want to grow. Our impact desk
          matches you with fellowships, apprenticeships, internships, and gigs
          rooted in the Youth First agenda.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-2xl font-semibold text-slate-900">
              {stat.value}
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Priority tracks
        </p>
        <div className="flex flex-wrap gap-2">
          {tracks.map((track) => (
            <Badge
              key={track}
              className="bg-orange-50 text-xs font-medium text-orange-600"
            >
              {track}
            </Badge>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default HeroPanel;
