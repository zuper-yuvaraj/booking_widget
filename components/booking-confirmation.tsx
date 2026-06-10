"use client"

import { Phone, Mail, CalendarCheck, ClipboardList } from "lucide-react"
import type { FormData } from "@/types/booking"
import { COMPANY_NAME } from "@/configs"

interface BookingConfirmationProps {
  formData: FormData
}

// Particles distributed around the checkmark circle
const PARTICLES = [
  { top: "-18px", left: "50%",   color: "var(--brand-terra)",   d: "1.0s", dy: "0.0s" },
  { top: "10%",   left: "-14px", color: "var(--brand-forest)",  d: "1.1s", dy: "0.1s" },
  { top: "10%",   left: "calc(100% + 6px)", color: "hsl(40,60%,62%)", d: "1.0s", dy: "0.15s" },
  { top: "55%",   left: "-20px", color: "var(--brand-terra)",   d: "1.2s", dy: "0.2s"  },
  { top: "55%",   left: "calc(100% + 12px)", color: "var(--brand-forest)", d: "1.1s", dy: "0.05s" },
  { top: "calc(100% + 4px)", left: "30%", color: "hsl(40,60%,58%)", d: "1.0s", dy: "0.25s" },
  { top: "calc(100% + 4px)", left: "68%", color: "var(--brand-terra)", d: "1.2s", dy: "0.1s" },
]

export default function BookingConfirmation({ formData }: BookingConfirmationProps) {
  const formatDate = (s: string) =>
    new Date(s + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "America/New_York",
    })

  const details = [
    { label: "Name",    value: `${formData.firstName} ${formData.lastName}` },
    { label: "Phone",   value: formData.phone },
    { label: "Email",   value: formData.email },
    { label: "Address", value: formData.address },
    { label: "Service", value: formData.serviceType, capitalize: true },
    { label: "Date",    value: formatDate(formData.selectedDate) },
    { label: "Time",    value: formData.selectedSlot },
  ]

  const nextSteps = [
    { icon: Mail,          title: "Confirmation email sent",  description: "Check your inbox for your booking details." },
    { icon: Phone,         title: "We'll call to confirm",    description: "Our team will reach out within 1 business day." },
    { icon: ClipboardList, title: "Free inspection visit",    description: "Our inspector will assess and provide a detailed quote." },
  ]

  return (
    <div className="max-w-lg mx-auto py-10 px-6">
      {/* ── Animated success mark ─────────────────────── */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-6">
          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ background: "var(--brand-forest)", opacity: 0.15 }}
          />

          {/* Circle + checkmark */}
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center animate-circle-expand"
            style={{ background: "var(--brand-forest-light)", border: "3px solid var(--brand-forest)" }}
          >
            <svg
              viewBox="0 0 52 52"
              className="w-12 h-12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="checkmark-path"
                d="M14 27l8 8 16-16"
                stroke="var(--brand-forest)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Confetti particles */}
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="particle"
              style={{
                top: p.top, left: p.left,
                background: p.color,
                "--duration": p.d,
                "--delay": p.dy,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <h1 className="font-heading text-3xl font-bold mb-3" style={{ color: "hsl(220,15%,12%)" }}>
          You're all set!
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "hsl(220,10%,45%)" }}>
          Thanks for booking with{" "}
          <span className="font-semibold" style={{ color: "hsl(220,15%,18%)" }}>{COMPANY_NAME}</span>.
          <br />
          Your free inspection is confirmed for{" "}
          <span className="font-semibold" style={{ color: "var(--brand-forest)" }}>
            {formatDate(formData.selectedDate)}
          </span>{" "}
          at{" "}
          <span className="font-semibold" style={{ color: "var(--brand-terra)" }}>
            {formData.selectedSlot}
          </span>
          .
        </p>
      </div>

      {/* ── Booking details card ──────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden mb-5"
        style={{ boxShadow: "0 2px 12px rgba(46,96,78,0.09)", border: "1.5px solid hsl(40,18%,88%)" }}
      >
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ background: "var(--brand-forest)" }}
        >
          <CalendarCheck className="w-4 h-4 text-white opacity-80" />
          <h2 className="text-xs font-semibold text-white uppercase tracking-widest">
            Booking Details
          </h2>
        </div>
        <div className="bg-white divide-y" style={{ divideColor: "hsl(40,18%,94%)" }}>
          {details.map(({ label, value, capitalize }) => (
            <div key={label} className="flex justify-between items-center px-5 py-3">
              <span className="text-sm" style={{ color: "hsl(220,8%,55%)" }}>{label}</span>
              <span
                className={`text-sm font-medium text-right max-w-[55%] ${capitalize ? "capitalize" : ""}`}
                style={{ color: label === "Time" ? "var(--brand-terra)" : "hsl(220,15%,14%)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── What's next ───────────────────────────────── */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--brand-forest-light)", border: "1.5px solid hsl(158,25%,82%)" }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--brand-forest-mid)" }}
        >
          What Happens Next
        </h2>
        <div className="space-y-4">
          {nextSteps.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--brand-forest)" }}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "hsl(220,15%,18%)" }}>{title}</p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(220,8%,52%)" }}>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs" style={{ color: "hsl(220,8%,60%)" }}>
        Questions? Contact us or reply to your confirmation email.
      </p>
    </div>
  )
}
