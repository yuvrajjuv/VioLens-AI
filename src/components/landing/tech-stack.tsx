import { Brain, Zap, Server } from "lucide-react";

export default function TechStack() {
  return (
    <div className="mb-12 sm:mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Technology Stack</h2>
        <div className="hidden md:block">
          <div className="py-1 px-3 bg-primary/10 rounded-full text-xs font-medium text-primary">
            Enterprise Grade
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-6">
              <Brain className="w-5 h-5 text-primary mr-3" />
              <h3 className="text-xl font-semibold">AI & Machine Learning</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="font-medium">Google Gemini</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Advanced reasoning and context understanding
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="font-medium">Custom Vision Models</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Specialized object and activity detection
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="font-medium">Behavioral Analysis</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pattern recognition and anomaly detection
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="font-medium">BiLSTM Architecture</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Advanced sequence modeling for temporal data
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center mb-6">
              <Server className="w-5 h-5 text-primary mr-3" />
              <h3 className="text-xl font-semibold">Infrastructure</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="font-medium">Edge Computing</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Real-time processing at the network edge
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="font-medium">Cloud Integration</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scalable model training and data storage
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="font-medium">End-to-End Encryption</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enterprise-grade security protocols
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                <div>
                  <span className="font-medium">
                    Microservices Architecture
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Modular, resilient system design
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 p-6 md:p-8">
          <div className="flex items-center justify-center mb-6">
            <Zap className="w-5 h-5 text-primary mr-3" />
            <h3 className="text-xl font-semibold text-center">
              Performance Metrics
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background border border-border/60 hover:border-primary/30 transition-colors p-4 rounded-lg text-center group cursor-default">
              <div className="text-3xl font-bold mb-2 text-primary group-hover:scale-110 transition-transform">
                99.8%
              </div>
              <div className="text-sm text-muted-foreground">
                Detection Accuracy
              </div>
            </div>
            <div className="bg-background border border-border/60 hover:border-primary/30 transition-colors p-4 rounded-lg text-center group cursor-default">
              <div className="text-3xl font-bold mb-2 text-primary group-hover:scale-110 transition-transform">
                50ms
              </div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="bg-background border border-border/60 hover:border-primary/30 transition-colors p-4 rounded-lg text-center group cursor-default">
              <div className="text-3xl font-bold mb-2 text-primary group-hover:scale-110 transition-transform">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </div>
            <div className="bg-background border border-border/60 hover:border-primary/30 transition-colors p-4 rounded-lg text-center group cursor-default">
              <div className="text-3xl font-bold mb-2 text-primary group-hover:scale-110 transition-transform">
                95%
              </div>
              <div className="text-sm text-muted-foreground">
                Threat Prevention
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
