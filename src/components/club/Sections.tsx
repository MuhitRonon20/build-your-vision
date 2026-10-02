import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import hero from "@/assets/hero.jpg";
import craft from "@/assets/craft.jpg";
import interior from "@/assets/interior.jpg";
import founder from "@/assets/founder.jpg";
import shave from "@/assets/shave.jpg";
import tools from "@/assets/tools.jpg";
import beard from "@/assets/beard.jpg";
import { MaskLine, ParallaxImage, Reveal, ScrollWord, ease } from "./primitives";
import { useBooking } from "./BookingOverlay";

/* ---------------- HERO ---------------- */
export function Hero() {
  const { open: openBooking } = useBooking();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="top" ref={ref} className="grain relative h-[100svh] min-h-[640px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <motion.img
          src={hero}
          alt="A gentleman seated in a leather barber chair inside Maison Kessler"
          width={1920}
          height={1088}
          className="h-full w-full object-cover object-[70%_center]"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease, delay: 1.1 }}
        />
      </motion.div>
      <div className="shade-left absolute inset-0" />
      <div className="shade-bottom absolute inset-0" />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-20 md:px-12 md:pb-28"
      >
        <motion.p
          className="label text-bone"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          Est. 2026 — Gentlemen's Barber Club
        </motion.p>
        <h1 className="display mt-6 text-[17vw] md:text-[9.5vw]">
          <MaskLine animateNow delay={1.9}>More than</MaskLine>
          <MaskLine animateNow delay={2.05} className="italic text-bone">
            a haircut.
          </MaskLine>
        </h1>
        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <motion.p
            className="max-w-sm text-sm leading-relaxed text-ivory/75"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 2.4 }}
          >
            A place to slow down, get sharp, and enjoy the craft — behind a quiet door on
            Kastanienallee.
          </motion.p>
          <motion.div
            className="flex items-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 2.8 }}
          >
            <button
              type="button"
              onClick={openBooking}
              className="label bg-ivory px-8 py-5 text-ink transition-colors duration-500 hover:bg-brass"
            >
              Book an appointment
            </button>
            <a href="#philosophy" className="label link-line text-ivory">
              Explore
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- PHILOSOPHY ---------------- */
const statement =
  "We believe a cut is a conversation. Unhurried hands, hot towels, a measured pour, and the kind of attention that has gone quietly out of fashion everywhere else.";

export function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 40%"] });
  const words = statement.split(" ");
  const x1 = useTransform(scrollYProgress, [0, 1], ["-6%", "2%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["8%", "-2%"]);

  return (
    <section id="philosophy" className="relative overflow-hidden px-6 py-40 md:px-12 md:py-56">
      <div ref={ref} className="mx-auto max-w-[1600px]">
        <p className="label text-smoke">I — The Philosophy</p>
        <h2 className="display mt-10 text-[13vw] md:text-[8vw]">
          <motion.span className="block" style={{ x: x1 }}>
            Craft is not
          </motion.span>
          <motion.span className="block md:pl-[18vw]" style={{ x: x2 }}>
            a service<span className="italic text-brass">.</span>
          </motion.span>
          <motion.span className="block italic text-bone" style={{ x: x1 }}>
            It is a ritual.
          </motion.span>
        </h2>
        <p className="display mt-24 max-w-3xl text-3xl leading-snug md:ml-auto md:text-4xl">
          {words.map((w, i) => (
            <ScrollWord
              key={i}
              word={w}
              progress={scrollYProgress}
              range={[0.35 + (i / words.length) * 0.5, 0.35 + ((i + 1) / words.length) * 0.5]}
            />
          ))}
        </p>
      </div>
    </section>
  );
}

/* ---------------- EDITORIAL STORY ---------------- */
export function CraftStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-45%"]);

  return (
    <section ref={ref} className="relative bg-charcoal pb-40 pt-24">
      <motion.div
        style={{ x }}
        className="display pointer-events-none whitespace-nowrap text-[22vw] italic leading-none text-ivory/[0.07]"
      >
        Precision · Patience · Precision · Patience
      </motion.div>
      <div className="relative mx-auto -mt-[12vw] grid max-w-[1600px] gap-12 px-6 md:grid-cols-12 md:px-12">
        <Reveal className="md:col-span-7 md:col-start-1">
          <ParallaxImage
            src={craft}
            alt="A barber shaping a haircut with comb and scissors in front of a mirror"
            className="aspect-[4/5] w-full"
          />
        </Reveal>
        <div className="flex flex-col justify-end md:col-span-4 md:col-start-9 md:pb-24">
          <p className="label text-smoke">II — The Hands</p>
          <h3 className="display mt-6 text-5xl md:text-6xl">
            <MaskLine>Forty minutes.</MaskLine>
            <MaskLine delay={0.1} className="italic text-bone">
              Not one rushed.
            </MaskLine>
          </h3>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-ivory/65">
            Every cut begins with a consultation and ends only when the line sits right in the
            mirror. Scissors over clippers, wherever the hair allows.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SERVICES ---------------- */
const services = [
  { n: "01", name: "Signature Haircut", note: "Consultation, wash, scissor cut, hot towel finish", price: "€65", min: "45 min", img: craft },
  { n: "02", name: "Beard Craft", note: "Sculpting, line-up, oils and balm", price: "€40", min: "30 min", img: beard },
  { n: "03", name: "Classic Shave", note: "Straight razor, three hot towels, cold finish", price: "€55", min: "40 min", img: shave },
  { n: "04", name: "Gentlemen's Grooming", note: "Brows, ears, scalp treatment", price: "€30", min: "20 min", img: tools },
  { n: "05", name: "The Full Ritual", note: "Cut, shave and a measured pour at the bar", price: "€140", min: "90 min", img: interior },
];

export function Services() {
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });

  return (
    <section
      id="services"
      className="relative px-6 py-40 md:px-12"
      onMouseMove={(e) => {
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="label text-smoke">III — The Menu</p>
            <h2 className="display mt-6 text-6xl md:text-8xl">
              <MaskLine>Services</MaskLine>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ivory/60">
            Each service is performed by one barber, start to finish. Complimentary coffee or
            whisky on arrival.
          </p>
        </div>

        <ul className="mt-24" onMouseLeave={() => setActive(null)}>
          {services.map((s, i) => {
            const on = active === i;
            return (
              <li key={s.n} className="border-t border-ivory/[0.08] last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(on ? null : i)}
                  className="group grid w-full grid-cols-12 items-baseline gap-4 py-8 text-left md:py-10"
                >
                  <span className="label col-span-2 text-smoke md:col-span-1">{s.n}</span>
                  <span
                    className={`display col-span-10 text-4xl transition-all duration-700 md:col-span-6 md:text-6xl ${
                      on ? "translate-x-4 italic text-bone" : active !== null ? "text-ivory/35" : ""
                    }`}
                  >
                    {s.name}
                  </span>
                  <span className="col-span-12 text-sm text-ivory/55 md:col-span-3 md:pl-0 pl-[16.66%]">
                    {s.note}
                  </span>
                  <span className="label col-span-12 text-brass md:col-span-2 md:text-right pl-[16.66%] md:pl-0">
                    {s.price} · {s.min}
                  </span>
                </button>
                {/* Mobile inline image */}
                <AnimatePresence>
                  {on && (
                    <motion.div
                      className="overflow-hidden md:hidden"
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.7, ease }}
                    >
                      <img src={s.img} alt={s.name} loading="lazy" className="mb-8 aspect-[4/3] w-full object-cover" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Desktop cursor-follow preview */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[340px] w-[270px] overflow-hidden md:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: active !== null ? 1 : 0, scale: active !== null ? 1 : 0.85 }}
        transition={{ duration: 0.5, ease }}
      >
        <AnimatePresence mode="popLayout">
          {active !== null && (
            <motion.img
              key={active}
              src={services[active]?.img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ---------------- EXPERIENCE ---------------- */
export function Experience() {
  const { open: openBooking } = useBooking();
  return (
    <section id="experience" className="relative bg-charcoal py-40">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-6 md:grid-cols-12 md:px-12">
        <Reveal className="md:col-span-6">
          <ParallaxImage src={shave} alt="A straight razor shave with warm lather" className="aspect-[4/5] w-full" />
        </Reveal>
        <div className="md:col-span-5 md:col-start-8 md:pt-40">
          <p className="label text-smoke">IV — The Experience</p>
          <h2 className="display mt-6 text-5xl md:text-7xl">
            <MaskLine>Step in.</MaskLine>
            <MaskLine delay={0.1}>The street</MaskLine>
            <MaskLine delay={0.2} className="italic text-bone">goes quiet.</MaskLine>
          </h2>
          <div className="mt-12 space-y-8 text-sm leading-relaxed text-ivory/65">
            <p>
              Your coat is taken at the door. A coffee, or something stronger, is poured while
              your barber listens. No screens, no rush, no queue — appointments only, never more
              than three chairs in use.
            </p>
            <p>
              Hot towels steeped in cedar. Straight razors honed by hand each morning. Products
              chosen because they work, not because they shout.
            </p>
          </div>
          <button
            type="button"
            onClick={openBooking}
            className="label link-line mt-14 inline-block text-brass"
          >
            Reserve your chair
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOUNDER ---------------- */
export function Founder() {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-40 md:px-12 md:py-56">
      <div className="mx-auto grid max-w-[1600px] items-center gap-16 md:grid-cols-12">
        <div className="order-2 md:order-1 md:col-span-6">
          <p className="label text-smoke">V — The Founder</p>
          <blockquote className="display mt-10 text-5xl italic leading-[1.02] md:text-[5.5vw]">
            <MaskLine>"A gentleman</MaskLine>
            <MaskLine delay={0.1}>does not rush</MaskLine>
            <MaskLine delay={0.2}>the moment."</MaskLine>
          </blockquote>
          <div className="mt-14 grid max-w-lg gap-8 md:grid-cols-2">
            <div>
              <p className="display text-3xl">Anton Kessler</p>
              <p className="label mt-2 text-brass">Founder · Master Barber</p>
            </div>
            <p className="text-sm leading-relaxed text-ivory/60">
              Trained in Vienna and Naples, twenty-eight years behind the chair. Anton opened the
              Maison to keep a slower kind of barbering alive.
            </p>
          </div>
        </div>
        <div className="relative order-1 md:order-2 md:col-span-5 md:col-start-8">
          <Reveal>
            <ParallaxImage src={founder} alt="Portrait of founder Anton Kessler in his atelier" className="aspect-[4/5] w-full" strength={8} />
          </Reveal>
          <span className="display absolute -bottom-10 -left-6 text-[9rem] italic leading-none text-brass/30 md:-left-20">
            AK
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CINEMATIC PAUSE ---------------- */
export function Pause() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const inset = useTransform(scrollYProgress, [0, 0.4], ["inset(12% 10% 12% 10%)", "inset(0% 0% 0% 0%)"]);
  const textO = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="grain absolute inset-0" style={{ clipPath: inset }}>
          <motion.img
            src={interior}
            alt="An empty barber chair beneath warm lamplight"
            loading="lazy"
            style={{ scale }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/45" />
        </motion.div>
        <motion.div style={{ opacity: textO }} className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="label text-bone">After hours</p>
          <p className="display mt-6 max-w-3xl text-5xl italic md:text-7xl">
            The chair is waiting. So is the conversation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
export function Gallery() {
  return (
    <section id="gallery" className="px-6 py-40 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between">
          <h2 className="display text-6xl md:text-8xl">
            <MaskLine>Inside</MaskLine>
            <MaskLine delay={0.1} className="italic text-bone">the Maison</MaskLine>
          </h2>
          <p className="label hidden text-smoke md:block">VI — Gallery</p>
        </div>
        <div className="mt-24 grid grid-cols-12 gap-4 md:gap-8">
          <Reveal className="col-span-12 md:col-span-7">
            <ParallaxImage src={tools} alt="Barber tools on walnut" className="aspect-[4/3]" />
          </Reveal>
          <Reveal className="col-span-7 md:col-span-4 md:col-start-9 md:mt-48">
            <ParallaxImage src={beard} alt="Beard sculpting" className="aspect-[3/4]" />
          </Reveal>
          <Reveal className="col-span-5 mt-24 md:col-span-3 md:col-start-2 md:-mt-24">
            <ParallaxImage src={shave} alt="Classic shave" className="aspect-[3/4]" />
          </Reveal>
          <Reveal className="col-span-12 md:col-span-6 md:col-start-6 md:mt-12">
            <ParallaxImage src={interior} alt="The barber floor" className="aspect-[16/10]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BOOKING ---------------- */
export function Booking() {
  const { open: openBooking } = useBooking();
  return (
    <section id="book" className="relative overflow-hidden bg-ivory px-6 py-40 text-ink md:px-12 md:py-56">
      <div className="mx-auto max-w-[1600px]">
        <p className="label text-ink/50">VII — Reservations</p>
        <h2 className="display mt-8 text-[15vw] md:text-[10vw]">
          <MaskLine>Take a seat.</MaskLine>
          <MaskLine delay={0.1} className="italic md:pl-[20vw]">
            We'll take care of the rest.
          </MaskLine>
        </h2>
        <div className="mt-20 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-sm text-sm leading-relaxed text-ink/60">
            Appointments only. Reserve online or call the Maison — we hold your chair for fifteen
            minutes.
          </p>
          <div className="flex flex-wrap items-center gap-10">
            <button
              type="button"
              onClick={openBooking}
              className="label bg-ink px-10 py-6 text-ivory transition-colors duration-500 hover:bg-charcoal"
            >
              Book an appointment
            </button>
            <a href="tel:+493012345678" className="label link-line">+49 30 1234 5678</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- LOCATION ---------------- */
const hours = [
  ["Monday", "Closed"],
  ["Tue — Fri", "10:00 — 20:00"],
  ["Saturday", "09:00 — 18:00"],
  ["Sunday", "By invitation"],
];

export function Location() {
  return (
    <section id="contact" className="px-6 py-40 md:px-12">
      <div className="mx-auto grid max-w-[1600px] gap-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="label text-smoke">VIII — Find us</p>
          <h2 className="display mt-6 text-5xl md:text-7xl">
            Kastanienallee <span className="italic text-bone">48</span>
          </h2>
          <p className="mt-8 text-sm leading-relaxed text-ivory/60">
            10435 Berlin — Prenzlauer Berg
            <br />
            Ring the brass bell beside the green door.
          </p>
          <a
            href="https://maps.google.com/?q=Kastanienallee+48+Berlin"
            target="_blank"
            rel="noreferrer"
            className="label link-line mt-10 inline-block text-brass"
          >
            Open in maps
          </a>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <p className="label text-smoke">Opening hours</p>
          <dl className="mt-8">
            {hours.map(([d, h]) => (
              <div key={d} className="flex items-baseline justify-between py-5">
                <dt className="display text-3xl">{d}</dt>
                <dd className="label text-ivory/60">{h}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
