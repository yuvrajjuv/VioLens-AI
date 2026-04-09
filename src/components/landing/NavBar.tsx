import React, { useState } from "react";
import Link from "next/link";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Research", href: "#research" },
  { label: "Safety", href: "#safety" },
];

export default function NavBar() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const offset = typeof window !== 'undefined' ? window.innerHeight / 3 : 200;
  const { activeSection } = useScrollSpy({
    navItems,
    offset: offset,
  });

  // Glass effect styles based on modern glassmorphism principles
  const glassStyles = {
    backgroundColor: "rgba(35, 35, 35, 0.1)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(235, 235, 235, 0.1)",
    boxShadow: "0 0 18px 3px rgba(0, 0, 0, .3)",
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed w-full z-50 top-4"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mx-4 h-16 rounded-2xl overflow-hidden"
          style={glassStyles}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between h-full px-6">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  filter: { duration: 2, repeat: Infinity },
                }}
              >
                <Eye className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary">
                WATCHER
              </span>
            </motion.div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <motion.div
                    key={item.href}
                    className="relative"
                    // onHoverStart={() => setHoveredLink(() => item.href)}
                    onHoverEnd={() => setHoveredLink(null)}
                  >
                    <Link href={item.href}>
                      <motion.span
                        className={`text-sm font-medium ${
                          isActive ? "text-primary" : "text-white/70"
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                    <AnimatePresence>
                      {(isActive || hoveredLink === item.href) && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ originX: isActive ? 0.5 : 0 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.button
              className="hidden md:flex items-center px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(var(--primary), 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/demo" className="text-sm font-medium text-white">
                Try Watcher
              </Link>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
