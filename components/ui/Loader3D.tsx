"use client";

import { motion } from "framer-motion";

interface Loader3DProps {
  size?: number;
  label?: string;
}

export function Loader3D({ size = 56, label }: Loader3DProps) {
  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
      <div
        className="loader-3d-scene"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <motion.div
          className="loader-3d-ring"
          animate={{ rotateX: 360, rotateY: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        >
          <span className="loader-3d-face loader-3d-face-front" />
          <span className="loader-3d-face loader-3d-face-back" />
          <span className="loader-3d-face loader-3d-face-right" />
          <span className="loader-3d-face loader-3d-face-left" />
          <span className="loader-3d-face loader-3d-face-top" />
          <span className="loader-3d-face loader-3d-face-bottom" />
        </motion.div>
      </div>
      {label ? (
        <motion.p
          className="text-sm font-semibold tracking-wide text-munity-muted"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          {label}
        </motion.p>
      ) : null}
      <span className="sr-only">Loading</span>
    </div>
  );
}
