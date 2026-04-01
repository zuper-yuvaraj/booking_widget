# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server with Turbopack hot reload
npm run build     # Production build (static export)
npm run start     # Run production server
npm run lint      # ESLint checks
npm run export    # Build + export static files
```

No test framework is configured.

## Architecture

This is a **Next.js 15 multi-step booking wizard** for roofing companies, built as a static export (`output: 'export'` in `next.config.mjs`). The entire app is a single-page wizard that collects address, contact info, service type, and scheduling data, then POSTs to a Zuper workflow webhook.

### Flow

`app/page.tsx` → `<BookingWizard>` (orchestrator) → Steps 1–4 → `<BookingConfirmation>`

State lives entirely in `booking-wizard.tsx` as a single `formData` object, updated via `handleUpdateFormData(field, value)`. No external state library is used.

### Steps

| Component | Purpose |
|---|---|
| `step-one.tsx` | Address selection via Google Maps Places Autocomplete + satellite map |
| `step-two.tsx` | Contact info (name, phone, email), preferred date, consent checkbox |
| `step-three.tsx` | Service type selection |
| `step-four.tsx` | Date picker, time slot + technician selection (fetches availability from API) |

Each step has its own validation function (`isStep1Valid()`, etc.) defined in `booking-wizard.tsx`.

### Key Files

- **`configs/index.ts`** — Company name, webhook URLs, company UUID, timezone. This is the primary configuration file for switching between clients (currently "Roof Tec"; "Evans Roofing and Gutters" config is commented out).
- **`types/booking.ts`** — All TypeScript interfaces: `FormData`, `UserSlot`, `TimeSlot`, `AvailabilityData`, `StepProps`, Google Maps types.
- **`hooks/use-google-maps.ts`** — Manages Google Maps API script loading lifecycle.
- **`hooks/query-params.hooks.ts`** — Reads URL search params (e.g., `company_uid` can override the default from config).

### External Integrations

- **Google Maps**: Places Autocomplete + Geocoding + satellite map. API key via `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- **Zuper webhook**: Booking submission POSTed to `CREATE_BOOKING_WEBHOOK` (configured in `configs/index.ts`).
- **Assisted scheduling API**: Fetches technician availability for Step 4.

### Styling

TailwindCSS v4 with shadcn/ui (New York style). Theme colors use oklch() CSS variables. Primary color override is `#32cd32` (lime green) in `app/globals.css`. Font is Nunito Sans.

### Multi-company Support

The widget supports multiple roofing companies via `configs/index.ts` and the `company_uid` query parameter. To switch companies, update the constants in that file (webhook URLs, UUIDs, company name, timezone).
