import { AnimatePresence, motion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import interior from "@/assets/interior.jpg";
import { ease } from "./primitives";

/* ---------------- Context ---------------- */
const BookingCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useBooking = () => useContext(BookingCtx);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return (
    <BookingCtx.Provider value={{ open }}>
      {children}
      <BookingOverlay isOpen={isOpen} onClose={close} />
    </BookingCtx.Provider>
  );
}

/* ---------------- Data ---------------- */
const services = [
  "Signature Haircut",
  "Haircut & Beard",
  "Beard Craft",
  "Classic Shave",
  "Gentlemen's Grooming",
  "Premium Grooming Experience",
];

const barbers = [
  "Any Available Barber",
  "Anton Kessler — Master Barber",
  "Senior Barber",
  "Junior Barber",
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function slotsFor(date: Date): string[] {
  const day = date.getDay(); // 0 Sun … 6 Sat
  const fmt = (h: number, m: number) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const out: string[] = [];
  if (day === 6) {
    for (let h = 9; h <= 17; h++) {
      out.push(fmt(h, 0));
      if (h < 17) out.push(fmt(h, 30));
    }
  } else if (day >= 2 && day <= 5) {
    for (let h = 10; h <= 19; h++) {
      out.push(fmt(h, 0));
      if (h < 19) out.push(fmt(h, 30));
    }
  }
  return out;
}

function isBookable(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d < today) return false;
  const day = d.getDay();
  return day !== 0 && day !== 1; // Mon closed, Sun by invitation
}

/* ---------------- Field primitives ---------------- */
function Field({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string | undefined;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label text-smoke">
        {label}
      </label>
      <div className="mt-3">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mt-2 text-xs tracking-wide text-brass"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-ivory/15 py-3 text-base text-ivory placeholder:text-ivory/30 outline-none transition-colors duration-500 focus:border-brass";

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        className={`${inputCls} cursor-pointer appearance-none pr-8 ${
          value === "" ? "text-ivory/30" : ""
        }`}
      >
        <option value="" disabled className="bg-charcoal text-ivory/50">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-charcoal text-ivory">
            {o}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-xs text-smoke"
      >
        ↓
      </span>
    </div>
  );
}

/* ---------------- Calendar ---------------- */
function Calendar({
  value,
  onSelect,
}: {
  value: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = useMemo(() => {
    const y = view.getFullYear();
    const m = view.getMonth();
    const first = new Date(y, m, 1);
    const startOffset = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(y, m, d));
    return arr;
  }, [view]);

  const canPrev =
    view.getFullYear() > today.getFullYear() ||
    (view.getFullYear() === today.getFullYear() && view.getMonth() > today.getMonth());

  const move = (dir: 1 | -1) =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() + dir, 1));

  const sameDay = (a: Date | null, b: Date | null) =>
    !!a && !!b && a.toDateString() === b.toDateString();

  return (
    <div className="select-none">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => canPrev && move(-1)}
          disabled={!canPrev}
          aria-label="Previous month"
          className="label px-2 py-1 text-ivory/60 transition-colors duration-300 hover:text-ivory disabled:opacity-20"
        >
          ←
        </button>
        <p className="display text-2xl italic text-bone">
          {monthNames[view.getMonth()]} {view.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next month"
          className="label px-2 py-1 text-ivory/60 transition-colors duration-300 hover:text-ivory"
        >
          →
        </button>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {dayNames.map((d) => (
          <span key={d} className="label py-2 text-smoke">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} aria-hidden />;
          const day: Date = d;
          const ok = isBookable(day);
          const selected = sameDay(d, value);
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={!ok}
              onClick={() => onSelect(d)}
              aria-pressed={selected}
              aria-label={d.toDateString()}
              className={`display aspect-square text-lg transition-all duration-300 ${
                selected
                  ? "bg-ivory text-ink"
                  : ok
                    ? "text-ivory/80 hover:bg-ivory/10 hover:text-ivory"
                    : "text-ivory/15"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ivory/40">
        Open Tuesday to Saturday. Mondays closed, Sundays by invitation.
      </p>
    </div>
  );
}

/* ---------------- Overlay ---------------- */
type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  barber: string;
  date: Date | null;
  time: string;
  notes: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  barber: "",
  date: null,
  time: "",
  notes: "",
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BookingOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // Scroll lock + ESC
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  // Reset shortly after closing
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setForm(emptyForm);
        setErrors({});
        setSubmitted(false);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Please enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Please enter your phone number.";
    if (!form.service) e.service = "Please select a service.";
    if (!form.date) e.date = "Please choose an appointment date.";
    if (!form.time) e.time = "Please choose a preferred time.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    // Submission is frontend-only for now; ready to be wired to a backend.
    setSubmitted(true);
    panelRef.current?.scrollTo({ top: 0 });
  };

  const slots = form.date ? slotsFor(form.date) : [];

  const summaryRows: [string, string][] = [
    ["Service", form.service],
    ["Barber", form.barber || "Any Available Barber"],
    ["Date", form.date ? formatDate(form.date) : ""],
    ["Time", form.time],
    ["Name", form.name],
    ["Phone", form.phone],
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90]"
          role="dialog"
          aria-modal="true"
          aria-label="Book an appointment"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className="absolute inset-0 overflow-y-auto bg-ink outline-none md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-none"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease }}
          >
            <div className="grain relative min-h-full bg-ink">
              {/* Close */}
              <motion.button
                type="button"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="label link-line fixed right-6 top-6 z-10 text-ivory md:right-12 md:top-8"
                aria-label="Close booking"
              >
                × Close
              </motion.button>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <Success key="success" form={form} onClose={onClose} onAgain={() => {
                    setForm(emptyForm);
                    setSubmitted(false);
                  }} />
                ) : (
                  <motion.div
                    key="form"
                    className="mx-auto grid min-h-[100svh] max-w-[1600px] md:grid-cols-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                  >
                    {/* Left — image & heading */}
                    <div className="relative overflow-hidden md:col-span-5">
                      <motion.img
                        src={interior}
                        alt="An empty barber chair beneath warm lamplight"
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ scale: 1.12, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.6, ease, delay: 0.3 }}
                      />
                      <div className="shade-bottom absolute inset-0" />
                      <div className="shade-left absolute inset-0" />
                      <div className="relative z-10 flex h-full min-h-[42svh] flex-col justify-end p-6 pb-10 md:min-h-0 md:p-12 md:pb-16">
                        <motion.p
                          className="label text-bone"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.7 }}
                        >
                          Appointment
                        </motion.p>
                        <h2 className="display mt-4 text-6xl md:text-7xl">
                          <span className="block overflow-hidden pb-[0.08em]">
                            <motion.span
                              className="block"
                              initial={{ y: "110%" }}
                              animate={{ y: "0%" }}
                              transition={{ duration: 1.1, ease, delay: 0.75 }}
                            >
                              Your chair
                            </motion.span>
                          </span>
                          <span className="block overflow-hidden pb-[0.08em]">
                            <motion.span
                              className="block italic text-bone"
                              initial={{ y: "110%" }}
                              animate={{ y: "0%" }}
                              transition={{ duration: 1.1, ease, delay: 0.88 }}
                            >
                              is waiting.
                            </motion.span>
                          </span>
                        </h2>
                        <motion.p
                          className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/70"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.9, ease, delay: 1.05 }}
                        >
                          Reserve a time below and we will hold the chair for you. Appointments
                          only — never more than three chairs in use.
                        </motion.p>
                      </div>
                    </div>

                    {/* Right — form */}
                    <motion.form
                      noValidate
                      onSubmit={submit}
                      className="px-6 pb-24 pt-16 md:col-span-6 md:col-start-7 md:px-12 md:pt-28"
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.07, delayChildren: 0.55 } },
                      }}
                    >
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 18 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
                        }}
                      >
                        <p className="label text-smoke">I — About you</p>
                        <div className="mt-8 grid gap-8 md:grid-cols-2">
                          <Field label="Full name" error={errors.name} htmlFor="bk-name">
                            <input
                              id="bk-name"
                              type="text"
                              autoComplete="name"
                              placeholder="Your full name"
                              value={form.name}
                              onChange={(e) => set("name", e.target.value)}
                              aria-invalid={!!errors.name || undefined}
                              className={inputCls}
                            />
                          </Field>
                          <Field label="Phone number" error={errors.phone} htmlFor="bk-phone">
                            <input
                              id="bk-phone"
                              type="tel"
                              autoComplete="tel"
                              placeholder="+49 000 000000"
                              value={form.phone}
                              onChange={(e) => set("phone", e.target.value)}
                              aria-invalid={!!errors.phone || undefined}
                              className={inputCls}
                            />
                          </Field>
                          <div className="md:col-span-2">
                            <Field label="Email" error={errors.email} htmlFor="bk-email">
                              <input
                                id="bk-email"
                                type="email"
                                autoComplete="email"
                                placeholder="Your email address"
                                value={form.email}
                                onChange={(e) => set("email", e.target.value)}
                                aria-invalid={!!errors.email || undefined}
                                className={inputCls}
                              />
                            </Field>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="mt-16"
                        variants={{
                          hidden: { opacity: 0, y: 18 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
                        }}
                      >
                        <p className="label text-smoke">II — The appointment</p>
                        <div className="mt-8 grid gap-8 md:grid-cols-2">
                          <Field label="Select service" error={errors.service} htmlFor="bk-service">
                            <Select
                              id="bk-service"
                              value={form.service}
                              onChange={(v) => set("service", v)}
                              options={services}
                              placeholder="Choose a service"
                              invalid={!!errors.service}
                            />
                          </Field>
                          <Field label="Preferred barber" htmlFor="bk-barber">
                            <Select
                              id="bk-barber"
                              value={form.barber}
                              onChange={(v) => set("barber", v)}
                              options={barbers}
                              placeholder="Any available barber"
                            />
                          </Field>
                        </div>

                        <div className="mt-12 grid gap-12 lg:grid-cols-2">
                          <Field label="Preferred date" error={errors.date}>
                            <Calendar
                              value={form.date}
                              onSelect={(d) => {
                                set("date", d);
                                set("time", "");
                              }}
                            />
                          </Field>
                          <Field label="Preferred time" error={errors.time}>
                            {form.date ? (
                              slots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                  {slots.map((t) => (
                                    <button
                                      key={t}
                                      type="button"
                                      onClick={() => set("time", t)}
                                      aria-pressed={form.time === t}
                                      className={`py-3 text-sm tracking-widest transition-all duration-300 ${
                                        form.time === t
                                          ? "bg-ivory text-ink"
                                          : "bg-ivory/[0.04] text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
                                      }`}
                                    >
                                      {t}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-ivory/50">
                                  No regular slots on this day.
                                </p>
                              )
                            ) : (
                              <p className="text-sm leading-relaxed text-ivory/40">
                                Choose a date first — available times will appear here.
                              </p>
                            )}
                          </Field>
                        </div>

                        <div className="mt-12">
                          <Field label="Additional notes — optional" htmlFor="bk-notes">
                            <textarea
                              id="bk-notes"
                              rows={3}
                              placeholder="Anything we should know before your appointment?"
                              value={form.notes}
                              onChange={(e) => set("notes", e.target.value)}
                              className={`${inputCls} resize-none`}
                            />
                          </Field>
                        </div>
                      </motion.div>

                      {/* Summary + submit */}
                      <motion.div
                        className="mt-16"
                        variants={{
                          hidden: { opacity: 0, y: 18 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
                        }}
                      >
                        <p className="label text-smoke">III — Your appointment</p>
                        <dl className="mt-8 space-y-4">
                          {summaryRows.map(([k, v]) => (
                            <div key={k} className="flex items-baseline justify-between gap-6">
                              <dt className="label text-ivory/40">{k}</dt>
                              <dd
                                className={`display text-right text-2xl ${
                                  v ? "text-ivory" : "italic text-ivory/25"
                                }`}
                              >
                                {v || "—"}
                              </dd>
                            </div>
                          ))}
                        </dl>
                        <button
                          type="submit"
                          className="label mt-14 w-full bg-ivory px-10 py-6 text-ink transition-colors duration-500 hover:bg-brass md:w-auto"
                        >
                          Confirm appointment
                        </button>
                      </motion.div>
                    </motion.form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Success ---------------- */
function Success({
  form,
  onClose,
  onAgain,
}: {
  form: FormState;
  onClose: () => void;
  onAgain: () => void;
}) {
  const rows: [string, string][] = [
    ["Service", form.service],
    ["Date", form.date ? formatDate(form.date) : ""],
    ["Time", form.time],
    ["Preferred barber", form.barber || "Any Available Barber"],
  ];
  return (
    <motion.div
      className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-32 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      <motion.p
        className="label text-brass"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Appointment request received
      </motion.p>
      <h2 className="display mt-8 text-6xl md:text-8xl">
        <span className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease, delay: 0.4 }}
          >
            Thank you,
          </motion.span>
        </span>
        <span className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block italic text-bone"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease, delay: 0.52 }}
          >
            {form.name.split(" ")[0]}.
          </motion.span>
        </span>
      </h2>
      <motion.p
        className="mt-8 max-w-md text-sm leading-relaxed text-ivory/65"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.7 }}
      >
        Your appointment request has been received. We look forward to welcoming you.
      </motion.p>
      <motion.dl
        className="mt-14 w-full max-w-md space-y-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.85 }}
      >
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-6">
            <dt className="label text-ivory/40">{k}</dt>
            <dd className="display text-right text-2xl text-ivory">{v}</dd>
          </div>
        ))}
      </motion.dl>
      <motion.div
        className="mt-16 flex flex-col items-center gap-8 md:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.05 }}
      >
        <button
          type="button"
          onClick={onClose}
          className="label bg-ivory px-10 py-5 text-ink transition-colors duration-500 hover:bg-brass"
        >
          Back to experience
        </button>
        <button
          type="button"
          onClick={onAgain}
          className="label link-line text-ivory/80 hover:text-ivory"
        >
          Book another appointment
        </button>
      </motion.div>
    </motion.div>
  );
}
