"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Brain,
  Check,
  Clock,
  Cloud,
  Heart,
  HeartHandshake,
  Download,
  Headphones,
  LifeBuoy,
  Pause,
  Play,
  RotateCcw,
  Search,
  Subtitles,
  Volume2,
  VolumeX,
  Wind,
  X,
} from "lucide-react";
import { MemberAppShell } from "@/components/memberlayout/MemberAppShell";
import {
  LiveTicker,
  liveFadeUp,
  liveStagger,
  useLiveToast,
} from "@/components/live/LiveFeedback";
import { mockStore, useMockStore } from "@/lib/mock-store";
import {
  captionsToPlainText,
  captionsToVtt,
  downloadTextFile,
  getReadableBody,
  getResourceExperience,
  getVideoCaptions,
  PREVIEW_VIDEO_SRC,
} from "@/lib/resource-content";
import { startResourceSessionAudio } from "@/lib/resource-session-audio";
import { routes } from "@/lib/routes";
import {
  findCatalogResource,
  getResourceCatalog,
  resourceCategoriesById,
  resourceIdFromTitle,
  type CatalogResource,
  type ResourceCategory,
} from "@/lib/resource-categories";

const categories: { label: ResourceCategory; icon: typeof Wind }[] = [
  { label: "Anxiety", icon: Wind },
  { label: "Depression", icon: Cloud },
  { label: "Stress", icon: Brain },
  { label: "Grief", icon: Heart },
  { label: "Relationships", icon: HeartHandshake },
  { label: "Addiction", icon: LifeBuoy },
];

export function ResourcesView({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const router = useRouter();
  const store = useMockStore();
  const { flash } = useLiveToast();
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("Anxiety");
  const [query, setQuery] = useState("");
  const [showAllLatest, setShowAllLatest] = useState(false);
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [activeResource, setActiveResource] = useState<CatalogResource | null>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [listenMode, setListenMode] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const finishedToastFor = useRef<string | null>(null);
  const audioRef = useRef<ReturnType<typeof startResourceSessionAudio> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const catalog = useMemo(() => getResourceCatalog(), []);
  const categoryContent = resourceCategoriesById[activeCategory];
  const search = query.trim().toLowerCase();

  const latestPool = useMemo(() => {
    if (showAllLatest) {
      return catalog.filter(
        (item) =>
          item.type !== "Trending" &&
          !item.badge &&
          item.category === activeCategory,
      );
    }
    return categoryContent.latest.map((item) => ({
      id: resourceIdFromTitle(item.title),
      title: item.title,
      description: item.excerpt,
      duration: item.duration,
      image: item.image,
      cta: item.cta,
      type: item.type,
      category: activeCategory,
      video: item.video,
    })) satisfies CatalogResource[];
  }, [activeCategory, catalog, categoryContent.latest, showAllLatest]);

  const filteredLatest = search
    ? latestPool.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.type.toLowerCase().includes(search),
      )
    : latestPool;

  const featuredResource =
    findCatalogResource(categoryContent.featured.title) ??
    ({
      id: resourceIdFromTitle(categoryContent.featured.title),
      title: categoryContent.featured.title,
      description: categoryContent.featured.description,
      duration: categoryContent.featured.duration,
      image: categoryContent.featured.image,
      cta: categoryContent.featured.cta,
      type: "Guide" as const,
      category: activeCategory,
      video: false,
      badge: categoryContent.featured.badge,
    } satisfies CatalogResource);

  const savedResources = store.savedResourceIds
    .map((id) => findCatalogResource(id))
    .filter((item): item is CatalogResource => Boolean(item));

  const visibleSaved = showAllSaved ? savedResources : savedResources.slice(0, 3);

  const experience = activeResource
    ? getResourceExperience(activeResource.type)
    : null;
  const readableBody = activeResource ? getReadableBody(activeResource) : [];
  const captionCues = activeResource ? getVideoCaptions(activeResource) : [];
  const activeCaption =
    experience === "video"
      ? captionCues.find((cue) => {
          const startPct = (cue.start / 48) * 100;
          const endPct = (cue.end / 48) * 100;
          return progress >= startPct && progress < endPct;
        }) ?? captionCues[0]
      : null;

  useEffect(() => {
    const shouldPlayAudio =
      Boolean(activeResource) &&
      experience === "article" &&
      listenMode &&
      playing;

    if (!shouldPlayAudio) {
      audioRef.current?.stop();
      audioRef.current = null;
      return;
    }

    audioRef.current?.stop();
    audioRef.current = startResourceSessionAudio("read");

    return () => {
      audioRef.current?.stop();
      audioRef.current = null;
    };
  }, [activeResource, experience, listenMode, playing]);

  useEffect(() => {
    if (!activeResource || !playing) return;
    if (experience === "video") return;
    if (experience === "article" && !listenMode) return;

    const tick = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(tick);
          return 100;
        }
        return prev + 1.6;
      });
    }, 120);
    return () => window.clearInterval(tick);
  }, [activeResource, playing, experience, listenMode]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || experience !== "video") return;

    if (playing) {
      void video.play().catch(() => {
        flash("Tap play on the video to start");
        setPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [playing, experience, activeResource, flash]);

  useEffect(() => {
    if (progress < 100 || !activeResource) return;
    setPlaying(false);
    setCompletedIds((prev) =>
      prev.includes(activeResource.id) ? prev : [...prev, activeResource.id],
    );
    if (finishedToastFor.current !== activeResource.id) {
      finishedToastFor.current = activeResource.id;
      flash(`Finished · ${activeResource.title}`);
    }
  }, [progress, activeResource, flash]);

  function requireLogin() {
    if (isLoggedIn) return true;
    router.push(routes.login);
    return false;
  }

  function openResource(resource: CatalogResource) {
    setActiveResource(resource);
    setProgress(completedIds.includes(resource.id) ? 100 : 0);
    setPlaying(false);
    setListenMode(false);
    setShowCaptions(false);
    finishedToastFor.current = completedIds.includes(resource.id)
      ? resource.id
      : null;
    flash(`Opened ${resource.type.toLowerCase()} · ${resource.title}`);
  }

  function closeResource() {
    setActiveResource(null);
    setPlaying(false);
    setListenMode(false);
    setShowCaptions(false);
    setProgress(0);
    audioRef.current?.stop();
    audioRef.current = null;
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  function toggleComplete(resource: CatalogResource) {
    const isComplete = completedIds.includes(resource.id);
    if (isComplete) {
      setCompletedIds((prev) => prev.filter((id) => id !== resource.id));
      setProgress(0);
      finishedToastFor.current = null;
      flash("Marked incomplete");
      return;
    }
    finishedToastFor.current = resource.id;
    setProgress(100);
    setPlaying(false);
    setCompletedIds((prev) =>
      prev.includes(resource.id) ? prev : [...prev, resource.id],
    );
    flash("Marked complete");
  }

  function downloadCaptions(format: "vtt" | "txt") {
    if (!activeResource) return;
    const cues = getVideoCaptions(activeResource);
    const slug = activeResource.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (format === "vtt") {
      downloadTextFile(
        `${slug}-captions.vtt`,
        captionsToVtt(activeResource, cues),
        "text/vtt;charset=utf-8",
      );
      flash("Caption file downloaded (.vtt)");
      return;
    }
    downloadTextFile(
      `${slug}-captions.txt`,
      captionsToPlainText(activeResource, cues),
      "text/plain;charset=utf-8",
    );
    flash("Caption transcript downloaded (.txt)");
  }

  function toggleSave(resource: CatalogResource) {
    if (!requireLogin()) return;
    const saved = store.savedResourceIds.includes(resource.id);
    mockStore.toggleSavedResource(resource.id);
    flash(saved ? "Removed from saved resources" : "Saved for later");
  }

  function openTrending(title: string) {
    const resource = findCatalogResource(title);
    if (resource) {
      openResource(resource);
      return;
    }
    openResource({
      id: resourceIdFromTitle(title),
      title,
      description: `A trending ${activeCategory.toLowerCase()} resource from the hub preview.`,
      duration: "6 min read",
      image: "/images/resources/side1.png",
      cta: "Read More",
      type: "Trending",
      category: activeCategory,
      video: false,
    });
  }

  return (
    <MemberAppShell isLoggedIn={isLoggedIn}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold tracking-[-0.96px] text-munity-green md:text-5xl md:leading-[57.6px]">
                Resource Hub
              </h1>
              <p className="mt-2 text-lg leading-relaxed text-munity-muted">
                {categoryContent.blurb}
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${activeCategory.toLowerCase()} resources...`}
                className="h-[56px] w-full rounded-2xl border border-munity-input-border bg-white py-4 pl-12 pr-4 text-base text-munity-text shadow-sm outline-none placeholder:text-gray-500 focus:border-munity-green focus:ring-2 focus:ring-munity-green/15"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {categories.map(({ label, icon: Icon }) => {
              const active = activeCategory === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setActiveCategory(label);
                    setQuery("");
                    setShowAllLatest(false);
                    flash(`Browsing ${label} resources`);
                  }}
                  className={`flex min-w-[120px] flex-col items-center gap-2.5 rounded-2xl border px-6 py-4 transition ${
                    active
                      ? "border-munity-green bg-munity-lime/40 text-munity-olive-text"
                      : "border-munity-input-border bg-white text-munity-text hover:border-munity-green/40"
                  }`}
                >
                  <Icon className="size-6" />
                  <span className="text-sm font-semibold tracking-wide">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <LiveTicker
          items={categoryContent.trending.map(
            (item) => `${item.title} is trending with ${item.reads}.`,
          )}
        />

        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-12">
            <article className="overflow-hidden rounded-[20px] border border-munity-input-border bg-white shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
              <div className="flex flex-col md:flex-row">
                <button
                  type="button"
                  onClick={() => openResource(featuredResource)}
                  className="relative h-64 w-full md:min-h-[360px] md:w-1/2"
                >
                  <Image
                    src={categoryContent.featured.image}
                    alt={categoryContent.featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-munity-green px-3 py-1 text-xs font-medium uppercase tracking-[0.6px] text-white">
                    {categoryContent.featured.badge}
                  </span>
                </button>
                <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
                  <div className="flex items-center gap-2 text-xs font-medium text-munity-green">
                    <Clock className="size-3" />
                    {categoryContent.featured.duration}
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-munity-muted">
                    {activeCategory}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold leading-tight text-munity-text">
                    {categoryContent.featured.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-munity-muted">
                    {categoryContent.featured.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => openResource(featuredResource)}
                      className="rounded-xl bg-munity-green px-6 py-3 text-base text-white transition hover:bg-munity-green-dark"
                    >
                      {categoryContent.featured.cta}
                    </button>
                    {isLoggedIn ? (
                      <button
                        type="button"
                        onClick={() => toggleSave(featuredResource)}
                        className="rounded-full p-2 text-munity-muted hover:bg-munity-bg hover:text-munity-green"
                        aria-label="Save for later"
                      >
                        <Bookmark
                          className={`size-5 ${
                            store.savedResourceIds.includes(featuredResource.id)
                              ? "fill-current text-munity-green"
                              : ""
                          }`}
                        />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-munity-text">
                  Latest in {activeCategory}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAllLatest((prev) => !prev);
                    flash(
                      showAllLatest
                        ? "Showing featured latest picks"
                        : `Showing all ${activeCategory} resources`,
                    );
                  }}
                  className="inline-flex items-center gap-1 text-base text-munity-green hover:underline"
                >
                  {showAllLatest ? "Show less" : "View All"}
                  <ArrowRight className="size-2.5" />
                </button>
              </div>
              {filteredLatest.length === 0 ? (
                <p className="rounded-2xl border border-munity-border/50 bg-white px-6 py-10 text-center text-munity-muted">
                  No {activeCategory.toLowerCase()} resources match “{query}”.
                </p>
              ) : (
                <motion.div
                  variants={liveStagger}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredLatest.map((item) => {
                    const saved = store.savedResourceIds.includes(item.id);
                    const done = completedIds.includes(item.id);
                    return (
                      <motion.article
                        key={item.id}
                        variants={liveFadeUp}
                        className="overflow-hidden rounded-[20px] border border-munity-input-border bg-white shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => openResource(item)}
                          className="relative h-48 w-full"
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                          {item.video ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-munity-green">
                                <Play className="size-4 fill-current" />
                              </span>
                            </div>
                          ) : null}
                          <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-munity-green backdrop-blur-sm">
                            {item.type}
                          </span>
                          {done ? (
                            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-munity-green px-2 py-1 text-[10px] font-semibold text-white">
                              <Check className="size-3" /> Done
                            </span>
                          ) : null}
                        </button>
                        <div className="p-6">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold uppercase tracking-tight text-munity-green">
                              {item.category}
                            </span>
                            <span className="font-medium text-munity-muted">
                              {item.duration}
                            </span>
                          </div>
                          <h4 className="mt-2 text-xl leading-snug text-munity-text">
                            {item.title}
                          </h4>
                          <p className="mt-3 text-sm leading-5 text-munity-muted">
                            {item.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => openResource(item)}
                              className="inline-flex items-center gap-1 text-base text-munity-green hover:underline"
                            >
                              {item.cta}
                              <ArrowRight className="size-2.5" />
                            </button>
                            {isLoggedIn ? (
                              <button
                                type="button"
                                onClick={() => toggleSave(item)}
                                className="rounded-full p-1.5 text-munity-muted hover:bg-munity-bg hover:text-munity-green"
                                aria-label={saved ? "Unsave resource" : "Save resource"}
                              >
                                <Bookmark
                                  className={`size-4 ${saved ? "fill-current text-munity-green" : ""}`}
                                />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              )}
            </section>
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-6 xl:w-[320px]">
            {isLoggedIn ? (
              <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-munity-text">
                    Saved for Later
                  </h3>
                  <p className="mt-1 text-xs text-munity-muted">
                    {savedResources.length}{" "}
                    {savedResources.length === 1 ? "Item" : "Items"}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {visibleSaved.length === 0 ? (
                    <p className="text-sm text-munity-muted">
                      Nothing saved yet. Tap the bookmark on any resource.
                    </p>
                  ) : (
                    visibleSaved.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openResource(item)}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold leading-snug text-munity-text">
                            {item.title}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSave(item)}
                          className="rounded-full p-1.5 text-munity-green hover:bg-munity-bg"
                          aria-label="Remove from saved"
                        >
                          <Bookmark className="size-4 fill-current" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {savedResources.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (savedResources.length > 3) {
                        setShowAllSaved((prev) => !prev);
                        flash(
                          showAllSaved
                            ? "Showing recent saved items"
                            : "Showing all saved resources",
                        );
                        return;
                      }
                      if (savedResources[0]) openResource(savedResources[0]);
                    }}
                    className="mt-5 text-sm font-medium text-munity-green hover:underline"
                  >
                    {savedResources.length > 3
                      ? showAllSaved
                        ? "Show fewer"
                        : "View All Saved"
                      : "Open saved resource"}
                  </button>
                ) : null}
              </section>
            ) : null}

            <section className="rounded-[20px] border border-munity-input-border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-munity-text">
                Trending in {activeCategory}
              </h3>
              <div className="flex flex-col gap-5">
                {categoryContent.trending.map((item) => (
                  <button
                    key={item.rank}
                    type="button"
                    onClick={() => openTrending(item.title)}
                    className="flex gap-3 rounded-xl text-left transition hover:bg-munity-bg/70"
                  >
                    <span className="text-2xl font-bold text-munity-lime">
                      {item.rank}
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-snug text-munity-text">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-munity-muted">{item.reads}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-[20px] bg-munity-olive p-6 text-munity-lime-light shadow-[0_4px_20px_rgba(85,107,47,0.05)]">
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-white/10">
                <Headphones className="size-5" />
              </div>
              <h3 className="text-xl font-bold leading-tight">Need Immediate Help?</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">
                Connect with a certified peer counselor or therapist within 15 minutes.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href={routes.emergency}
                  onClick={() => flash("Opening emergency support")}
                  className="w-full rounded-xl bg-munity-lime px-4 py-3 text-center text-sm font-semibold text-munity-olive-text transition hover:brightness-95"
                >
                  Get Support
                </Link>
                <Link
                  href={routes.therapy}
                  onClick={() => flash("Browse therapists")}
                  className="w-full rounded-xl border border-white/25 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Find a therapist
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {activeResource && experience ? (
          <motion.div
            key="resource-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
            onClick={closeResource}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-[#d8dbcf] bg-white shadow-2xl"
            >
              <div className="relative shrink-0">
                {experience === "video" ? (
                  <div className="relative bg-black">
                    <video
                      key={activeResource.id}
                      ref={videoRef}
                      className="aspect-video w-full object-cover"
                      poster={activeResource.image}
                      preload="metadata"
                      playsInline
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      onTimeUpdate={(event) => {
                        const media = event.currentTarget;
                        if (!media.duration) return;
                        setProgress((media.currentTime / media.duration) * 100);
                      }}
                      onEnded={() => {
                        setProgress(100);
                        setPlaying(false);
                      }}
                    >
                      <source src={PREVIEW_VIDEO_SRC} type="video/mp4" />
                    </video>
                    {showCaptions && activeCaption ? (
                      <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl bg-black/70 px-4 py-3 text-center text-sm leading-relaxed text-white">
                        {activeCaption.text}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="relative h-44 w-full bg-munity-sidebar sm:h-52">
                    <Image
                      src={activeResource.image}
                      alt={activeResource.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-14 text-white">
                      <p className="text-xs font-semibold uppercase tracking-wide text-munity-lime">
                        {activeResource.type} · {activeResource.category}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold leading-tight">
                        {activeResource.title}
                      </h2>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={closeResource}
                  className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/55"
                  aria-label="Close resource"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-5 overflow-y-auto p-6">
                {experience === "video" ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-munity-green">
                      Video · {activeResource.category}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-munity-text">
                      {activeResource.title}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-munity-muted">
                      {activeResource.description}
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3 text-sm text-munity-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {activeResource.duration}
                  </span>
                  {completedIds.includes(activeResource.id) ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-munity-lime/50 px-2.5 py-1 text-xs font-semibold text-munity-olive-text">
                      <Check className="size-3.5" /> Completed
                    </span>
                  ) : null}
                  {experience === "article" && listenMode && playing ? (
                    <span className="inline-flex items-center gap-1.5 text-munity-green">
                      <Volume2 className="size-3.5" />
                      Listening
                    </span>
                  ) : null}
                </div>

                {experience === "video" ? (
                  <div className="space-y-4">
                    <div className="h-2 overflow-hidden rounded-full bg-[#e5e5e1]">
                      <div
                        className="h-full rounded-full bg-munity-green transition-[width] duration-150"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = !playing;
                          setPlaying(next);
                          flash(next ? "Video playing" : "Video paused");
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
                      >
                        {playing ? (
                          <Pause className="size-4" />
                        ) : (
                          <Play className="size-4 fill-current" />
                        )}
                        {playing ? "Pause video" : "Play video"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCaptions((prev) => !prev);
                          flash(
                            showCaptions ? "Captions hidden" : "Captions on",
                          );
                        }}
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                          showCaptions
                            ? "border-munity-green bg-munity-lime/40 text-munity-olive-text"
                            : "border-[#c5c8b8] bg-white text-munity-text hover:bg-[#f3f4ee]"
                        }`}
                      >
                        <Subtitles className="size-4" />
                        {showCaptions ? "Hide captions" : "View captions"}
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadCaptions("txt")}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#c5c8b8] bg-white px-4 py-2.5 text-sm font-semibold text-munity-text transition hover:bg-[#f3f4ee]"
                      >
                        <Download className="size-4" />
                        Download captions
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadCaptions("vtt")}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#c5c8b8] bg-white px-4 py-2.5 text-sm font-semibold text-munity-text transition hover:bg-[#f3f4ee]"
                      >
                        <Download className="size-4" />
                        Download .vtt
                      </button>
                    </div>

                    {showCaptions ? (
                      <div className="rounded-2xl border border-munity-border bg-[#f7f6f2] p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-munity-muted">
                          Caption transcript
                        </p>
                        <div className="mt-3 max-h-40 space-y-3 overflow-y-auto">
                          {captionCues.map((cue) => (
                            <p
                              key={`${cue.start}-${cue.text}`}
                              className={`text-sm leading-relaxed ${
                                activeCaption?.start === cue.start
                                  ? "font-semibold text-munity-green"
                                  : "text-munity-text"
                              }`}
                            >
                              <span className="mr-2 text-xs text-munity-muted">
                                {Math.floor(cue.start / 60)
                                  .toString()
                                  .padStart(2, "0")}
                                :
                                {(cue.start % 60).toString().padStart(2, "0")}
                              </span>
                              {cue.text}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {experience === "article" || experience === "guide" ? (
                  <div className="space-y-4">
                    {experience === "article" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setListenMode(false);
                            setPlaying(false);
                            flash("Reading mode");
                          }}
                          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                            !listenMode
                              ? "border-munity-green bg-munity-lime/40 text-munity-olive-text"
                              : "border-[#c5c8b8] bg-white text-munity-text hover:bg-[#f3f4ee]"
                          }`}
                        >
                          Read article
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setListenMode(true);
                            setPlaying(true);
                            flash("Listening mode · audio on");
                          }}
                          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                            listenMode
                              ? "border-munity-green bg-munity-lime/40 text-munity-olive-text"
                              : "border-[#c5c8b8] bg-white text-munity-text hover:bg-[#f3f4ee]"
                          }`}
                        >
                          {listenMode && playing ? (
                            <Volume2 className="size-4" />
                          ) : (
                            <VolumeX className="size-4" />
                          )}
                          Listen to audio
                        </button>
                        {listenMode ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPlaying((prev) => !prev);
                              flash(playing ? "Audio paused" : "Audio playing");
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-munity-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-munity-green-dark"
                          >
                            {playing ? (
                              <Pause className="size-4" />
                            ) : (
                              <Play className="size-4 fill-current" />
                            )}
                            {playing ? "Pause" : "Play"}
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-munity-muted">
                        Guide · reading only
                      </p>
                    )}

                    <article
                      className="max-h-64 space-y-4 overflow-y-auto rounded-2xl border border-munity-border bg-[#fbfaf7] p-5"
                      onScroll={(event) => {
                        const el = event.currentTarget;
                        if (el.scrollHeight <= el.clientHeight) return;
                        const ratio =
                          el.scrollTop / (el.scrollHeight - el.clientHeight);
                        setProgress((prev) =>
                          Math.min(100, Math.max(prev, ratio * 100)),
                        );
                      }}
                    >
                      {readableBody.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 48)}
                          className="text-base leading-relaxed text-munity-text"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </article>

                    {experience === "guide" ||
                    (experience === "article" && !listenMode) ? (
                      <button
                        type="button"
                        onClick={() => {
                          setProgress((prev) => Math.min(100, prev + 25));
                          flash(
                            progress + 25 >= 100
                              ? "Reached the end of this piece"
                              : "Kept reading",
                          );
                        }}
                        className="rounded-xl border border-munity-green px-4 py-2.5 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/30"
                      >
                        Continue reading
                      </button>
                    ) : null}

                    <div className="h-2 overflow-hidden rounded-full bg-[#e5e5e1]">
                      <div
                        className="h-full rounded-full bg-munity-green transition-[width] duration-150"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 border-t border-munity-border pt-4">
                  <button
                    type="button"
                    onClick={() => toggleComplete(activeResource)}
                    className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition ${
                      completedIds.includes(activeResource.id)
                        ? "border-munity-green bg-munity-lime/40 text-munity-olive-text hover:bg-munity-lime/60"
                        : "border-[#75796b] bg-white text-munity-text hover:bg-[#eceee6]"
                    }`}
                  >
                    {completedIds.includes(activeResource.id) ? (
                      <>
                        <RotateCcw className="size-4" />
                        Unmark complete
                      </>
                    ) : (
                      <>
                        <Check className="size-4" />
                        Mark complete
                      </>
                    )}
                  </button>
                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => toggleSave(activeResource)}
                      className="inline-flex items-center gap-2 rounded-xl border border-munity-green px-4 py-2.5 text-sm font-semibold text-munity-green transition hover:bg-munity-lime/30"
                    >
                      <Bookmark
                        className={`size-4 ${
                          store.savedResourceIds.includes(activeResource.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      {store.savedResourceIds.includes(activeResource.id)
                        ? "Saved"
                        : "Save"}
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MemberAppShell>
  );
}
