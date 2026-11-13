import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./motion.css";

const cardSelector = ".work-tile,.case-card,.services-grid article";
const revealSelector =
  ".evidence-strip>div,.work-tile,.case-card,.home-about,.closing-cta,.field-grid article,.services-grid article,.tech-details article,.dash-panel";

/** Decorative effects stay outside React's render loop and never intercept input. */
export function MotionLayer() {
  const { pathname } = useLocation();
  const progress = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem("jh-motion-v1") === "paused";
    } catch {
      return false;
    }
  });
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const active = !paused && !reduced;
  const privatePage =
    pathname.startsWith("/dashboard") || pathname.startsWith("/acceso");

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(preference.matches);
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = active ? "active" : "paused";
    try {
      localStorage.setItem("jh-motion-v1", paused ? "paused" : "active");
    } catch {
      /* Optional preference storage. */
    }
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [active, paused]);

  useEffect(() => {
    let scrollFrame = 0;
    const update = () => {
      const distance = document.documentElement.scrollHeight - innerHeight;
      const value =
        distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
      if (progress.current)
        progress.current.style.transform = `scaleX(${value})`;
      document.documentElement.classList.toggle("page-scrolled", scrollY > 24);
      scrollFrame = 0;
    };
    const schedule = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const size = new ResizeObserver(schedule);
    size.observe(document.body);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      size.disconnect();
      cancelAnimationFrame(scrollFrame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!active || privatePage) return;
    const root = document.getElementById("main");
    if (!root) return;
    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    const register = () => {
      root
        .querySelectorAll<HTMLElement>(revealSelector)
        .forEach((node, index) => {
          if (observed.has(node)) return;
          observed.add(node);
          node.classList.add("motion-reveal");
          node.style.setProperty("--reveal-delay", `${(index % 3) * 85}ms`);
          observer.observe(node);
        });
    };
    register();
    // Search and category changes mount new cards after the route effect.
    const mutations = new MutationObserver(register);
    mutations.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.querySelectorAll<HTMLElement>(".motion-reveal").forEach((node) => {
        node.classList.remove("motion-reveal", "motion-visible");
        node.style.removeProperty("--reveal-delay");
      });
    };
  }, [pathname, active, privatePage]);

  useEffect(() => {
    if (
      !active ||
      privatePage ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    let frame = 0;
    let card: HTMLElement | null = null;
    let x = 0,
      y = 0;
    const reset = () => {
      if (card) {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
        card.classList.remove("pointer-lit");
      }
      card = null;
    };
    const move = (event: PointerEvent) => {
      const next =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(cardSelector)
          : null;
      if (next !== card) {
        reset();
        card = next;
      }
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      x = Math.max(
        0,
        Math.min(1, (event.clientX - bounds.left) / bounds.width),
      );
      y = Math.max(
        0,
        Math.min(1, (event.clientY - bounds.top) / bounds.height),
      );
      if (!frame)
        frame = requestAnimationFrame(() => {
          if (card) {
            card.style.setProperty("--tilt-x", `${(0.5 - y) * 4}deg`);
            card.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
            card.style.setProperty("--light-x", `${x * 100}%`);
            card.style.setProperty("--light-y", `${y * 100}%`);
            card.classList.add("pointer-lit");
          }
          frame = 0;
        });
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", reset);
    addEventListener("blur", reset);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", reset);
      removeEventListener("blur", reset);
      cancelAnimationFrame(frame);
      reset();
    };
  }, [pathname, active, privatePage]);

  return (
    <>
      <div className="reading-progress" ref={progress} aria-hidden="true" />
      {!privatePage && (
        <div className="ambient-scene" aria-hidden="true">
          <div className="ambient-light light-blue" />
          <div className="ambient-light light-violet" />
          <div className="ambient-grid" />
          <div className="ambient-stars">
            {Array.from({ length: 12 }, (_, i) => (
              <i
                key={i}
                style={{
                  left: `${(i * 31 + 7) % 100}%`,
                  top: `${(i * 19 + 11) % 100}%`,
                  animationDelay: `${-i * 1.7}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      {!reduced && !privatePage && (
        <button
          type="button"
          className="motion-toggle"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          <span
            className={paused ? "play-icon" : "pause-icon"}
            aria-hidden="true"
          />
          {paused ? "Reanudar efectos" : "Pausar efectos"}
        </button>
      )}
    </>
  );
}
