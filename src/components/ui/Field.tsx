"use client";

import { motion } from "framer-motion";

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <label className="mb-2 block text-sm font-semibold tracking-wide text-munity-muted">
        {label}
      </label>
      <div className="relative">{children}</div>
    </motion.div>
  );
}
