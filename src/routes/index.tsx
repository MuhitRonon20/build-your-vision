import { createFileRoute } from "@tanstack/react-router";
import { Footer, Intro, Nav } from "@/components/club/Chrome";
import { BookingProvider } from "@/components/club/BookingOverlay";
import {
  Booking,
  CraftStory,
  Experience,
  Founder,
  Gallery,
  Hero,
  Location,
  Pause,
  Philosophy,
  Services,
} from "@/components/club/Sections";

const title = "Maison Kessler — Gentlemen's Barber Club, Berlin";
const description =
  "An editorial gentlemen's barber club. Signature cuts, straight razor shaves and an unhurried ritual behind a quiet door in Berlin.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="overflow-x-clip">
      <Intro />
      <BookingProvider>
      <Nav />
      <Hero />
      <Philosophy />
      <CraftStory />
      <Services />
      <Experience />
      <Founder />
      <Pause />
      <Gallery />
      <Booking />
      <Location />
      <Footer />
      </BookingProvider>
    </main>
  );
}
