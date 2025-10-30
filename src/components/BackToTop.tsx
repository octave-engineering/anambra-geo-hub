import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Check if scrolled to bottom (within 100px of the bottom)
      const scrollPosition = window.scrollY + window.innerHeight;
      const bottomThreshold = document.documentElement.scrollHeight - 100;
      
      // Show button only when near bottom of page
      if (scrollPosition >= bottomThreshold) {
        setIsAtBottom(true);
        // Only show if scrolled down more than 300px
        setIsVisible(window.scrollY > 300);
      } else {
        setIsAtBottom(false);
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed right-6 z-40 p-3 rounded-full bg-[#ffaa00] text-white shadow-lg hover:bg-[#e69500] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffaa00] focus:ring-opacity-50 ${
        isAtBottom ? 'bottom-24' : 'bottom-6'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
