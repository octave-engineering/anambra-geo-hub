"use client";

import { useRef } from "react";
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import images from the assets directory
import image1 from "@/assets/IMG_20250828_130600_349.jpg";
import image2 from "@/assets/health-workers.png";

const slides = [
  {
    id: 1,
    title: "Building Geospatial Capacity in Anambra",
    subtitle: "Access free training in GIS and geospatial technologies for Anambra State",
    buttonText: "Explore Programs",
    link: "#programs",
    image: image1
  },
  {
    id: 2,
    title: "Master GIS for Public Health",
    subtitle: "Learn to analyze and visualize health data for better healthcare delivery",
    buttonText: "View Courses",
    link: "#courses",
    image: image2
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
                <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.link}
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium px-8 py-3 rounded-full transition-colors duration-300"
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
