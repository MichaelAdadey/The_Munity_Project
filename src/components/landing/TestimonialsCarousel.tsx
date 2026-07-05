"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const testimonials = [
  {
    quote:
      '"Munity changed how I view my anxiety. The peer support groups made me realize I wasn\'t alone, and the transition to a professional therapist within the same app was seamless."',
    name: "Sarah M.",
    role: "Community Member since 2023",
    avatarClass: "bg-[#d9eaa3]",
  },
  {
    quote:
      '"As a therapist, I find Munity\'s platform incredible for connecting with clients who are already engaged in their wellness journey. The tools available are clinical-grade."',
    name: "Dr. James K.",
    role: "Licensed Psychologist",
    avatarClass: "bg-[#b6d088]",
  },
  {
    quote:
      '"The anonymity allowed me to speak my truth for the first time. The kindness of strangers here is what kept me going through my darkest months."',
    name: "Anonymous Member",
    role: "Health Advocate",
    avatarClass: "bg-[#dbd9d9]",
  },
];

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  function goPrev() {
    setIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  }

  function goNext() {
    setIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  }

  const item = testimonials[index];

  return (
    <section className="bg-munity-sidebar px-10 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-[32px] font-bold text-munity-text">Real Stories of Recovery</h2>
            <p className="mt-2 text-base text-munity-muted">
              Voices from our thriving community members.
            </p>
          </div>
          <div className="hidden gap-4 sm:flex">
            <Button variant="outline" className="size-12 rounded-full p-0" onClick={goPrev} aria-label="Previous testimonial">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" className="size-12 rounded-full p-0" onClick={goNext} aria-label="Next testimonial">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="relative mt-12 min-h-[320px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.article
              key={item.name}
              initial={{ opacity: 0, x: 40, rotateY: -8 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -40, rotateY: 8 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="mx-auto flex max-w-3xl flex-col justify-between rounded-3xl bg-white p-10 shadow-[0_4px_10px_rgba(85,107,47,0.05)]"
              style={{ transformPerspective: 800 }}
            >
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-5 fill-munity-green text-munity-green" />
                  ))}
                </div>
                <p className="mt-4 text-base italic leading-relaxed text-munity-text">{item.quote}</p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className={`size-12 rounded-full ${item.avatarClass}`} />
                <div>
                  <p className="font-bold text-munity-text">{item.name}</p>
                  <p className="text-xs font-medium text-munity-muted">{item.role}</p>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((testimonial, dotIndex) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Show testimonial ${dotIndex + 1}`}
              className={`h-2 rounded-full transition-all ${
                dotIndex === index ? "w-8 bg-munity-green" : "w-2 bg-munity-divider"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
