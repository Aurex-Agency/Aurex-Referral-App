'use client';

import { useEffect, useRef } from 'react';
import { Smartphone } from 'lucide-react';

// Safari does not enforce manifest orientation. Use physical screen orientation,
// rather than viewport height, so opening the keyboard does not trigger this guard.
export function PortraitGuard() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const update = () => {
      const phone = /iPhone|iPod/.test(navigator.userAgent) ||
        (matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 500);
      const angle = (window as Window & { orientation?: number }).orientation;
      const landscape = screen.orientation?.type?.startsWith('landscape') ?? (Math.abs(angle || 0) === 90);
      if (phone && landscape && !ref.current?.open) ref.current?.showModal();
      if ((!phone || !landscape) && ref.current?.open) ref.current?.close();
    };
    update();
    window.addEventListener('orientationchange', update);
    screen.orientation?.addEventListener('change', update);
    return () => { window.removeEventListener('orientationchange', update); screen.orientation?.removeEventListener('change', update); };
  }, []);
  return <dialog ref={ref} className="portrait-guard" aria-labelledby="portrait-title" onCancel={e => e.preventDefault()}>
    <Smartphone size={38} aria-hidden="true" /><h2 id="portrait-title">Please turn your phone upright</h2>
    <p>Magnolia works in portrait. Your place is saved.</p>
  </dialog>;
}
