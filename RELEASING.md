# Releasing

How to cut a new version of the Booking Widgets source archive.

This repo is a source-of-truth monorepo — there is no central deployment. Each widget is built and embedded per customer, so a "release" here just marks a coherent snapshot of the source.

## Versioning scheme

Semantic versioning under the **0.x** line. One version covers the whole monorepo.

- **Minor** (`v0.1.0 → v0.2.0`) — new widgets added, or feature/UX/behavioral changes to an existing widget
- **Patch** (`v0.1.0 → v0.1.1`) — bug fixes and internal refactors only

## To cut a release

1. In `CHANGELOG.md`, move every entry under `## [Unreleased]` into a new section `## [v0.X.Y] - YYYY-MM-DD`. Leave a fresh empty `## [Unreleased]` header above it. Prefix entries with the widget folder they touch (e.g. `valiant-roofing: …`).
2. Commit:
   ```
   git commit -am "Release v0.X.Y"
   ```
3. Tag the release commit and push both:
   ```
   git tag -a v0.X.Y -m "Release v0.X.Y"
   git push origin main v0.X.Y
   ```

## Rolling back

**Code rollback (forward-fix):**
```
git revert <bad-sha>
git push origin main
```

If a customer's embedded widget needs the previous build, rebuild it from the prior tag:
```
git checkout v0.X.Y -- <widget-folder>
```

**Inspect a previous tree locally:**
```
git checkout v0.X.Y
```

## During development

Add Changelog entries as you go — under `## [Unreleased]`, grouped by `### Added` / `### Changed` / `### Fixed` / `### Removed`, prefixed with the widget folder. At release time, the section is already drafted.
