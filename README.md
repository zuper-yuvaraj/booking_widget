# Booking Widgets — Source Code

Source-of-truth archive for the customer-facing roofing booking widgets built at Zuper. Each top-level folder is a complete, standalone Next.js app customized for one customer. All variants derive from the same upstream template — [`ZuperHQ/roof-booking-widget`](https://github.com/ZuperHQ/roof-booking-widget), branch `roofing_template` — and were snapshotted from local working copies (including uncommitted customizations) in June 2026.

## Widgets

| Folder | Customer | Flow | Notes |
|---|---|---|---|
| `zuper-roofing/` | Zuper Roofing | Booking wizard | Canonical/original copy (local folder `OG`) |
| `zuper-for-roofing/` | Zuper For Roofing | Booking wizard | Service-area check + assisted scheduling + user-details lookup (local folder `RBP widget`) |
| `valiant-roofing/` | Valiant Roofing | Booking wizard | Local folder `valiant_roofing_rbp` |
| `legacy-construction/` | Legacy Construction | Booking wizard | Clean booking flow (local folder `Legacy_roofing_rbp`) |
| `legacy-construction-lead-qual/` | Legacy Construction | Lead qualification | Reworked wizard: lead-qual questions instead of full booking (local folder `lead_qualification`) |
| `zuper-roofing-seattle/` | Zuper Roofing Seattle | Lead qualification | Territories lookup, user profiles, EmailJS confirmation emails; see `comparison-analysis.md` inside (local folder `sales new account code ( Zuper Roofing\lead_qualification`) |

## Tech stack (all widgets)

- Next.js 15.2 (static export) + React 19 + TypeScript 5
- Tailwind CSS 4, shadcn/ui, Lucide icons
- `react-phone-number-input` for phone entry
- Zuper internal workflow webhooks (`internalwf.zuper.co`) for service-area checks, slot availability, and booking creation — webhook URLs live in each widget's `configs/index.ts`

## Running a widget

```bash
cd <widget-folder>
cp .env.example .env.local   # fill in real values — ask the Zuper team
npm install
npm run dev
```

`npm run build` produces a static export suitable for embedding.

## Secrets

No real API keys are committed. Each widget reads keys from environment variables; `.env.example` in each folder lists what's required. The real values live with the Zuper team (Zuper Pro API keys per customer account, the shared Google Maps browser key, and EmailJS credentials for the Seattle widget).

## Making changes for a customer

1. Edit the widget in its folder — customer-specific branding, webhooks, and flow toggles are centralized in `configs/index.ts`.
2. Update `CHANGELOG.md` at the repo root.
3. Commit, tag, and push per `RELEASING.md`.
