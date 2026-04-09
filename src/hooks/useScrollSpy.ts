import { useState, useEffect } from 'react';

interface ScrollSpyOptions {
  navItems: Array<{ href: string }>;
  offset?: number;
}

export function useScrollSpy({ navItems, offset = 100 }: ScrollSpyOptions) {
  const [activeSection, setActiveSection] = useState<string>(navItems[0]?.href || '');
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Update scroll direction
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY) {
        setScrollDirection("down");
      } else if (currentScrollY < prevScrollY) {
        setScrollDirection("up");
      }
      setPrevScrollY(currentScrollY);

      // Find the current section in view
      const viewportMiddle = window.scrollY + offset;
      
      // Sections that are currently visible
      const visibleSections = navItems
        .map(({ href }) => {
          const sectionId = href.replace('#', '');
          const element = document.getElementById(sectionId);
          if (!element) return null;
          
          const rect = element.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = rect.bottom + window.scrollY;
          
          return {
            id: href,
            top,
            bottom,
            element
          };
        })
        .filter(Boolean);
      
      // Find the section closest to the top that's currently in view
      for (const section of visibleSections) {
        if (section && section.top <= viewportMiddle && section.bottom >= window.scrollY) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    // Initialize
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navItems, offset, prevScrollY]);

  return { activeSection, scrollDirection };
}
