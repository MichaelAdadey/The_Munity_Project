"use client";

import { useEffect, useRef } from "react";

interface VideoStreamProps {
  stream: MediaStream;
  muted?: boolean;
  mirrored?: boolean;
  className?: string;
}

/** Binds a live MediaStream to a <video> element — the DOM API has no declarative way to do this. */
export function VideoStream({ stream, muted, mirrored, className }: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
      className={className}
    />
  );
}
