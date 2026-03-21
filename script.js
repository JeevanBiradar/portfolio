const sectionIds = ["home", "about", "blueprint", "work", "research", "contact"];
const navLinks = [...document.querySelectorAll('a[href^="#"]')];
const mobileMenu = document.getElementById("mobile-menu");
const mobileToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenuLinks = [...document.querySelectorAll(".mobile-menu-link")];
const revealTargets = [
    ...document.querySelectorAll("section"),
    ...document.querySelectorAll(".glass-panel"),
];

const setMobileMenuState = (isOpen) => {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.hidden = !isOpen;
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("mobile-menu-open", isOpen);
    const icon = mobileToggle.querySelector(".mobile-menu-icon");
    if (icon) {
        icon.textContent = isOpen ? "close" : "menu";
    }
};

if (mobileToggle && mobileMenu) {
    setMobileMenuState(false);
    mobileToggle.addEventListener("click", () => {
        const isOpen = mobileToggle.getAttribute("aria-expanded") === "true";
        setMobileMenuState(!isOpen);
    });

    mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", () => setMobileMenuState(false));
    });
}

revealTargets.forEach((el) => {
    if (!el.classList.contains("stagger-reveal")) {
        el.classList.add("reveal-on-scroll");
    }
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((el) => revealObserver.observe(el));

const activeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${id}`;
                link.classList.toggle("nav-link-active", isActive);
            });
        });
    },
    { threshold: 0.5 }
);

sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .forEach((section) => activeObserver.observe(section));

window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
        setMobileMenuState(false);
    }
});

document.querySelectorAll(".glass-panel").forEach((card) => {
    card.classList.add("interactive-card");
    card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 4;
        const rotateX = (0.5 - (y / rect.height)) * 4;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });
});
