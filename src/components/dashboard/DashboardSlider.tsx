"use client";

import { useEffect, useRef } from "react";

export type DashboardSlide = {
  id: string;
  label: string;
  children: React.ReactNode;
};

type DashboardSliderProps = {
  slides: DashboardSlide[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

export function DashboardSlider({ slides, activeIndex, onActiveIndexChange }: DashboardSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || slides.length < 2) return;

    let paused = false;
    const advance = () => {
      if (paused) return;
      onActiveIndexChange((activeIndex + 1) % slides.length);
    };
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    const timer = window.setInterval(advance, 10000);

    slider.addEventListener("mouseenter", pause);
    slider.addEventListener("mouseleave", resume);
    slider.addEventListener("focusin", pause);
    slider.addEventListener("focusout", resume);

    return () => {
      window.clearInterval(timer);
      slider.removeEventListener("mouseenter", pause);
      slider.removeEventListener("mouseleave", resume);
      slider.removeEventListener("focusin", pause);
      slider.removeEventListener("focusout", resume);
    };
  }, [activeIndex, onActiveIndexChange, slides.length]);

  return (
    <div className="dashboard-slider" ref={sliderRef}>
      <div className="dashboard-slider-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {slides.map((slide) => <section className="dashboard-slide" id={slide.id} key={slide.id}>{slide.children}</section>)}
      </div>
      <div className="dashboard-slider-dots" aria-label="Pilih slide dashboard">
        {slides.map((slide, index) => (
          <button
            aria-label={`Buka ${slide.label}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className={index === activeIndex ? "active" : ""}
            key={slide.id}
            onClick={() => onActiveIndexChange(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}