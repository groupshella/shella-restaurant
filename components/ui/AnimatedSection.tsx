"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerItemFadeUp,
  EASE_OUT_EXPO,
} from "@/lib/animations";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  viewportMargin?: string;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  stagger = 0.09,
  viewportMargin = "-100px",
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={staggerContainer(stagger, delay)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const animatedSectionItemVariants = staggerItemFadeUp;

export const defaultTransition = {
  duration: 0.65,
  ease: EASE_OUT_EXPO as [number, number, number, number],
};
