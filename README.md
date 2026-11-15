# Tailwind background span utility

A CSS-only Tailwind CSS 4 utility for backgrounds spanning sibling sections. A
decorative marker determines where the background starts; no section wrapper or
runtime JavaScript is needed.

[View the live demo](https://kevinruscoe.github.io/tailwind-bg-span/)

## Install

Copy [`bg-span.css`](./bg-span.css) into your Tailwind CSS 4 project and import
it in your Tailwind entry stylesheet:

```css
@import "tailwindcss";
@import "./bg-span.css";
```

Adjust the path if you copy the file elsewhere, then rebuild your Tailwind CSS.
Tailwind generates the utilities used in your project's scanned source files.
The utility file is Tailwind source CSS, not a browser-ready stylesheet; it
must be processed by Tailwind. For the browser support listed below, use a build
that flattens CSS nesting, such as the Tailwind CLI's `--optimize` option.

## Run the demo

```sh
npm ci
npm run build
```

Open `index.html` in a browser. Run `npm run watch` to rebuild while editing, or
run `npm run build` after changing the HTML or utility CSS. Both commands flatten
the nested Tailwind source rules in the generated CSS.

## Usage

Add `bg-span-container` to the parent and put a `bg-span` marker immediately
before the sections it should cover:

```html
<main class="bg-span-container">
  <div
    class="bg-span bg-span-3 bg-span-top-1/2 bg-span-bottom-1/4 bg-[url('./background.svg')]"
    aria-hidden="true"
  ></div>
  <section>First section</section>
  <section>Middle section</section>
  <section>Last section</section>
</main>
```

- `bg-span` spans three sections by default. Use a positive integer such as
  `bg-span-4` to change the count.
- `bg-span-top-*` and `bg-span-bottom-*` set the offsets from the top of the
  first section and bottom of the last section. Both default to `1/2`. Fractions,
  integer percentages, and arbitrary percentages or lengths are supported, for
  example `bg-span-top-1/4`, `bg-span-bottom-25`, and
  `bg-span-bottom-[32px]`.
- Use Tailwind variants for responsive offsets, such as
  `md:bg-span-top-1/2`.
- Set the background on the marker using a Tailwind background image or color
  class. Image URLs are relative to the generated `output.css`.

The marker must be followed by the specified number of direct sibling
`section` elements. The container uses CSS Grid for its direct children, so
other grid layouts or intervening elements can affect placement. Unmarked
sections may appear before or between spans.

The top and bottom are covered with a solid mask, which defaults to white. Set
`--bg-span-mask-color` on the container to match the surrounding background:

```css
.my-page {
  --bg-span-mask-color: #f7f8f6;
}
```

These masks will not reproduce an underlying image or gradient. Background
images are decorative; provide meaningful image content separately.

## Browser support

The expected minimum versions include the requirements of
[Tailwind CSS 4](https://tailwindcss.com/docs/compatibility#browser-support):

| Browser | Minimum version | Release year |
| --- | --- | --- |
| Chrome | 117 | 2023 |
| Edge | 117 | 2023 |
| Safari / iOS Safari | 16.4 | 2023 |
| Firefox | 128 | 2024 |

These are feature-based estimates, not direct tests. The demo's optimized build
does not require native CSS nesting. There is no fallback for unsupported
browsers.

Can I Use's worldwide usage estimates as of November 15, 2026:

| Required CSS feature | Full support | Partial support |
| --- | ---: | ---: |
| [Subgrid](https://caniuse.com/css-subgrid) | 94.68% | 0% |
| [Container query units](https://caniuse.com/css-container-query-units) | 96.03% | 0% |

These percentages describe each feature individually; they are not a combined
support figure for the demo.
