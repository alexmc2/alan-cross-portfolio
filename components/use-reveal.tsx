"use client";

import { useEffect, useRef } from "react";

export function useReveal() {
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const id = setTimeout(() => {
              entry.target.classList.add("visible");
            }, i * 80);
            timeouts.current.push(id);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => {
      timeouts.current.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);
}
