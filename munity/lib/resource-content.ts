import type { CatalogResource } from "@/lib/resource-categories";

export type ResourceExperience = "article" | "video" | "guide";

export function getResourceExperience(
  type: CatalogResource["type"],
): ResourceExperience {
  if (type === "Video") return "video";
  if (type === "Guide" || type === "Exercise") return "guide";
  return "article";
}

export function getReadableBody(resource: CatalogResource) {
  const topic = resource.category.toLowerCase();
  return [
    resource.description,
    `This ${resource.type.toLowerCase()} walks through practical steps for ${topic} support. Start with one small action you can try today, then notice what shifts in your body and thoughts.`,
    "Begin by naming what feels hardest right now — without judging it. Write one sentence, take one slow breath, and choose a single next step that is kind and doable.",
    "Common skills in this piece include grounding, thought-checking, and planning a tiny recovery habit. Revisit any section that feels useful; you do not need to finish everything in one sitting.",
    "If distress rises or safety feels uncertain, pause this resource and use Emergency Support or reach a trusted person. Your pace matters more than completing every paragraph.",
  ];
}

export type CaptionCue = {
  start: number;
  end: number;
  text: string;
};

export function getVideoCaptions(resource: CatalogResource): CaptionCue[] {
  return [
    {
      start: 0,
      end: 4,
      text: `Welcome to “${resource.title}.”`,
    },
    {
      start: 4,
      end: 10,
      text: resource.description,
    },
    {
      start: 10,
      end: 16,
      text: `Today we focus on ${resource.category.toLowerCase()} skills you can use in everyday moments.`,
    },
    {
      start: 16,
      end: 24,
      text: "Notice your breath. Soften your shoulders. You can pause anytime.",
    },
    {
      start: 24,
      end: 32,
      text: "Try one grounding cue: name five things you can see, then four you can feel.",
    },
    {
      start: 32,
      end: 40,
      text: "When thoughts race, label them gently — “worrying,” “planning,” “remembering” — and return to the present.",
    },
    {
      start: 40,
      end: 48,
      text: "Close with one kind action for yourself after this session.",
    },
  ];
}

export function captionsToVtt(resource: CatalogResource, cues: CaptionCue[]) {
  const lines = ["WEBVTT", ""];
  cues.forEach((cue, index) => {
    lines.push(String(index + 1));
    lines.push(`${formatVttTime(cue.start)} --> ${formatVttTime(cue.end)}`);
    lines.push(cue.text);
    lines.push("");
  });
  lines.push(`NOTE Generated for ${resource.title} · Munity preview`);
  return `${lines.join("\n")}\n`;
}

export function captionsToPlainText(resource: CatalogResource, cues: CaptionCue[]) {
  const body = cues
    .map((cue) => `[${formatClock(cue.start)}] ${cue.text}`)
    .join("\n\n");
  return `${resource.title}\n${resource.duration}\n\n${resource.description}\n\n--- Captions ---\n\n${body}\n`;
}

export function downloadTextFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatClock(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function formatVttTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  const ms = "000";
  return `${hours}:${mins}:${secs}.${ms}`;
}

/** Short calm sample used for video previews in the demo. */
export const PREVIEW_VIDEO_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
