"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export interface ImageLightboxProps {
  /** All images belonging to the post/gallery the viewer was opened from. */
  images: string[];
  /** Index within `images` that should be shown first. */
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Meaningful alt text describing the image content (e.g. author/context). */
  altText?: string;
}

/**
 * Full-screen, Facebook-style image viewer. Built on the same Base UI dialog
 * primitive used by `components/ui/dialog.tsx`, so focus trapping, Escape,
 * backdrop-dismiss, body scroll lock, and focus restoration to the opener
 * are all inherited rather than reimplemented.
 */
export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  altText = "Post image",
}: ImageLightboxProps) {
  const [index, setIndex] = React.useState(initialIndex);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);

  const dragOrigin = React.useRef<{ x: number; y: number; panX: number; panY: number } | null>(
    null,
  );
  const touchOrigin = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchDistance = React.useRef<number | null>(null);

  const hasMultiple = images.length > 1;

  const resetZoom = React.useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Reset to the clicked image and neutral zoom every time the viewer opens,
  // adjusted during render (per React docs) rather than in an effect so it
  // can't cause an extra cascading render pass.
  const [wasOpen, setWasOpen] = React.useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open && index !== initialIndex) setIndex(initialIndex);
    if (open && (zoom !== 1 || pan.x !== 0 || pan.y !== 0)) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }

  const goTo = React.useCallback(
    (next: number) => {
      setIndex(((next % images.length) + images.length) % images.length);
      resetZoom();
    },
    [images.length, resetZoom],
  );

  const goNext = React.useCallback(() => {
    if (hasMultiple) goTo(index + 1);
  }, [goTo, hasMultiple, index]);

  const goPrev = React.useCallback(() => {
    if (hasMultiple) goTo(index - 1);
  }, [goTo, hasMultiple, index]);

  // ArrowLeft/ArrowRight navigation. Escape-to-close is handled by the
  // dialog primitive itself, so it isn't duplicated here.
  React.useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") goNext();
      else if (event.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goNext, goPrev]);

  function handleWheel(event: React.WheelEvent) {
    event.preventDefault();
    setZoom((z) => clamp(z - event.deltaY * 0.0015, MIN_ZOOM, MAX_ZOOM));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLImageElement>) {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
    dragOrigin.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLImageElement>) {
    if (!dragOrigin.current) return;
    const dx = event.clientX - dragOrigin.current.x;
    const dy = event.clientY - dragOrigin.current.y;
    setPan({ x: dragOrigin.current.panX + dx, y: dragOrigin.current.panY + dy });
  }

  function handlePointerUp() {
    dragOrigin.current = null;
    setIsPanning(false);
  }

  function touchDistance(touches: React.TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function handleTouchStart(event: React.TouchEvent) {
    if (event.touches.length === 2) {
      pinchDistance.current = touchDistance(event.touches);
    } else if (event.touches.length === 1) {
      touchOrigin.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      pinchDistance.current = null;
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (event.touches.length === 2) {
      const newDistance = touchDistance(event.touches);
      if (pinchDistance.current != null) {
        const delta = newDistance - pinchDistance.current;
        setZoom((z) => clamp(z + delta * 0.01, MIN_ZOOM, MAX_ZOOM));
      }
      pinchDistance.current = newDistance;
    } else if (event.touches.length === 1 && zoom > 1) {
      const dx = event.touches[0].clientX - touchOrigin.current.x;
      const dy = event.touches[0].clientY - touchOrigin.current.y;
      setPan((current) => ({ x: current.x + dx, y: current.y + dy }));
      touchOrigin.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
  }

  function handleTouchEnd(event: React.TouchEvent) {
    pinchDistance.current = null;
    if (zoom > 1) return; // Panning while zoomed shouldn't also trigger swipe nav.
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchOrigin.current.x;
    const dy = touch.clientY - touchOrigin.current.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  const currentSrc = images[index];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-70 bg-black/95 opacity-0 transition-opacity duration-200 data-open:opacity-100 data-closed:opacity-0"
        />
        <DialogPrimitive.Popup
          aria-label="Image viewer"
          className="fixed inset-0 z-70 flex scale-95 flex-col opacity-0 outline-none transition-all duration-200 ease-out data-open:scale-100 data-open:opacity-100 data-closed:scale-95 data-closed:opacity-0"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            {hasMultiple ? (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                {index + 1} / {images.length}
              </span>
            ) : (
              <span />
            )}
            <DialogPrimitive.Close
              className="rounded-full p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
              aria-label="Close image viewer"
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-6 sm:px-6"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {hasMultiple ? (
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 sm:left-4 sm:p-3"
              >
                <ChevronLeft className="size-6" />
              </button>
            ) : null}

            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={index}
                src={currentSrc}
                alt={hasMultiple ? `${altText} (${index + 1} of ${images.length})` : altText}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onDoubleClick={() => (zoom > 1 ? resetZoom() : setZoom(2))}
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transition: isPanning ? "none" : "transform 0.15s ease-out",
                  touchAction: zoom > 1 ? "none" : "pan-y",
                  cursor: zoom > 1 ? "grab" : "default",
                }}
                className={cn(
                  "max-h-[80vh] max-w-[92vw] select-none rounded-lg object-contain sm:max-h-[85vh] sm:max-w-[88vw]",
                )}
              />
            </AnimatePresence>

            {hasMultiple ? (
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 sm:right-4 sm:p-3"
              >
                <ChevronRight className="size-6" />
              </button>
            ) : null}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
