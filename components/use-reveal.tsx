"use client";

import { useEffect, useRef } from "react";

export function useReveal() {
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const pendingTimeouts = timeouts.current;
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const id = setTimeout(() => {
              entry.target.classList.add("visible");
              // Remove fired timeout from the array
              const idx = pendingTimeouts.indexOf(id);
              if (idx !== -1) pendingTimeouts.splice(idx, 1);
            }, i * 80);
            pendingTimeouts.push(id);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => {
      pendingTimeouts.forEach(clearTimeout);
      pendingTimeouts.length = 0;
      observer.disconnect();
    };
  }, []);
}
