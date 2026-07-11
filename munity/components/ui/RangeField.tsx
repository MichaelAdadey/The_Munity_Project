"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface RangeFieldProps {
  label: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
}

export function RangeField({
  label,
  min = 0,
  max = 20,
  defaultValue = 5,
  value: controlledValue,
  onChange,
}: RangeFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const percent = ((value - min) / (max - min)) * 100;

  function setValue(next: number) {
    if (controlledValue === undefined) {
      setInternalValue(next);
    }
    onChange?.(next);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold tracking-wide text-munity-muted">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="relative h-2 flex-1 rounded-full bg-munity-divider">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-munity-green"
            animate={{ width: `${percent}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
          />
          <motion.div
            className="pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full border-2 border-white bg-munity-green shadow-md"
            animate={{ left: `calc(${percent}% - 10px)` }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          />
        </div>
        <motion.span
          key={value}
          initial={{ scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-full bg-munity-olive px-3 py-1 text-sm font-semibold text-munity-green"
        >
          {value >= max ? `${max}+` : value}
        </motion.span>
      </div>
    </div>
  );
}
