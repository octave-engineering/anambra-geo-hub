"use client";

import { useRef } from "react";
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import images from the assets directory
import healthMapImage from "@/assets/health-map.jpg";
import trainingImage from "@/assets/health-training.jpg";

const slides = [
  {
    id: 1,
    title: "Anambra Health Intelligence Hub",
    subtitle: "Transforming healthcare through geospatial data and analytics for better decision making across Anambra State",
    image: healthMapImage
  },
  {
    id: 2,
    title: "Geospatial Health Training Initiative",
    subtitle: "Empowering healthcare professionals with spatial analysis skills for improved health outcomes in Anambra",
    image: trainingImage
  },
  {
    id: 3,
    title: "Disease Surveillance & Response",
    subtitle: "Leveraging geospatial technology for real-time disease tracking and rapid response in Anambra communities",
    image: healthMapImage
  }
];

// Helper function to handle image imports
function getImageUrl(image: any): string {
  if (typeof image === 'string') return image;
  if (image && typeof image === 'object' && 'default' in image) return image.default;
  return '';
}

export default function HeroSlider() {
  const swiperRef = useRef<SwiperType>();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="relative w-full h-[66.666vh] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={() => {
          // Update navigation refs after initialization
          if (swiperRef.current) {
            swiperRef.current.params.navigation = {
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            };
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
          }
        }}
        pagination={{ clickable: true }}
        autoplay={{ 
          delay: 6000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop
        className="w-full h-full relative group"
      >
        {/* Navigation Arrows */}
        <button 
          ref={prevRef}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110 focus:outline-none"
          style={{ color: '#ffaa00' }}
          aria-label="Previous slide"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <span className="text-3xl font-bold">&lt;</span>
        </button>
        <button 
          ref={nextRef}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110 focus:outline-none"
          style={{ color: '#ffaa00' }}
          aria-label="Next slide"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <span className="text-3xl font-bold">&gt;</span>
        </button>
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="absolute inset-0 w-full h-full">
              <img
                src={getImageUrl(slide.image)}
                alt={slide.title}
                className="w-full h-full object-cover brightness-75"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
            <div className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10">
              <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-4 max-w-3xl mx-auto leading-relaxed font-normal">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
