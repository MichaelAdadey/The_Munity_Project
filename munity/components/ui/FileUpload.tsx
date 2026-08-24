"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileCheck, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  accept?: string;
  maxSizeMb?: number;
  onFileChange?: (file: File | null) => void;
}

export function FileUpload({
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMb = 10,
  onFileChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function validateAndSet(nextFile: File | null) {
    if (!nextFile) return;
    if (nextFile.size > maxSizeMb * 1024 * 1024) {
      setError(`File must be under ${maxSizeMb}MB`);
      return;
    }
    setError(null);
    setFile(nextFile);
    onFileChange?.(nextFile);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    validateAndSet(event.dataTransfer.files[0] ?? null);
  }

  return (
    <div>
      <motion.label
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        animate={{
          borderColor: dragging ? "#3e5219" : "#c5c8b8",
          backgroundColor: dragging ? "rgba(214,231,161,0.35)" : "rgba(245,243,243,0.3)",
          scale: dragging ? 1.01 : 1,
        }}
        whileHover={{ borderColor: "#3e521980" }}
        className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12"
      >
        <motion.div
          animate={{ rotate: dragging ? [0, -8, 8, 0] : 0, scale: dragging ? 1.08 : 1 }}
          transition={{ duration: 0.4 }}
          className="mb-4 flex size-14 items-center justify-center rounded-full bg-munity-lime"
        >
          <Upload className="size-6 text-munity-green" />
        </motion.div>
        <p className="text-sm">
          <span className="font-bold text-munity-green">Click to upload</span>
          <span className="font-semibold text-munity-text"> or drag and drop</span>
        </p>
        <p className="mt-1 text-xs font-medium text-munity-muted">
          PDF, JPG, or PNG (Max {maxSizeMb}MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          onChange={(event) => validateAndSet(event.target.files?.[0] ?? null)}
        />
      </motion.label>

      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {file ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex items-center justify-between rounded-xl border border-munity-green/30 bg-munity-lime/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <FileCheck className="size-5 text-munity-green" />
              <div>
                <p className="text-sm font-semibold text-munity-text">{file.name}</p>
                <p className="text-xs text-munity-muted">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                onFileChange?.(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="rounded-full p-1 text-munity-muted hover:bg-white/70 hover:text-munity-green"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
