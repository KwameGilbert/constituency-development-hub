"use client";

import { motion } from "framer-motion";

const cards = [
  {
    title: "Vision",
    description:
      "To be an economically prosperous and peaceful municipality where quality social services and facilities are delivered.",
    icon: "fa-regular fa-eye",
  },
  {
    title: "Mission",
    description:
      "As the highest planning authority, we harness and utilize resources responsibly to improve the quality of life for all.",
    icon: "fa-regular fa-lightbulb",
  },
];

function VisionMission() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.15 }}
            className="rounded-3xl bg-white p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 text-red-600">
              <i className={`${card.icon} text-3xl`}></i>
              <h3 className="text-2xl font-semibold text-slate-900">
                {card.title}
              </h3>
            </div>
            <p className="mt-4 text-slate-600">{card.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default VisionMission;
