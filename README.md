# GetTruckDrivers — A Fleet in Motion

An independent website, brand, and motion design concept created by **Yash Patel** specifically for GetTruckDrivers.com. This is a portfolio demonstration, not the company's official website or an affiliated service.

**Live demo:** https://yashvinodbhaipatel.github.io/gettruckdrivers-premium-demo/

## Design direction

Warm ivory, signal orange, and evergreen create a confident editorial identity. A classic serif and a clean sans balance personality and operational clarity. Original isometric trucking artwork replaces generic stock photography.

## Experience

- Original canvas highway scene with moving trucks, a pointer-responsive camera, and an alternate viewpoint.
- Branded loading sequence, scroll reveals, animated vector illustrations, and a moving editorial strip.
- Interactive four-stage recruiting journey with keyboard-accessible tabs.
- Editable fleet opportunity calculator with transparent assumptions.
- Thirty-second typographic concept film with playback, replay, and scrubbing.
- Three full sample editorial articles and coordinated cover designs.
- Fleet enquiry demo that creates a downloadable local brief, with an optional link to official booking.
- Responsive navigation, native modal focus containment, reduced-motion support, and a manual motion toggle.

## Run locally

No install or build step is required. From the repository root:

```sh
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`.

## Files

- `dist/index.html` — page content and modal structures.
- `dist/styles.css` — design tokens, responsive layouts, and animation.
- `dist/app.js` — interactions, calculator, film, and enquiry brief.
- `dist/scene.js` — original dependency-free canvas illustration.
- `dist/assets/favicon.svg` — concept mark.

## Demo boundaries

No real enquiries are submitted, no appointments are reserved, and no form information is sent or persisted. The calculator estimates gross revenue capacity using user inputs × 4.33 weeks; it does not project profit or recruiting results. The sample articles and recruiting framework are original illustrative concept content. No fabricated clients, testimonials, or performance statistics are used.

Brand context comes from the supplied role brief and the official GetTruckDrivers website, including https://gettruckdrivers.com/ and https://gettruckdrivers.com/calendar. All new copy and illustrations are created for the concept. Google Fonts serves DM Sans and DM Serif Display, with system font fallbacks. There are no JavaScript dependencies.

## Deployment

Published on GitHub Pages from `main`, repository root. The root page redirects to `dist/`. You can also serve `dist/` directly using any static host. No credentials belong in this repository.
