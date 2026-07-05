"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

interface DropdownMenuProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}

export function DropdownMenu({ value, options, onChange, className = "" }: DropdownMenuProps) {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        whileHover={{ y: -1, boxShadow: "0 6px 16px rgba(62,82,25,0.08)" }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 rounded-lg bg-[#efeded] px-4 py-2 text-base font-medium text-munity-text"
      >
        {value}
        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown className="size-5" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={menuId}
            role="listbox"
            initial={{ opacity: 0, y: -6, rotateX: -8 }}
            animate={{ opacity: 1, y: 6, rotateX: 0 }}
            exit={{ opacity: 0, y: -4, rotateX: -6 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="absolute right-0 z-30 min-w-[180px] overflow-hidden rounded-xl border border-munity-input-border bg-white py-1 shadow-[0_16px_40px_rgba(62,82,25,0.12)]"
            style={{ transformPerspective: 600 }}
          >
            {options.map((option) => (
              <li key={option} role="option" aria-selected={option === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-munity-lime/40 ${
                    option === value ? "bg-munity-lime/50 font-semibold text-munity-olive-text" : ""
                  }`}
                >
                  {option}
                  {option === value ? <Check className="size-4 text-munity-green" /> : null}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
