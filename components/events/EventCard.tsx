import Image from "next/image";
import { Clock, MapPin, PlayCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

export type EventMedia = {
  image: {
    url: string;
    alt: string;
  };
  video?: {
    url: string;
    label: string;
    duration: string;
  };
};

export type EventItem = {
  id: string;
  title: string;
  summary: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
  category: string;
  impact: string;
  media: EventMedia;
};

type EventCardProps = {
  event: EventItem;
  index: number;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05 },
  }),
};

function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="rounded-3xl border border-white/70 bg-white/95 p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
    >
      <figure className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/60 bg-slate-100">
        <Image
          src={event.media.image.url}
          alt={event.media.image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority={index < 2}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10" />
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-between px-4 text-xs text-white/90">
          <span className="rounded-full border border-white/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
            Media placeholder
          </span>
          <span className="text-right font-medium">
            {event.media.image.alt}
          </span>
        </figcaption>
      </figure>

      {event.media.video && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm text-slate-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <PlayCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              {event.media.video.label}
            </p>
            <p className="text-xs text-slate-500">
              {event.media.video.duration}
            </p>
          </div>
          <span className="ml-auto rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Video placeholder
          </span>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          {event.category}
        </span>
        <p className="text-sm font-semibold text-slate-400">{event.date}</p>
      </div>
      <h3 className="mt-4 text-2xl font-semibold text-slate-900">
        {event.title}
      </h3>
      <p className="mt-2 text-sm text-slate-600">{event.summary}</p>

      <div className="mt-4 grid gap-2 text-sm text-slate-500">
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-500" />
          {event.time}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-500" />
          {event.location}
        </p>
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald-500" />
          {event.attendees}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-700">
        <p className="font-semibold text-emerald-800">Impact Notes</p>
        <p className="text-emerald-700">{event.impact}</p>
      </div>
    </motion.article>
  );
}

export default EventCard;
