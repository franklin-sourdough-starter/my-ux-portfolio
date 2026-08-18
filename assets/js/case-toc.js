document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".case-toc a");
  if (!links.length) return;

  const sections = Array.from(links)
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
});
