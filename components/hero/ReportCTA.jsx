import { reportSteps } from "@/data/data";
import { motion } from "framer-motion";

function ReportCTA() {
  return (
    <section className="bg-amber-50 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Community Desk
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            See an issue in your community?
          </h2>
          <p className="mt-4 text-slate-600">
            Help us prioritize interventions by sending detailed field reports.
            Hon. Kofi Benteh Afful’s team responds with the transparency and
            speed constituents expect.
          </p>
          <a
            href="/report"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-500/30 transition hover:bg-red-500"
          >
            <i className="fa-solid fa-exclamation-circle"></i>
            Report an Issue Now
          </a>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
              <i className="fa-solid fa-clipboard-list text-2xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                How it works
              </h3>
              <p className="text-sm text-slate-500">
                Three guided steps, handled by our rapid response desk.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {reportSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-lg font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm text-slate-600">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReportCTA;
