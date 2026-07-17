"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Select({
  label,
  placeholder = "Select an option",
  options,
  value: controlledValue,
  defaultValue = "",
  onChange,
  className = "",
}: SelectProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  const value = controlledValue ?? internalValue;
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(nextValue: string) {
    if (controlledValue === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label ? (
        <label className="mb-2 block text-sm font-semibold tracking-wide text-munity-muted">
          {label}
        </label>
      ) : null}
      <motion.button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        className={`input-field flex items-center justify-between text-left ${selected ? "text-munity-text" : "text-munity-gray"}`}
      >
        <span>{selected?.label ?? placeholder}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-5 shrink-0 text-munity-text" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listboxId}
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-munity-input-border bg-white py-1 shadow-[0_16px_40px_rgba(62,82,25,0.12)]"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <motion.li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <button
                    type="button"
                    onClick={() => selectOption(option.value)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-munity-lime/40 ${
                      isSelected ? "bg-munity-lime/60 font-semibold text-munity-olive-text" : "text-munity-text"
                    }`}
                  >
                    {option.label}
                    {isSelected ? <Check className="size-4 text-munity-green" /> : null}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
