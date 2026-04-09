"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Check, Bell, AlertCircle, Copy, CheckCircle, Bot } from "lucide-react";

interface TelegramChatIdModalProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onSave?: () => void;
}

export function TelegramChatIdModal({
  isOpen,
  setIsOpen,
  onSave,
}: TelegramChatIdModalProps = {}) {
  // For uncontrolled usage (backwards compatibility)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [chatId, setChatId] = useState("");
  const [isLinked, setIsLinked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  // Determine if this is a controlled or uncontrolled component
  const isControlled = isOpen !== undefined && setIsOpen !== undefined;
  const open = isControlled ? isOpen : uncontrolledOpen;
  const setOpen = isControlled ? setIsOpen : setUncontrolledOpen;

  useEffect(() => {
    const storedChatId = sessionStorage.getItem("telegram_chat_id");
    if (storedChatId) {
      setChatId(storedChatId);
      setIsLinked(true);
    }
  }, []);

  const handleSave = () => {
    if (!chatId) return;

    sessionStorage.setItem("telegram_chat_id", chatId);
    setIsLinked(true);
    toast.success("Telegram successfully linked", {
      description: "You'll now receive security alerts on your Telegram",
      icon: <Bell className="h-4 w-4" />,
      duration: 3000,
    });
    setOpen(false);
    setStep(1);

    if (onSave) {
      onSave();
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText("/start");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) setStep(1);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={isLinked ? "minimal" : "accent"}
          size="sm"
          className="w-fit"
        >
          {isLinked ? (
            <span className="flex items-center w-fit gap-1">
              <Check className="w-3.5 h-3.5" />
              Linked
            </span>
          ) : (
            <span className="flex items-center w-fit gap-1">
              <Bell className="w-3.5 h-3.5" />
              Link Telegram
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-md rounded-lg bg-background p-6 shadow-md border border-border">
        <DialogHeader className="pt-0 flex flex-col items-center gap-4">
          <Bot className="h-10 w-10 text-foreground" />
          <DialogTitle className="text-xl font-semibold text-center text-foreground">
            Connect Telegram
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Link your Telegram to receive instant security alerts when incidents
            are detected
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-6 mb-4">
          {/* Progress steps - Improved version */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center w-full max-w-xs relative">
              {/* Line connecting steps */}
              <div className="absolute top-4 left-0 w-full h-[1px] bg-border"></div>

              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 flex flex-col items-center z-10">
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full transition-all ${
                      step === i
                        ? "bg-foreground ring-4 ring-background ring-offset-2 ring-offset-border"
                        : step > i
                        ? "bg-foreground"
                        : "bg-background border-2 border-border"
                    }`}
                  >
                    {step > i ? (
                      <Check className={`h-4 w-4 text-background`} />
                    ) : (
                      <span
                        className={`text-xs font-medium ${
                          step === i ? "text-background" : "text-foreground"
                        }`}
                      >
                        {i}
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs ${
                      step >= i
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {i === 1 ? "Connect" : i === 2 ? "Verify" : "Complete"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-background p-3 rounded-lg border border-border">
                <div className="bg-muted p-2 rounded-full">
                  <Bot className="h-5 w-5 text-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    Open The Watcher bot
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    This bot will send you security alerts
                  </p>
                </div>
                <a
                  href="https://t.me/userinfobot"
                  target="_blank"
                  className="ml-auto bg-foreground hover:bg-foreground/90 text-background py-1.5 px-3 rounded-md text-sm transition-colors font-medium flex items-center gap-1.5"
                  onClick={() => setTimeout(() => setStep(2), 500)}
                >
                  Open Bot
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
              <div className="text-center pt-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="text-sm text-muted-foreground"
                >
                  I opened the bot
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 border border-border flex items-start gap-3">
                <div className="bg-muted p-2 rounded-full mt-0.5">
                  <svg
                    className="h-4.5 w-4.5 text-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2 text-foreground">
                    Send this command to the bot
                  </p>
                  <div className="bg-muted/30 flex items-center justify-between p-2 rounded-md border border-border">
                    <code className="font-mono text-sm font-medium text-foreground">
                      /start
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={copyCommand}
                    >
                      {copied ? (
                        <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setStep(1)} size="sm">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  I sent the command
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label
                      htmlFor="chat-id"
                      className="text-sm font-medium flex items-center gap-1.5 text-foreground"
                    >
                      <span className="bg-muted p-1.5 rounded-full">
                        <svg
                          className="h-3.5 w-3.5 text-foreground"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.8 12H3M12 20L20 12L12 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      Your Telegram Chat ID
                    </label>
                    {chatId && (
                      <span className="text-xs text-muted-foreground">
                        {chatId.length} characters
                      </span>
                    )}
                  </div>
                  <Input
                    id="chat-id"
                    placeholder="Paste your Chat ID here"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="focus-visible:ring-foreground"
                  />
                  {!chatId && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5">
                      <AlertCircle className="h-3 w-3 text-muted-foreground" />
                      Copy the Chat ID from bot&apos;s response and paste it
                      here
                    </p>
                  )}
                </div>

                <div className="mt-4 bg-muted/30 p-3 rounded-md text-xs space-y-2 border border-border/50">
                  <div className="flex items-start gap-2">
                    <svg
                      className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-muted-foreground">
                      The bot will send you a message with your Chat ID. It
                      usually looks like{" "}
                      <span className="font-mono bg-muted p-0.5 rounded">
                        123456789
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)} size="sm">
                  Back
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!chatId}
                  className={
                    chatId
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : ""
                  }
                  size="sm"
                >
                  Save & Connect
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
