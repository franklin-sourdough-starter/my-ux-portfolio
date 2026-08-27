document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(document.querySelectorAll(".case-toc a"));
  if (!links.length) return;

  const mobileLinks = Array.from(document.querySelectorAll(".mobile-toc-sheet a"));
  const mobileBar = document.getElementById("mobileTocBar");
  const mobileCurrent = document.getElementById("mobileTocCurrent");
  const mobileProgress = document.getElementById("mobileTocProgress");

  const sections = links
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    const idx = links.findIndex((a) => a.getAttribute("href") === "#" + id);
    if (idx === -1) return;
    mobileLinks.forEach((a, i) => a.classList.toggle("active", i === idx));
    if (mobileCurrent) mobileCurrent.textContent = links[idx].textContent.trim();
    if (mobileProgress) mobileProgress.textContent = (idx + 1) + "/" + links.length;
  };

  // The reference line comes from the sections' own `scroll-margin-top` —
  // the exact value the browser already uses to land scrollIntoView jumps.
  // Reading it directly (rather than re-deriving an offset from sticky
  // header heights) guarantees the two never drift apart: a section that
  // was just scrolled to always lands with its top exactly on this line,
  // so it's immediately recognized as current instead of lagging a section
  // behind until the next manual scroll.
  const updateActive = () => {
    const marginTop = parseFloat(getComputedStyle(sections[0]).scrollMarginTop) || 0;
    const line = marginTop + 1;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) current = section;
      else break;
    }
    setActive(current.id);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateActive();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateActive();

  // Mobile sticky bar: tap to expand/collapse the full section list.
  if (mobileBar) {
    mobileBar.addEventListener("click", () => {
      mobileBar.classList.toggle("expanded");
    });
  }

  // Tapping a section in the expanded sheet jumps to it and collapses the sheet.
  mobileLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(a.getAttribute("href").slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (mobileBar) mobileBar.classList.remove("expanded");
    });
  });
});
