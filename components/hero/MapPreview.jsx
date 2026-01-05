"use client";

import { communityStats } from "@/data/data";
import { motion } from "framer-motion";

function MapPreview() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">
              Interactive map
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Project Footprint
            </h2>
            <p className="mt-3 max-w-2xl text-slate-500">
              Explore communities where sanitation upgrades, educational
              infrastructure, and digital hubs are underway.
            </p>
          </div>
          <div className="flex gap-4">
            {communityStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white px-4 py-3 text-center shadow"
              >
                <p className="text-2xl font-bold text-red-600">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="overflow-hidden rounded-3xl bg-white shadow-lg"
        >
          <div className="relative h-96">
            <iframe
              title="Constituency Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7918.152197692185!2d-2.487!3d6.207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sgh!4v1700000000000!5m2!1sen!2sgh"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 bg-linear-to-tr from-red-900/5 via-transparent to-amber-500/10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default MapPreview;
