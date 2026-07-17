export type ResourceCategory =
  | "Anxiety"
  | "Depression"
  | "Stress"
  | "Grief"
  | "Relationships"
  | "Addiction";

export type ResourceItem = {
  type: "Article" | "Video" | "Guide" | "Exercise";
  category: string;
  duration: string;
  title: string;
  excerpt: string;
  cta: string;
  image: string;
  video: boolean;
};

export type FeaturedResource = {
  badge: string;
  duration: string;
  title: string;
  description: string;
  cta: string;
  image: string;
};

export type TrendingItem = {
  rank: string;
  title: string;
  reads: string;
};

export type CategoryResourceBundle = {
  blurb: string;
  featured: FeaturedResource;
  latest: ResourceItem[];
  trending: TrendingItem[];
};

const images = {
  featured: "/images/resources/featured.png",
  anxiety: "/images/resources/card-anxiety.png",
  breathing: "/images/resources/card-breathing.png",
  grief: "/images/resources/card-grief.png",
  side1: "/images/resources/side1.png",
  side2: "/images/resources/side2.png",
} as const;

/**
 * Category content drawn from common evidence-based self-help themes
 * (CBT skills, behavioral activation, grief literacy, craving management, etc.).
 */
export const resourceCategoriesById: Record<ResourceCategory, CategoryResourceBundle> = {
  Anxiety: {
    blurb:
      "Tools for worry, panic, and social fear — grounded in CBT and calming body-based practices.",
    featured: {
      badge: "Featured Guide",
      duration: "14 min read",
      title: "Understanding Anxiety: Body, Thoughts, and Safety Behaviors",
      description:
        "Learn how anxiety cycles work, why avoidance keeps fear alive, and how gradual exposure plus thought-challenging can restore a sense of safety.",
      cta: "Start Reading",
      image: images.featured,
    },
    latest: [
      {
        type: "Article",
        category: "ANXIETY",
        duration: "5 min read",
        title: "Navigating Social Anxiety at Work",
        excerpt:
          "Practical steps for meetings, small talk, and performance worry without shutting down.",
        cta: "Read More",
        image: images.anxiety,
        video: false,
      },
      {
        type: "Video",
        category: "ANXIETY",
        duration: "10 min video",
        title: "Grounding When Panic Rises",
        excerpt:
          "A guided 5-4-3-2-1 sensory exercise to interrupt panic and reconnect with the present.",
        cta: "Watch Session",
        image: images.breathing,
        video: true,
      },
      {
        type: "Guide",
        category: "ANXIETY",
        duration: "12 min read",
        title: "Worry Time: Containing Catastrophic Thoughts",
        excerpt:
          "Schedule worry, challenge “what if” spirals, and reclaim evenings from rumination.",
        cta: "Read More",
        image: images.grief,
        video: false,
      },
    ],
    trending: [
      { rank: "01", title: "How to stop checking and reassurance-seeking", reads: "3.1k reads this week" },
      { rank: "02", title: "Breathing for panic without hyperventilating", reads: "2.6k reads this week" },
      { rank: "03", title: "Facing social situations one step at a time", reads: "2.2k reads this week" },
    ],
  },

  Depression: {
    blurb:
      "Support for low mood, fatigue, and hopelessness — with behavioral activation and self-compassion.",
    featured: {
      badge: "Featured Guide",
      duration: "16 min read",
      title: "Behavioral Activation: Small Steps Out of Low Mood",
      description:
        "Depression often shrinks activity and connection. This guide shows how to rebuild routine, pleasure, and mastery — even when motivation is low.",
      cta: "Start Reading",
      image: images.featured,
    },
    latest: [
      {
        type: "Article",
        category: "DEPRESSION",
        duration: "6 min read",
        title: "When Getting Out of Bed Feels Impossible",
        excerpt:
          "Compassionate micro-routines for mornings when energy and hope feel out of reach.",
        cta: "Read More",
        image: images.anxiety,
        video: false,
      },
      {
        type: "Video",
        category: "DEPRESSION",
        duration: "12 min video",
        title: "Challenging the Inner Critic",
        excerpt:
          "Identify harsh self-talk and practice balanced, kinder alternatives used in CBT.",
        cta: "Watch Session",
        image: images.breathing,
        video: true,
      },
      {
        type: "Guide",
        category: "DEPRESSION",
        duration: "9 min read",
        title: "Sleep, Appetite, and Mood: Breaking the Cycle",
        excerpt:
          "How sleep and eating patterns feed depression — and gentle ways to stabilize both.",
        cta: "Read More",
        image: images.grief,
        video: false,
      },
    ],
    trending: [
      { rank: "01", title: "Managing postpartum depression", reads: "2.8k reads this week" },
      { rank: "02", title: "Activity scheduling when nothing feels worth it", reads: "2.1k reads this week" },
      { rank: "03", title: "Talking to someone when you feel numb", reads: "1.9k reads this week" },
    ],
  },

  Stress: {
    blurb:
      "Skills for overload, burnout, and tension — from physiological calm to boundary-setting.",
    featured: {
      badge: "Featured Guide",
      duration: "11 min read",
      title: "The Stress Response: From Fight-or-Flight to Recovery",
      description:
        "Understand how chronic stress affects body and mind, then practice recovery habits that lower baseline arousal day by day.",
      cta: "Start Reading",
      image: images.featured,
    },
    latest: [
      {
        type: "Video",
        category: "STRESS",
        duration: "15 min video",
        title: "Breathing Techniques for Instant Calm",
        excerpt:
          "Physiological sigh, box breathing, and paced exhales you can use between meetings.",
        cta: "Watch Session",
        image: images.breathing,
        video: true,
      },
      {
        type: "Article",
        category: "STRESS",
        duration: "7 min read",
        title: "Burnout vs. Busy: Knowing When to Pause",
        excerpt:
          "Spot exhaustion, cynicism, and reduced efficacy before they become a crisis.",
        cta: "Read More",
        image: images.anxiety,
        video: false,
      },
      {
        type: "Exercise",
        category: "STRESS",
        duration: "8 min practice",
        title: "Progressive Muscle Relaxation",
        excerpt:
          "Release stored tension from jaw to feet with a short guided body scan.",
        cta: "Try Exercise",
        image: images.grief,
        video: false,
      },
    ],
    trending: [
      { rank: "01", title: "Saying no without guilt", reads: "2.9k reads this week" },
      { rank: "02", title: "Digital boundaries for calmer evenings", reads: "2.4k reads this week" },
      { rank: "03", title: "Recovery rituals after a hard day", reads: "2.0k reads this week" },
    ],
  },

  Grief: {
    blurb:
      "Companionship for loss — understanding waves of grief, meaning-making, and continuing bonds.",
    featured: {
      badge: "Featured Guide",
      duration: "13 min read",
      title: "Understanding the Cycles of Loss",
      description:
        "Grief is not a straight line. Explore how waves of emotion, memory, and identity shift over time — and what support can look like along the way.",
      cta: "Start Reading",
      image: images.featured,
    },
    latest: [
      {
        type: "Guide",
        category: "GRIEF",
        duration: "8 min read",
        title: "There Is No Right Way to Grieve",
        excerpt:
          "Why stages are myths, and how to honor your own pace without comparing yourself.",
        cta: "Read More",
        image: images.grief,
        video: false,
      },
      {
        type: "Article",
        category: "GRIEF",
        duration: "6 min read",
        title: "Anniversaries, Holidays, and Empty Chairs",
        excerpt:
          "Prepare for hard dates with rituals that hold memory and soften the shock.",
        cta: "Read More",
        image: images.anxiety,
        video: false,
      },
      {
        type: "Video",
        category: "GRIEF",
        duration: "11 min video",
        title: "Continuing Bonds After Loss",
        excerpt:
          "How connection with someone who died can evolve — letters, objects, and shared stories.",
        cta: "Watch Session",
        image: images.breathing,
        video: true,
      },
    ],
    trending: [
      { rank: "01", title: "Grief that others don’t understand", reads: "2.5k reads this week" },
      { rank: "02", title: "Supporting a friend who is grieving", reads: "2.0k reads this week" },
      { rank: "03", title: "When grief and depression overlap", reads: "1.7k reads this week" },
    ],
  },

  Relationships: {
    blurb:
      "Communication, attachment, and repair — for partners, family, and friendships that matter.",
    featured: {
      badge: "Featured Guide",
      duration: "15 min read",
      title: "Repair After Conflict: Listening Without Defending",
      description:
        "Healthy relationships aren’t conflict-free — they’re repair-capable. Learn soft startups, validation, and how to reconnect after a rupture.",
      cta: "Start Reading",
      image: images.featured,
    },
    latest: [
      {
        type: "Article",
        category: "RELATIONSHIPS",
        duration: "7 min read",
        title: "Attachment Styles in Everyday Conflict",
        excerpt:
          "How anxious and avoidant patterns show up — and what each partner needs to feel safe.",
        cta: "Read More",
        image: images.anxiety,
        video: false,
      },
      {
        type: "Video",
        category: "RELATIONSHIPS",
        duration: "14 min video",
        title: "Setting Boundaries Without Cutting Off",
        excerpt:
          "Clear requests, kind firmness, and staying connected while protecting your limits.",
        cta: "Watch Session",
        image: images.breathing,
        video: true,
      },
      {
        type: "Guide",
        category: "RELATIONSHIPS",
        duration: "10 min read",
        title: "Rebuilding Trust After a Break",
        excerpt:
          "Transparency, consistency, and paced vulnerability when trust has been damaged.",
        cta: "Read More",
        image: images.grief,
        video: false,
      },
    ],
    trending: [
      { rank: "01", title: "How to start a hard conversation", reads: "3.0k reads this week" },
      { rank: "02", title: "Loneliness inside a relationship", reads: "2.3k reads this week" },
      { rank: "03", title: "Family dynamics and adult boundaries", reads: "1.8k reads this week" },
    ],
  },

  Addiction: {
    blurb:
      "Recovery-oriented tools for craving, triggers, and rebuilding life beyond substance or habit use.",
    featured: {
      badge: "Featured Guide",
      duration: "18 min read",
      title: "Understanding Cravings: Urge Surfing and Trigger Maps",
      description:
        "Cravings rise and fall like waves. Map your high-risk situations, practice urge surfing, and build a plan that supports change one decision at a time.",
      cta: "Start Reading",
      image: images.featured,
    },
    latest: [
      {
        type: "Article",
        category: "ADDICTION",
        duration: "6 min read",
        title: "HALT: Hungry, Angry, Lonely, Tired",
        excerpt:
          "Four common vulnerability states — and how to interrupt them before a slip.",
        cta: "Read More",
        image: images.anxiety,
        video: false,
      },
      {
        type: "Video",
        category: "ADDICTION",
        duration: "13 min video",
        title: "Saying No and Leaving High-Risk Situations",
        excerpt:
          "Refusal skills and exit strategies when pressure or opportunity to use appears.",
        cta: "Watch Session",
        image: images.breathing,
        video: true,
      },
      {
        type: "Guide",
        category: "ADDICTION",
        duration: "11 min read",
        title: "After a Slip: Shame, Learning, and Re-engagement",
        excerpt:
          "How to respond to a lapse without all-or-nothing thinking — and get back on track.",
        cta: "Read More",
        image: images.grief,
        video: false,
      },
    ],
    trending: [
      { rank: "01", title: "Building a sober support network", reads: "2.7k reads this week" },
      { rank: "02", title: "Coping with boredom in early recovery", reads: "2.2k reads this week" },
      { rank: "03", title: "When family doesn’t understand addiction", reads: "1.9k reads this week" },
    ],
  },
};

export const resourceCategoryLabels = Object.keys(
  resourceCategoriesById,
) as ResourceCategory[];

export function resourceIdFromTitle(title: string) {
  return `res-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export type CatalogResource = {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  cta: string;
  type: "Article" | "Video" | "Guide" | "Exercise" | "Trending";
  category: ResourceCategory;
  video: boolean;
  badge?: string;
};

export function getResourceCatalog(): CatalogResource[] {
  const items: CatalogResource[] = [
    {
      id: resourceIdFromTitle("Morning Routine for Mental Clarity"),
      title: "Morning Routine for Mental Clarity",
      description:
        "A gentle morning sequence for focus, hydration, light movement, and a short intention-setting practice.",
      duration: "8 min read",
      image: images.side1,
      cta: "Start Reading",
      type: "Guide",
      category: "Stress",
      video: false,
    },
    {
      id: resourceIdFromTitle("Cognitive Reframing Workbook"),
      title: "Cognitive Reframing Workbook",
      description:
        "Worksheets to catch unhelpful thoughts, test the evidence, and write balanced alternatives you can reuse.",
      duration: "18 min guide",
      image: images.side2,
      cta: "Open Workbook",
      type: "Guide",
      category: "Anxiety",
      video: false,
    },
  ];

  for (const category of resourceCategoryLabels) {
    const bundle = resourceCategoriesById[category];
    items.push({
      id: resourceIdFromTitle(bundle.featured.title),
      title: bundle.featured.title,
      description: bundle.featured.description,
      duration: bundle.featured.duration,
      image: bundle.featured.image,
      cta: bundle.featured.cta,
      type: "Guide",
      category,
      video: false,
      badge: bundle.featured.badge,
    });

    for (const item of bundle.latest) {
      items.push({
        id: resourceIdFromTitle(item.title),
        title: item.title,
        description: item.excerpt,
        duration: item.duration,
        image: item.image,
        cta: item.cta,
        type: item.type,
        category,
        video: item.video,
      });
    }

    for (const trend of bundle.trending) {
      items.push({
        id: resourceIdFromTitle(trend.title),
        title: trend.title,
        description: `${trend.reads}. A short, practical piece curated for ${category.toLowerCase()} support.`,
        duration: "6 min read",
        image: images.side1,
        cta: "Read More",
        type: "Trending",
        category,
        video: false,
      });
    }
  }

  return items;
}

export function findCatalogResource(idOrTitle: string) {
  const catalog = getResourceCatalog();
  const byId = catalog.find((item) => item.id === idOrTitle);
  if (byId) return byId;
  return catalog.find((item) => item.title === idOrTitle) ?? null;
}
