import Model350Icon from "@/Icon/model350Icon";
import {
  ArrowRight,
  Github,
  Lock,
  Mail,
  MessageSquare,
  Building,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const Footer = () => {
  return (
    <footer className="mt-24">
      <div className="mb-20">
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-12 bg-border mr-4"></div>
          <h2 className="text-3xl font-bold tracking-tight text-center">
            Get Started
          </h2>
          <div className="h-px w-12 bg-border ml-4"></div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border/40 overflow-hidden">
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-background/0 pointer-events-none"></div>

            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="mb-8 md:mb-0 md:mr-8 md:max-w-[60%]">
                <h3 className="text-2xl font-semibold mb-4">
                  Ready to enhance your security?
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Deploy The Watcher in your environment and experience
                  next-generation AI surveillance with real-time threat
                  detection.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="group" size="lg">
                    Request Access{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/20"
                  >
                    <Mail className="w-4 h-4 mr-2" /> Contact Sales
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-1/3">
                <div className="bg-background border border-border/60 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-5 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-primary" />
                    Enterprise Solutions
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <ShieldCheck className="w-5 h-5 mr-3 text-primary shrink-0" />
                      <div>
                        <span className="font-medium">Custom Deployment</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tailored to your security infrastructure
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <MessageSquare className="w-5 h-5 mr-3 text-primary shrink-0" />
                      <div>
                        <span className="font-medium">24/7 Support</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Dedicated technical assistance
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Lock className="w-5 h-5 mr-3 text-primary shrink-0" />
                      <div>
                        <span className="font-medium">Model Customization</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Specialized for your unique needs
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 pt-12 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-6 md:mb-0">
            <Model350Icon width={44} height={44} className="mr-4" />
            <div>
              <h3 className="font-semibold">The Watcher</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent Surveillance
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Product
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 The Watcher AI. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="https://github.com/atharva00721"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
