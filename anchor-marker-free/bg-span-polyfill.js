(() => {
  const status = document.getElementById("anchor-support");
  const setStatus = (message) => {
    if (status) status.textContent = message;
  };

  if (CSS.supports("top", "anchor(--bg-span-start 50%)")) {
    setStatus("Using native CSS anchor positioning.");
    return;
  }

  try {
    if (!("ResizeObserver" in window)) {
      throw new Error("The bg-span fallback requires ResizeObserver.");
    }

    const spans = Array.from(document.querySelectorAll(".bg-span-container"), (container) => {
      const children = Array.from(container.children);
      const starts = children.filter((child) => child.classList.contains("bg-span"));

      if (starts.length !== 1) {
        throw new Error("Each bg-span-container must have exactly one bg-span start.");
      }

      const start = starts[0];
      const counts = Array.from(start.classList)
        .map((name) => /^bg-span-(\d+)$/.exec(name))
        .filter((match) => match !== null)
        .map((match) => Number(match[1]));
      if (counts.length > 1 || counts.some((count) => count < 2 || count > 4)) {
        throw new Error("A bg-span start must use at most one count: 2, 3 or 4.");
      }

      const count = counts[0] ?? 3;
      const index = children.indexOf(start);
      const end = children[index + count - 1];
      if (!end) {
        throw new Error(`The bg-span start needs ${count} consecutive children.`);
      }
      return { container, children, start, end };
    });

    const update = () => {
      for (const { container, start, end } of spans) {
        const bounds = container.getBoundingClientRect();
        const first = start.getBoundingClientRect();
        const last = end.getBoundingClientRect();
        const style = getComputedStyle(container);
        const top = first.top + first.height / 2 - bounds.top - parseFloat(style.borderTopWidth);
        const bottom = bounds.bottom - parseFloat(style.borderBottomWidth) - last.top - last.height / 2;
        container.style.setProperty("--bg-span-top", `${top}px`);
        container.style.setProperty("--bg-span-bottom", `${bottom}px`);
      }
    };

    const observer = new ResizeObserver(update);
    for (const { container, children } of spans) {
      observer.observe(container, { box: "border-box" });
      for (const child of children) observer.observe(child, { box: "border-box" });
    }
    window.addEventListener("resize", update);
    update();
    setStatus("Using the local bg-span fallback.");
  } catch (error) {
    setStatus("The bg-span fallback could not start. See the browser console.");
    console.error("Failed to start the bg-span fallback:", error);
  }
})();
