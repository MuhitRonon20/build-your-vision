import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

/** Text line that rises out of a mask when it enters the viewport. */
export function MaskLine({
  children,
  delay = 0,
  className = "",
  animateNow = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  animateNow?: boolean;
}) {
  const motionProps = animateNow
    ? { animate: { y: "0%" } }
    : { whileInView: { y: "0%" }, viewport: { once: true, margin: "-10% 0px" } };
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        {...motionProps}
        transition={{ duration: 1.2, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Image that drifts against scroll and scales gently. */
export function ParallaxImage({
  src,
  alt,
  className = "",
  strength = 12,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.1, 1.18]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        style={{ y, scale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

/** Clip-path reveal wrapper for images. */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(18% 0% 18% 0%)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.6, ease }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}
