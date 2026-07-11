"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { OnboardingStepPage } from "@/components/therapistonboarding/OnboardingStepPage";
import { ChipSelect } from "@/components/ui/ChipSelect";
import { getOnboardingStepData, saveOnboardingStepData } from "@/lib/onboarding-data";
import { therapistSpecialtyCategories } from "@/lib/therapist-specialties";
import { routes } from "@/lib/routes";

export default function SpecialtiesPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("mood");
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const saved = getOnboardingStepData("specialties");
    if (saved) {
      setSelected(saved.specialties);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !dirty) return;
    saveOnboardingStepData("specialties", { specialties: selected });
  }, [hydrated, dirty, selected]);

  const activeCategory =
    therapistSpecialtyCategories.find((category) => category.id === categoryId) ??
    therapistSpecialtyCategories[0];

  const catalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return therapistSpecialtyCategories
        .flatMap((category) => category.specialties)
        .filter((specialty) => specialty.toLowerCase().includes(q));
    }
    return activeCategory.specialties;
  }, [query, activeCategory]);

  function addCustomSpecialty() {
    const next = customSpecialty.trim();
    if (!next) return;
    if (!selected.includes(next)) {
      setDirty(true);
      setSelected([...selected, next]);
    }
    setCustomSpecialty("");
  }

  function removeSelected(specialty: string) {
    setDirty(true);
    setSelected(selected.filter((item) => item !== specialty));
  }

  if (!hydrated) {
    return null;
  }

  return (
    <OnboardingStepPage
      stepId="specialties"
      title="Specialties & Expertise"
      description="Search or browse by category. Select as many as you need — you can update these later."
      backHref={routes.therapistOnboarding.credentials}
      backLabel="Back to Credentials"
      continueHref={routes.therapistOnboarding.payout}
      continueLabel="Continue to Payout Settings"
      validate={() => {
        if (selected.length === 0) {
          window.alert("Please select at least one specialty.");
          return false;
        }
        return true;
      }}
      onSave={() => {
        saveOnboardingStepData("specialties", { specialties: selected });
      }}
    >
      {selected.length > 0 ? (
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-munity-text">
            Selected ({selected.length})
          </p>
          <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto">
            {selected.map((specialty) => (
              <button
                key={specialty}
                type="button"
                onClick={() => removeSelected(specialty)}
                className="inline-flex items-center gap-1.5 rounded-full border border-munity-green/30 bg-munity-lime px-3 py-1.5 text-xs font-semibold text-munity-olive-text"
              >
                {specialty}
                <X className="size-3.5 opacity-70" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-munity-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search all specialties…"
            className="input-field pl-11"
            aria-label="Search specialties"
          />
        </div>
        <select
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value);
            setQuery("");
          }}
          disabled={Boolean(query.trim())}
          className="input-field"
          aria-label="Specialty category"
        >
          {therapistSpecialtyCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="max-h-56 overflow-y-auto rounded-2xl border border-munity-border/50 bg-munity-sidebar/40 p-4">
        {catalog.length > 0 ? (
          <ChipSelect
            options={catalog}
            value={selected}
            onChange={(value) => {
              setDirty(true);
              setSelected(value);
            }}
          />
        ) : (
          <p className="text-sm text-munity-muted">
            No matches for “{query}”. Add it as a custom specialty below.
          </p>
        )}
      </div>

      <p className="mt-2 text-xs text-munity-muted">
        {query.trim()
          ? `Showing ${catalog.length} search results`
          : `Browsing ${activeCategory.label}`}
      </p>

      <div className="mt-6 border-t border-munity-border/60 pt-5">
        <label
          htmlFor="custom-specialty"
          className="mb-2 block text-sm font-semibold text-munity-text"
        >
          Add a custom specialty
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="custom-specialty"
            type="text"
            value={customSpecialty}
            onChange={(event) => setCustomSpecialty(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomSpecialty();
              }
            }}
            placeholder="e.g. Sports Psychology"
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={addCustomSpecialty}
            className="rounded-xl bg-munity-lime px-5 py-3 text-sm font-semibold text-munity-olive-text transition hover:bg-munity-lime-light"
          >
            Add
          </button>
        </div>
      </div>
    </OnboardingStepPage>
  );
}
