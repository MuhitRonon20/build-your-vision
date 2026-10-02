import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ease } from "./primitives";
import { useBooking } from "./BookingOverlay";

export const BRAND = "Maison Kessler";

export function Intro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1300);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.32em" }}
            transition={{ duration: 1.1, ease }}
            className="text-center"
          >
            <div className="display text-4xl italic text-ivory">MK</div>
            <div className="label mt-4 text-smoke">Gentlemen's Barber Club</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const links = [
  ["Experience", "#experience"],
  ["Services", "#services"],
  ["About", "#about"],
  ["Gallery", "#gallery"],
  ["Contact", "#contact"],
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: openBooking } = useBooking();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 2.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled ? "bg-ink/80 py-4 backdrop-blur-md" : "py-7"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
          <a href="#top" className="display text-2xl text-ivory">
            Maison <span className="italic">Kessler</span>
          </a>
          <nav className="hidden items-center gap-10 lg:flex">
            {links.map(([l, h]) => (
              <a key={l} href={h} className="label link-line text-ivory/80 hover:text-ivory">
                {l}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={openBooking}
            className="label link-line hidden text-brass lg:inline-block"
          >
            Book appointment
          </button>
          <button
            onClick={() => setOpen(true)}
            className="label text-ivory lg:hidden"
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 py-7"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex items-center justify-between">
              <span className="display text-2xl">
                Maison <span className="italic">Kessler</span>
              </span>
              <button onClick={() => setOpen(false)} className="label" aria-label="Close menu">
                Close
              </button>
            </div>
            <nav className="mt-auto flex flex-col gap-2">
              {links.map(([l, h], i) => (
                <motion.a
                  key={l}
                  href={h}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease, delay: 0.25 + i * 0.06 }}
                  className="display text-6xl"
                >
                  <span className="label mr-4 align-middle text-smoke">0{i + 1}</span>
                  {l}
                </motion.a>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openBooking();
              }}
              className="label mt-12 bg-ivory py-5 text-center text-ink"
            >
              Book appointment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  const { open: openBooking } = useBooking();
  return (
    <footer className="bg-ink px-6 pb-10 pt-32 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="display select-none text-[18vw] leading-[0.8] text-ivory/[0.06]">
          Kessler
        </div>
        <div className="mt-12 flex flex-col justify-between gap-6 text-smoke md:flex-row md:items-end">
          <p className="label">© 2026 Maison Kessler — Gentlemen's Barber Club</p>
          <div className="flex gap-8">
            <a href="#" className="label link-line">Instagram</a>
            <a href="#" className="label link-line">Journal</a>
            <button type="button" onClick={openBooking} className="label link-line text-brass">Reserve</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
