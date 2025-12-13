import { upcomingEvents } from "@/data/data";
import { motion } from "framer-motion";

function EventsList() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500">
            Calendar
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Upcoming Events
          </h2>
          <div className="mt-2 h-1 w-20 bg-red-500" />
        </div>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm"
            >
              <div className="flex w-16 flex-col items-center rounded-xl bg-red-600 py-3 text-white">
                <span className="text-2xl font-bold">{event.date}</span>
                <span className="text-xs uppercase tracking-wide">
                  {event.monthYear}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900">
                  {event.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <i className="fa-regular fa-clock text-red-500"></i>
                    {event.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-location-dot text-red-500"></i>
                    {event.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventsList;
