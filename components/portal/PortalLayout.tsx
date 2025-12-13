"use client";

import { motion, type Variants } from "framer-motion";
import {
  Shield,
  Users,
  Briefcase,
  RadioTower,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { PortalHeader } from "./PortalHeader";
import { PortalFooter } from "./PortalFooter";
import { PortalCard } from "./PortalCard";
import { type PortalIconKey, type PortalRole } from "./types";

interface PortalLayoutProps {
  heading: string;
  subheading: string;
  roles: PortalRole[];
}

const layoutVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const iconMap: Record<PortalIconKey, LucideIcon> = {
  users: Users,
  shield: Shield,
  briefcase: Briefcase,
  radio: RadioTower,
  building: Building2,
};

function PortalLayout({ heading, subheading, roles }: PortalLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-32 h-64 w-64 rounded-full bg-emerald-200/40 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-sky-200/40 blur-[140px]" />
      </div>
      <PortalHeader />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14 sm:px-8 lg:px-10">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={layoutVariants}
          className="rounded-3xl border border-white/80 bg-white/95 p-8 text-center shadow-xl sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            {heading}
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            {subheading}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose the department that matches your daily workflow. Each login
            is optimized for the dashboards it unlocks.
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={gridVariants}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              variants={cardVariants}
              whileHover={{ y: -6, rotateX: -0.5 }}
              whileTap={{ scale: 0.99 }}
            >
              <PortalCard
                title={role.title}
                description={role.description}
                buttonText={`Login as ${role.title}`}
                href={role.href}
                colorTheme={role.colorTheme}
                icon={iconMap[role.iconKey]}
              />
            </motion.div>
          ))}
        </motion.section>
      </main>
      <PortalFooter />
    </div>
  );
}

export default PortalLayout;
