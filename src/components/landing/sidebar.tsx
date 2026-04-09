"use client";
import Link from "next/link";
import { Home, Github, Play } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../modetoggle";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className="hidden md:fixed md:left-0 md:top-1/2 md:-translate-y-1/2 md:w-16 md:bg-transparent md:flex md:flex-col md:items-center md:py-8 md:rounded-r-xl md:shadow-xl">
        <div className="flex flex-col items-center space-y-6">
          <SidebarLink
            href="/"
            icon={<Home className="w-5 h-5" />}
            isActive={pathname === "/"}
            label="Home"
          />
          <SidebarLink
            href="/demo"
            icon={<Play className="w-5 h-5" />}
            label="Demo"
          />
          <SidebarLink
            href="https://github.com/atharva00721"
            icon={<Github className="w-5 h-5" />}
            label="GitHub"
          />
          <ModeToggle />
        </div>
      </div>

      {/* Floating dock for mobile view */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-gradient-to-r from-zinc-300/70 to-zinc-300/70 dark:from-zinc-800/70 dark:to-zinc-800/30 backdrop-blur-lg border border-zinc-300/50 dark:border-zinc-700/50 flex justify-around items-center py-4 rounded-2xl shadow-2xl z-[9999] md:hidden">
        <SidebarLink
          href="/"
          icon={<Home className="w-6 h-6" />}
          isActive={pathname === "/"}
          label="Home"
        />
        <SidebarLink
          href="/demo"
          icon={<Play className="w-6 h-6" />}
          label="Demo"
        />
        <SidebarLink
          href="https://github.com/atharva00721"
          icon={<Github className="w-6 h-6" />}
          label="GitHub"
        />
        <ModeToggle />
      </div>
    </>
  );
}

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
};

function SidebarLink({
  href,
  icon,
  label,
  isActive = false,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`p-3 rounded-lg transition-all duration-200 group ${
        isActive
          ? "text-black dark:text-white"
          : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
      }`}
    >
      <div className="transition-transform duration-200 group-hover:scale-125">
        {icon}
      </div>
      <span className="sr-only">{label}</span>
    </Link>
  );
}
