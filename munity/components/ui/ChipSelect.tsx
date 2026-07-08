"use client";

import { motion } from "framer-motion";

interface ChipSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function ChipSelect({ options, value, onChange }: ChipSelectProps) {
  function toggle(option: string) {
    onChange(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option],
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <motion.button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            animate={{
              backgroundColor: selected ? "#d6e7a1" : "#fbf9f8",
              borderColor: selected ? "#3e5219" : "#c5c8b8",
              color: selected ? "#5a682f" : "#45483c",
            }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="rounded-full border px-4 py-2 text-sm font-semibold shadow-[0_3px_0_rgba(62,82,25,0.08)]"
          >
            {option}
          </motion.button>
        );
      })}
    </div>
  );
}
