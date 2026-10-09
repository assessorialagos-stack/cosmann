'use client';

import { useEffect } from 'react';

// Seções surgem suavemente ao rolar. Só esconde o que ainda está abaixo da tela
// (nada pisca no topo); sem JS ou com "reduzir movimento", tudo aparece direto.
export default function Revelar() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const el = entrada.target as HTMLElement;
          el.classList.add('revelando');
          el.classList.remove('aguardando');
          observador.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    document.querySelectorAll<HTMLElement>('[data-revelar]').forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
        el.classList.add('aguardando');
        observador.observe(el);
      }
    });
    return () => observador.disconnect();
  }, []);

  return null;
}
