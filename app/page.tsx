import BookingWizard from "@/components/booking-wizard"

export default function Home() {
  return (
    <main
      className="min-h-screen sm:py-10"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <BookingWizard />
    </main>
  )
}
