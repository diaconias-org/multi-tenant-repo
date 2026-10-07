'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionContainer, SectionHeading } from '@/components/site/Section';

const GALERIA = [
  '/galeria/IMG_4934.JPG.jpeg',
  '/galeria/IMG_4935.JPG.jpeg',
  '/galeria/IMG_4936.JPG.jpeg',
  '/galeria/IMG_4937.JPG.jpeg',
  '/galeria/IMG_4938.JPG.jpeg',
  '/galeria/IMG_4939.JPG.jpeg',
  '/galeria/IMG_4940.JPG.jpeg',
  '/galeria/IMG_4941.JPG.jpeg',
  '/galeria/IMG_4942.JPG.jpeg',
];

const PREPEND_COUNT = 3;
const EXTENDED_LIST = [
  ...GALERIA.slice(-PREPEND_COUNT),
  ...GALERIA,
  ...GALERIA.slice(0, PREPEND_COUNT),
];
const TOTAL_REAL = GALERIA.length;

export default function MemoriasSection() {
  const [currentIndex, setCurrentIndex] = useState(PREPEND_COUNT);
  const [withTransition, setWithTransition] = useState(true);
  const isPausedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 900);
  }, []);

  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 900);
  }, []);

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    isAnimatingRef.current = false;

    // Se chegou ao conjunto clonado do final, reposiciona para o início real
    if (currentIndex >= PREPEND_COUNT + TOTAL_REAL) {
      setWithTransition(false);
      setCurrentIndex(PREPEND_COUNT);
    }
    // Se chegou ao conjunto clonado do início, reposiciona para o fim real
    else if (currentIndex < PREPEND_COUNT) {
      setWithTransition(false);
      setCurrentIndex(PREPEND_COUNT + TOTAL_REAL - 1);
    }
  };

  useEffect(() => {
    if (!withTransition) {
      const timer = setTimeout(() => {
        setWithTransition(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [withTransition]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        handleNext();
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [handleNext]);

  const handleTouchStart = (e) => {
    isPausedRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    isPausedRef.current = false;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const arrowClass =
    'absolute top-[calc(50%-4px)] z-10 flex h-20 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-white opacity-85 drop-shadow-[0_2px_8px_rgb(0_0_0/0.8)] transition-all duration-200 hover:scale-120 hover:text-accent-light hover:opacity-100 active:scale-105 max-[560px]:h-[60px] max-[560px]:w-9';

  return (
    <section className="border-b border-border bg-secondary py-20" id="memorias">
      <SectionContainer>
        <SectionHeading
          className="mb-7 max-w-[800px]"
          eyebrow="Nossas Ações"
          title="Memórias da Diaconia"
          desc="Um pouco da nossa caminhada, das nossas celebrações e do nosso povo em momentos especiais da nossa paróquia."
          descClassName="mb-0"
        />

        <div
          className="relative w-full select-none overflow-hidden pb-4 pt-2 [--gap:16px] [--visible-cards:3] max-[840px]:[--visible-cards:2] max-[560px]:[--visible-cards:1]"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className={`${arrowClass} left-2 max-[560px]:left-1`}
            onClick={handlePrev}
            aria-label="Foto anterior"
          >
            <ChevronLeft size={42} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            className={`${arrowClass} right-2 max-[560px]:right-1`}
            onClick={handleNext}
            aria-label="Próxima foto"
          >
            <ChevronRight size={42} strokeWidth={2.5} />
          </button>

          <div
            className="flex gap-[var(--gap)] will-change-transform"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translate3d(calc(-1 * (${currentIndex} * (100% + var(--gap)) / var(--visible-cards))), 0, 0)`,
              transition: withTransition ? 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
          >
            {EXTENDED_LIST.map((src, idx) => (
              <div
                key={idx}
                className="h-[400px] flex-[0_0_calc((100%-(var(--visible-cards)-1)*var(--gap))/var(--visible-cards))] select-none overflow-hidden rounded-[20px] border-4 border-card shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-card max-[840px]:h-[360px] max-[560px]:h-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Memória da Diaconia ${idx + 1}`} loading="lazy" draggable={false} className="block size-full select-none object-cover" />
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
