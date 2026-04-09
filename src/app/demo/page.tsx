"use client";

import { useState, useEffect } from "react";
import CameraFeed from "@/components/CameraFeed";
import { ModeToggle } from "@/components/modetoggle";
import { TelegramChatIdModal } from "@/components/telegram-chat-id-modal";
import { BellRing } from "lucide-react";
import { toast } from "sonner";

export default function LivePage() {
  const [isTelegramConfigured, setIsTelegramConfigured] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  // Check if Telegram chat ID exists in session storage on mount
  useEffect(() => {
    const checkTelegramConfig = () => {
      const chatId = sessionStorage.getItem("telegram_chat_id");
      if (chatId) {
        setIsTelegramConfigured(true);
      } else {
        // Show modal on first page load if not configured
        setShowTelegramModal(true);
      }
    };

    // Check after a short delay to allow hydration
    const timer = setTimeout(checkTelegramConfig, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle check for chat ID when user clicks to open camera feed
  const handleChatIdCheck = () => {
    const chatId = sessionStorage.getItem("telegram_chat_id");
    if (!chatId) {
      toast.error("Please link your Telegram Chat ID first", {
        description: "This is required to receive alerts",
        icon: <BellRing className="h-4 w-4" />,
        action: {
          label: "Setup",
          onClick: () => setShowTelegramModal(true),
        },
      });
      setShowTelegramModal(true);
      return false;
    }
    return true;
  };

  return (
    <main className="p-6">
      <nav className="w-[90%] xs:w-[85%] sm:w-[80%] md:w-[75%] lg:w-[95%] p-2 xs:p-2.5 sm:p-3 md:p-4 flex justify-between items-center rounded-lg transition-all duration-300 mx-auto">
        <div className="flex items-baseline space-x-1.5 sm:space-x-2">
          <h1 className="font-sans font-extrabold text-lg sm:text-xl md:text-2xl lg:text-5xl tracking-tight text-primary glow-text">
            THE WATCHER
          </h1>
          <span className="jetbrains-mono h-fit text-xxs md:text-xs font-light tracking-tight text-muted-light duration-200 group-hover:text-white hidden sm:inline-flex">
            <span>/ </span>
            <span className="text-xxs">@</span>
            <span>demo</span>
          </span>
        </div>
        <div className="flex gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 items-center">
          {/* <TelegramChatIdModal
            isOpen={showTelegramModal}
            setIsOpen={setShowTelegramModal}
            onSave={() => setIsTelegramConfigured(true)}
          /> */}
          <ModeToggle />
        </div>
      </nav>

      <div className="mt-5">
        {/* Sleek minimal notification for Telegram connection */}
        {!isTelegramConfigured && (
          <div className="mb-6 flex w-full justify-center">
            <div
              onClick={() => setShowTelegramModal(true)}
              className="bg-muted/50 backdrop-blur-sm px-4 py-2.5 rounded-full border border-border/50 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer w-full group"
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-2  bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-foreground/80">
                  Telegram connection required
                </span>
              </div>
              <TelegramChatIdModal
                isOpen={showTelegramModal}
                setIsOpen={setShowTelegramModal}
                onSave={() => setIsTelegramConfigured(true)}
              />
            </div>
          </div>
        )}
        <CameraFeed onBeforeCameraStart={handleChatIdCheck} />
      </div>

      {/* <div className="mt-8 bg-card/50 border border-border rounded-lg p-6 max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <BellRing className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-medium">
            Telegram Notification System
          </h2>
        </div>
        <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
          <p className="mb-2">
            The Watcher uses your Telegram Chat ID to send instant alerts when:
          </p>
          <ul className="list-disc ml-5 space-y-0.5 text-xs">
            <li>Violence is detected in the video feed</li>
            <li>Reports are generated based on suspicious activity</li>
            <li>System requires your attention</li>
          </ul>
        </div>
      </div> */}
    </main>
  );
}
