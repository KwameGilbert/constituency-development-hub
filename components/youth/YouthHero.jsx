import { ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

function YouthHero() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-amber-500 p-8 text-white shadow-xl">
      <div className="flex flex-wrap items-start gap-6">
        <div className="space-y-4">
          <Badge className="bg-white/15 text-white">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Youth Opportunity Desk
          </Badge>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Youth Registration · Sefwi Wiawso Constituency
          </h1>
          <p className="text-white/80 md:text-lg">
            Share the essentials once. We route your profile to ongoing
            programmes, placement drives, and training cohorts across the
            constituency.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-white/90">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
              <ShieldCheck className="h-4 w-4" /> Secure data handling
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
              <Sparkles className="h-4 w-4" /> 5-minute guided form
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default YouthHero;
