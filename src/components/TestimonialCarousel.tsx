import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeButton, setActiveButton] = useState<'prev' | 'next' | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number>();
  
  // Check if device is mobile based on window width
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update mobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle scroll effect for background color
  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    
    const { top, height } = carouselRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate scroll position (0 when top of carousel is at bottom of viewport)
    // and 1 when bottom of carousel is at top of viewport
    const scrollProgress = Math.min(1, Math.max(0, (windowHeight - top) / (height * 0.5)));
    setScrollPosition(scrollProgress);
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "The Anambra Geospatial Health Platform has transformed how we analyze health data. The ability to visualize multiple data sources in one place is invaluable.",
      author: "Dr. Chuma",
      role: "Head of Epidemiology",
      rating: 5
    },
    {
      id: 2,
      quote: "The Anambra Geospatial Health Platform has made it much easier to manage and access health data across the state.",
      author: "Miss Judith",
      role: "Anambra Health Data Manager",
      rating: 5
    },
    {
      id: 3,
      quote: "As a data analyst, I find the platform's integration of various health indicators extremely useful. It has significantly reduced our data processing time.",
      author: "Emeka Okafor",
      role: "Data Analyst",
      rating: 5
    },
    {
      id: 4,
      quote: "The training provided has empowered our team to better understand and utilize health data for community interventions. The impact has been remarkable.",
      author: "Amina Mohammed",
      role: "Public Health Officer",
      rating: 4
    },
    {
      id: 5,
      quote: "The real-time data visualization capabilities have been a game-changer for our health monitoring initiatives and resource allocation.",
      author: "Dr. Aisha Bello",
      role: "Epidemiologist",
      rating: 5
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const goToPrev = () => {
    setActiveIndex(prevIndex => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setActiveButton('prev');
    resetButtonState();
  };

  const goToNext = () => {
    setActiveIndex(prevIndex => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setActiveButton('next');
    resetButtonState();
  };

  const resetButtonState = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveButton(null);
    }, 300); // Reset after 300ms
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  // Handle touch events for swipe
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left
      goToNext();
    }

    if (touchStartX - touchEndX < -50) {
      // Swipe right
      goToPrev();
    }
  };

  // Calculate visible testimonials (3 on desktop, 1 on mobile)
  const visibleTestimonials = [];
  const numVisible = isMobile ? 1 : 3;
  
  for (let i = 0; i < numVisible; i++) {
    const index = (activeIndex + i) % testimonials.length;
    let position: 'left' | 'center' | 'right' = 'center';
    
    if (!isMobile) {
      position = i === 1 ? 'center' : i === 0 ? 'left' : 'right';
    }
    
    visibleTestimonials.push({
      ...testimonials[index],
      position
    });
  }

  return (
    <div 
      ref={carouselRef}
      className="relative w-full max-w-7xl mx-auto py-2 px-4 overflow-hidden transition-colors duration-500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        backgroundColor: 'transparent',
        transition: 'background-color 0.5s ease',
      }}
    >
      <div 
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button - Always show on all screen sizes */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <button 
            onClick={goToPrev}
            className={`bg-white rounded-full p-2 shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              activeButton === 'prev' 
                ? 'bg-[#ffaa00] hover:bg-[#ffaa00]' 
                : 'hover:bg-gray-100'
            }`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        
        {/* Next Button - Always show on all screen sizes */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <button 
            onClick={goToNext}
            className={`bg-white rounded-full p-2 shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              activeButton === 'next' 
                ? 'bg-[#ffaa00] hover:bg-[#ffaa00]' 
                : 'hover:bg-gray-100'
            }`}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        
        {/* Mobile Indicators */}
        {isMobile && (
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-[#ffaa00]' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Testimonials Container */}
        <div 
          ref={containerRef}
          className={`flex items-center ${isMobile ? 'justify-center' : 'justify-between'} h-[400px] px-4 w-full`}
        >
          {visibleTestimonials.map((testimonial, index) => {
            // For mobile, we only show one testimonial at a time
            const isActive = isMobile || testimonial.position === 'center';
            
            return (
              <div 
                key={`${testimonial.id}-${index}`}
                className={`transition-all duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] transform ${
                  isMobile 
                    ? 'w-full max-w-md mx-auto' 
                    : 'w-[32%] mx-2'
                } ${
                  isActive 
                    ? 'z-10 scale-100 opacity-100 translate-y-0' 
                    : 'z-0 scale-90 opacity-70 translate-y-4'
                }`}
              >
                <div className={`rounded-2xl shadow-lg p-6 h-full flex flex-col ${
                  isActive 
                    ? 'bg-[#ffaa00] text-white' 
                    : 'bg-white text-gray-700'
                }`}>
                  <div className="text-amber-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-current text-base leading-relaxed mb-6 text-justify">"{testimonial.quote}"</p>
                  <div className={`mt-auto pt-4 border-t ${
                    isActive ? 'border-white/30' : 'border-gray-100'
                  }`}>
                    <h4 className={`font-bold text-lg ${
                      isActive ? 'text-white' : 'text-gray-900'
                    }`}>{testimonial.author}</h4>
                    <p className={`text-base font-medium mb-3 ${
                      isActive ? 'text-white/90' : 'text-amber-500'
                    }`}>{testimonial.role}</p>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={goToNext}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            activeButton === 'next' 
              ? 'bg-[#ffaa00] hover:bg-[#ffaa00]' 
              : 'bg-white hover:bg-gray-100'
          }`}
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-10 space-x-3">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-4 h-4 rounded-full transition-colors ${
              index === activeIndex ? 'bg-amber-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        .testimonial-carousel .mx-2 {
          margin-left: 0.5rem;
          margin-right: 0.5rem;
        }
        
        @media (max-width: 1024px) {
          .testimonial-carousel .mx-2 {
            margin-left: 0.25rem;
            margin-right: 0.25rem;
          }
        }
        
        @media (max-width: 768px) {
          .testimonial-carousel .px-16 {
            padding-left: 2rem;
            padding-right: 2rem;
          }
          
          .testimonial-carousel .flex-1 {
            flex: 0 0 100%;
            max-width: 100%;
            margin-bottom: 1rem;
          }
          
          .testimonial-carousel .flex-1:not(:first-child) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TestimonialCarousel;
