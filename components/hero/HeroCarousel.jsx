import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "@/data/data";

const slideDuration = 6000;

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = useMemo(() => heroSlides, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goTo = (index) => setActiveIndex(index);
  const next = () => goTo((activeIndex + 1) % slides.length);
  const prev = () => goTo((activeIndex - 1 + slides.length) % slides.length);

  return (
    <section className="relative bg-gray-100">
      <div className="relative h-[520px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[activeIndex].id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
                                                                                                               
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
            <div className="relative h-full flex flex-col justify-center text-white px-6 sm:px-10 lg:px-20">
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-sm uppercase tracking-[0.3em] text-amber-300"
              >
                Guided Service · Community First
              </motion.p>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold"
              >
                {slides[activeIndex].title}
              </motion.h1>
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-2 text-lg sm:text-xl text-white/80"
              >
                {slides[activeIndex].subtitle}
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-4 max-w-2xl text-base sm:text-lg text-white/80"
              >
                {slides[activeIndex].description}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-8"
              >
                <a
                  href={slides[activeIndex].ctaLink}
                  className="inline-flex items-center gap-3 rounded-full bg-amber-400 px-6 py-3 text-base font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-300"
                >
                  {slides[activeIndex].ctaLabel}
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur hover:bg-white/40"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur hover:bg-white/40"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2 w-8 rounded-full transition ${
                index === activeIndex ? "bg-amber-400" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
