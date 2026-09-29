"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useLiveToast } from "@/components/live/LiveFeedback";
import {
  globalSearch,
  type GlobalSearchResults,
  type SearchPerson,
} from "@/lib/search/queries";
import { ensureTherapistThread } from "@/lib/messages/client-queries";
import { communityPath, messagesPath, routes, therapyPath } from "@/lib/routes";

const EMPTY: GlobalSearchResults = {
  posts: [],
  people: [],
  communities: [],
  resources: [],
};

export function GlobalSearchBar({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
}) {
  const router = useRouter();
  const { flash } = useLiveToast();
  const [results, setResults] = useState<GlobalSearchResults>(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const query = value ?? "";
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      const timer = window.setTimeout(() => {
        setResults(EMPTY);
        setOpen(false);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    debounceRef.current = window.setTimeout(() => {
      setLoading(true);
      globalSearch(query)
        .then((data) => {
          setResults(data);
          setOpen(true);
        })
        .catch(() => setResults(EMPTY))
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closeAndNavigate(path: string) {
    setOpen(false);
    router.push(path);
  }

  async function handlePersonClick(person: SearchPerson) {
    if (person.type === "therapist") {
      closeAndNavigate(therapyPath(person.id));
      return;
    }
    try {
      const threadId = await ensureTherapistThread(person.id);
      closeAndNavigate(messagesPath({ chatId: threadId }));
    } catch {
      flash("You can only message therapists you have a booking with.");
      setOpen(false);
    }
  }

  const hasAnyResults =
    results.posts.length > 0 ||
    results.people.length > 0 ||
    results.communities.length > 0 ||
    results.resources.length > 0;

  return (
    <div ref={containerRef} className="relative mr-auto hidden sm:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-munity-gray" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onFocus={() => {
          if (hasAnyResults) setOpen(true);
        }}
        placeholder={placeholder}
        className="h-9 w-64 rounded-full bg-munity-sidebar py-2 pl-10 pr-4 text-xs font-medium text-munity-text outline-none placeholder:text-munity-gray"
      />

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-2xl border border-munity-border bg-white p-2 shadow-[0_16px_40px_rgba(62,82,25,0.12)]">
          {loading ? (
            <p className="px-3 py-4 text-xs text-munity-muted">Searching…</p>
          ) : !hasAnyResults ? (
            <p className="px-3 py-4 text-xs text-munity-muted">
              No results found.
            </p>
          ) : (
            <>
              {results.people.length > 0 ? (
                <div className="mb-2">
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wide text-munity-muted">
                    People
                  </p>
                  {results.people.map((person) => (
                    <button
                      key={`${person.type}-${person.id}`}
                      type="button"
                      onClick={() => void handlePersonClick(person)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-munity-sidebar"
                    >
                      <span className="truncate font-medium text-munity-text">
                        {person.name}
                      </span>
                      {person.subtitle ? (
                        <span className="truncate text-xs text-munity-muted">
                          {person.subtitle}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}

              {results.communities.length > 0 ? (
                <div className="mb-2">
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wide text-munity-muted">
                    Communities
                  </p>
                  {results.communities.map((community) => (
                    <button
                      key={community.id}
                      type="button"
                      onClick={() =>
                        closeAndNavigate(communityPath(community.slug))
                      }
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-munity-sidebar"
                    >
                      <span className="truncate font-medium text-munity-text">
                        {community.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}

              {results.resources.length > 0 ? (
                <div className="mb-2">
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wide text-munity-muted">
                    Resources
                  </p>
                  {results.resources.map((resource) => (
                    <button
                      key={resource.id}
                      type="button"
                      onClick={() =>
                        closeAndNavigate(
                          `${routes.resources}?resource=${resource.id}`,
                        )
                      }
                      className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-munity-sidebar"
                    >
                      <span className="truncate font-medium text-munity-text">
                        {resource.title}
                      </span>
                      <span className="shrink-0 text-xs text-munity-muted">
                        {resource.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}

              {results.posts.length > 0 ? (
                <div>
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wide text-munity-muted">
                    Posts
                  </p>
                  {results.posts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() =>
                        closeAndNavigate(`${routes.memberHome}?post=${post.id}`)
                      }
                      className="flex w-full flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left text-sm hover:bg-munity-sidebar"
                    >
                      <span className="text-xs font-semibold text-munity-green">
                        {post.authorName}
                      </span>
                      <span className="line-clamp-1 text-xs text-munity-muted">
                        {post.content}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
