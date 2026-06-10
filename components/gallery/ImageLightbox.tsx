'use client';

import { useState, useEffect, useCallback } from 'react';

interface ImageLightboxProps {
  src: string;
  alt: string;
}

export function ImageLightbox({ src, alt }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <>
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in group relative rounded-sm overflow-hidden border border-[rgba(201,169,110,0.12)] transition-all duration-200 hover:border-[rgba(201,169,110,0.4)]"
      >
        <img
          src={src}
          alt={alt}
          className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[rgba(10,10,10,0)] group-hover:bg-[rgba(10,10,10,0.15)] transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] tracking-[2px] uppercase text-ivory font-body bg-[rgba(10,10,10,0.6)] backdrop-blur-sm px-4 py-2 rounded-sm">
            Zvětšit
          </span>
        </div>
      </button>

      {/* Lightbox overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.92)] backdrop-blur-sm"
          onClick={close}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] transition-colors cursor-pointer z-10"
            aria-label="Zavřít"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F2EC" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Full image */}
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
