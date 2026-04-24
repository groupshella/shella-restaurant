// lib/animations.ts
// ─── Shared easing curves ─────────────────────────────────────────────────────
export const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ─── Shared spring configs ────────────────────────────────────────────────────
export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 420,
  damping: 28,
};
export const SPRING_GENTLE = {
  type: "spring" as const,
  stiffness: 220,
  damping: 26,
};

// ─── Reusable variants ────────────────────────────────────────────────────────
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_EXPO },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_EXPO } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_EXPO },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_EXPO },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_EXPO },
  },
};

// ─── Stagger container factory ────────────────────────────────────────────────
export const stagger = (staggerTime = 0.09, delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerTime, delayChildren: delay },
  },
});

// ─── Viewport defaults ────────────────────────────────────────────────────────
export const VIEWPORT = { once: true, margin: "-80px" } as const;
export const VIEWPORT_NEAR = { once: true, margin: "-40px" } as const;

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const SPRING = { type: "spring" as const, stiffness: 400, damping: 28 };


export const VP = { once: true, margin: "-60px" } as const;