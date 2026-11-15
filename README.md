# Tailwind background span experiments

Three ways to paint one continuous background across sibling elements:

[View the demos](https://kevinruscoe.github.io/tailwind-bg-span/)

| Version | Demo | Technique | JavaScript |
| --- | --- | --- | --- |
| [Grid marker](./grid/) | [HTML](./grid/index.html) | Marker spans grid rows using subgrid | None |
| [Marker-free anchors](./anchor-marker-free/) | [HTML](./anchor-marker-free/index.html) | First and last siblings anchor the container's pseudo-element | Local fallback for browsers without anchors |
| [Anchor marker](./anchor-marker/) | [HTML](./anchor-marker/index.html) | An absolutely positioned marker is anchored to siblings | Optional OddBird polyfill for browsers without anchors |

Each folder contains only that version's demo, Tailwind utility, and assets.
The root package is shared build tooling; the generated stylesheets are
included. The versions use the same class names with different meanings:
**import only one version of `bg-span.css` in a project.**

## Run the demos

```sh
npm ci
npm run build
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [grid](http://127.0.0.1:8000/grid/),
[marker-free anchors](http://127.0.0.1:8000/anchor-marker-free/), or
[anchor marker](http://127.0.0.1:8000/anchor-marker/). HTTP also lets the
OddBird polyfill read local stylesheets; opening files directly may not work.
Use `npm run build:grid`, `npm run build:marker-free`, or
`npm run build:anchor-marker` to build one version; corresponding `watch:*`
scripts rebuild on changes.

## Install

Copy the chosen folder's `bg-span.css` to a Tailwind CSS 4 project and import
it in the Tailwind entry stylesheet:

```css
@import "tailwindcss";
@import "./bg-span.css";
```

Rebuild Tailwind after changing the HTML. The utility files are Tailwind source,
not browser-ready CSS. The included optimized builds flatten CSS nesting.
Each demo build scans only its own `index.html`; use your project's source
configuration when integrating it.
Copy `bg-span-polyfill.js` too if using the marker-free fallback.
Background image URLs are relative to the compiled stylesheet.

## 1. Grid marker

```html
<main class="bg-span-container">
  <div class="bg-span bg-span-3 bg-span-top-1/2 bg-span-bottom-1/4 bg-[url('./background.svg')]" aria-hidden="true"></div>
  <section>First</section>
  <section>Middle</section>
  <section>Last</section>
</main>
```

- The marker precedes the consecutive direct children. `bg-span` defaults to
  three; a positive integer such as `bg-span-4` selects a different count.
- Top and bottom offsets default to `1/2`. Fractional, integer-percent, and
  arbitrary percentage or length values are supported, as are responsive
  variants such as `md:bg-span-top-1/2`.
- The container is a grid, so other grid layouts or intervening elements can
  affect placement. There is no fallback for missing subgrid or container units.
- Solid masks hide the ends of the image. Set `--bg-span-mask-color` on the
  container to match the surrounding color; masks cannot reproduce an
  underlying image or gradient.

## 2. Marker-free anchors

```html
<main class="bg-span-container [--bg-span-image:url('./background.svg')]">
  <section class="bg-span">First</section>
  <section>Middle</section>
  <section>Last</section>
</main>
```

- Put `bg-span` on the first direct child; three children are covered by
  default. `bg-span-2`, `bg-span-3`, and `bg-span-4` select a count. Set the
  image or color on the container using `--bg-span-image`.
- One span is supported per container, with halfway offsets only. Arbitrary
  counts and responsive offsets are not implemented. The specified number of
  consecutive direct siblings must exist.
- The container's `::after` draws the background, so it cannot be used for
  something else. The utility also assigns `anchor-name` to the first and last
  children.
- In browsers without native anchors, include the local fallback:

  ```html
  <script src="bg-span-polyfill.js" defer></script>
  ```

  This is specific to this sample, not a general anchor polyfill. It requires
  JavaScript and `ResizeObserver`; it observes size changes and viewport
  resizing. Containers, direct children, and start classes must remain unchanged
  after initialization. Transformed children or containers, and scrolling
  containers, are not supported.

## 3. Anchor marker

```html
<main class="bg-span-container">
  <div class="bg-span bg-span-a bg-span-4 bg-[url('./background.svg')]" aria-hidden="true"></div>
  <section>First</section>
  <section>Middle</section>
  <section>Middle</section>
  <section>Last</section>
</main>
```

- The absolutely positioned marker carries the background and does not
  participate in grid layout. Three children are covered by default;
  `bg-span-2` and `bg-span-4` select a different count.
- Each marker needs its own anchor name. This sample provides `bg-span-a` and
  `bg-span-b`, each usable once in the document. Reusing one can target the
  wrong siblings. Additional spans need explicitly named utilities.
- Counts are limited to 2 through 4, with halfway offsets only. The specified
  consecutive direct siblings must exist, without intervening markers. The
  utility assigns `anchor-name` to the first and last children.
- The demo loads [OddBird's polyfill](https://github.com/oddbird/css-anchor-positioning)
  0.10.2 from unpkg when native anchor positioning is unavailable. This needs
  JavaScript, a network connection, and HTTP-served stylesheets. The polyfill
  does not support dynamically added or removed anchors or targets, and does
  not fill gaps in browsers with partial native anchor support.

  To include the same fallback in another page:

  ```html
  <script type="module">
    if (!CSS.supports("top", "anchor(--bg-span-a-start 50%)")) {
      const { default: polyfill } = await import("https://unpkg.com/@oddbird/css-anchor-positioning@0.10.2/dist/css-anchor-positioning-fn.js");
      await polyfill();
    }
  </script>
  ```

## Browser support

Estimated minimum versions for these examples, including
[Tailwind CSS 4's requirements](https://tailwindcss.com/docs/compatibility):

| Browser | Grid marker | Native anchors (both anchor examples) |
| --- | --- | --- |
| Chrome / Edge | 117 (2023) | 125 (2024) |
| Safari / iOS Safari | 16.4 (2023) | 26 (2025) |
| Firefox | 128 (2024) | 147 (2026) |

These are feature-based estimates, not comprehensive browser tests. Can I Use
reports partial support for the wider anchor-positioning specification in
many of these versions. The native examples were tested in Chromium; both
fallbacks were tested in Firefox 139 for the supplied layouts and resizing.
Other versions and use cases still need testing.

Can I Use's worldwide usage estimates on November 15, 2026:

| Feature | Full support | Partial support |
| --- | ---: | ---: |
| [Subgrid](https://caniuse.com/css-subgrid) | 94.68% | 0% |
| [Container query units](https://caniuse.com/css-container-query-units) | 96.03% | 0% |
| [CSS anchor positioning](https://caniuse.com/css-anchor-positioning) | 2.75% | 85.2% |

These are individual feature estimates, not combined support percentages for
the examples or their fallbacks.
