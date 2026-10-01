'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/app/home.module.css';

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

  return (
    <section className={styles.memorias} id="memorias">
      <div className={styles.sectionInner}>
        <div className={styles.memoriasHeader}>
          <div className={styles.memoriasText}>
            <span className={styles.sectionEyebrow}>Nossas Ações</span>
            <h2 className={styles.sectionTitle}>Memórias da Diaconia</h2>
            <p className={styles.sectionDesc}>
              Um pouco da nossa caminhada, das nossas celebrações e do nosso povo 
              em momentos especiais da nossa paróquia.
            </p>
          </div>
        </div>

        <div 
          className={styles.memoriasSliderWrap}
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button 
            type="button"
            className={`${styles.btnCarrossel} ${styles.btnPrev}`} 
            onClick={handlePrev} 
            aria-label="Foto anterior"
          >
            <ChevronLeft size={42} strokeWidth={2.5} />
          </button>
          
          <button 
            type="button"
            className={`${styles.btnCarrossel} ${styles.btnNext}`} 
            onClick={handleNext} 
            aria-label="Próxima foto"
          >
            <ChevronRight size={42} strokeWidth={2.5} />
          </button>

          <div 
            className={styles.memoriasTrack} 
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translate3d(calc(-1 * (${currentIndex} * (100% + var(--gap)) / var(--visible-cards))), 0, 0)`,
              transition: withTransition ? 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
          >
            {EXTENDED_LIST.map((src, idx) => (
              <div key={idx} className={styles.memoriaCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Memória da Diaconia ${idx + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
