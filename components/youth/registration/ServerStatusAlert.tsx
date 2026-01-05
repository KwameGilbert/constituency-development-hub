import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Target } from "lucide-react";

import type { SubmissionStatus } from "./types";

type ServerStatusAlertProps = {
  status: SubmissionStatus;
};

function ServerStatusAlert({ status }: ServerStatusAlertProps) {
  return (
    <AnimatePresence>
      {status.type && (
        <motion.div
          key={status.type}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`mb-4 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4" />
          ) : (
            <Target className="mt-0.5 h-4 w-4" />
          )}
          <p>{status.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ServerStatusAlert;
