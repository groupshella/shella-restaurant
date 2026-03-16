/**
 * Shared animation utilities for Shella Restaurant
 * Performance: animate only transform and opacity (GPU-accelerated).
 */

// ─── Easings ─────────────────────────────────────────────────────────────────
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 400,
  damping: 28,
};
export const SPRING_GENTLE = {
  type: "spring" as const,
  stiffness: 200,
  damping: 24,
};

// ─── Variants ───────────────────────────────────────────────────────────────
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT_EXPO, delay },
  }),
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO, delay },
  }),
};

export const staggerContainer = (stagger = 0.09, delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const staggerItemFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

export const staggerItemScaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};
