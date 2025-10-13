import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-ring px-4 py-3 transition"
    >
      <ArrowUp className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-medium">Top</span>
    </button>
  );
};

export default BackToTop;
