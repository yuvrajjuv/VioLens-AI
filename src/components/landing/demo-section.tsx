"use client";
import { useState } from "react";
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from "./expandable";
import { Radar, Clock, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { modelData } from "@/constants/models";

export function WatcherModelCardList() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="pb-8">
      <div className="text-center mb-12">
        {/* <h2 className="doto-black text-3xl font-bold text-foreground">
          Our AI Models
        </h2> */}
        {/* <p className="text-muted-foreground">
          Explore our cutting-edge AI models designed for real-world
          applications.
        </p> */}
      </div>
      <div className="flex flex-col gap-24">
        {modelData.map((model, index) => {
          const Logo = model.logo;

          return (
            <Expandable
              key={index}
              expandDirection="both"
              expandBehavior="replace"
              expanded={expandedIndex === index}
              onToggle={() =>
                setExpandedIndex((prev) => (prev === index ? null : index))
              }
              className="w-full"
            >
              <ExpandableTrigger>
                <ExpandableCard
                  className="w-full"
                  collapsedSize={{ height: 220 }}
                  expandedSize={{ height: 480 }}
                  hoverToExpand={false}
                  expandDelay={100}
                  collapseDelay={400}
                >
                  <ExpandableCardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Logo className="w-10 h-10" />
                        <ExpandableContent preset="blur-sm" keepMounted>
                          <h3 className="font-semibold text-lg text-foreground">
                            {model.title}
                          </h3>
                          <Badge variant="secondary">{model.name}</Badge>
                        </ExpandableContent>
                      </div>
                    </div>
                  </ExpandableCardHeader>

                  <ExpandableCardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {model.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {model.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          Model: {model.status}
                        </p>
                        <ExpandableContent
                          preset="blur-sm"
                          stagger
                          staggerChildren={0.1}
                          keepMounted
                        >
                          <p className="text-sm text-muted-foreground">
                            Real-time analysis
                          </p>
                        </ExpandableContent>
                      </div>
                    </div>

                    <ExpandableContent
                      preset="blur-sm"
                      stagger
                      staggerChildren={0.1}
                      keepMounted
                    >
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-muted-foreground">
                          <div className="flex items-center">
                            <Radar className="w-5 h-5 mr-2" />
                            <span>Detection Zones</span>
                          </div>
                          <span>{model.zones} active</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            <span>Latency</span>
                          </div>
                          <span>{model.latency}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <div className="flex items-center">
                            <Gauge className="w-5 h-5 mr-2" />
                            <span>Accuracy</span>
                          </div>
                          <span>{model.accuracy}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-medium text-foreground mb-2">
                          Model Evaluation Scorecard
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          {Object.entries(model.evaluation).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="rounded-xl bg-muted p-4 shadow-sm"
                              >
                                <p className="text-xs text-muted-foreground uppercase">
                                  {key}
                                </p>
                                <p className="text-xl font-bold text-foreground">
                                  {value}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </ExpandableContent>
                  </ExpandableCardContent>

                  <ExpandableCardFooter>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {model.lastUpdated}
                    </p>
                  </ExpandableCardFooter>
                </ExpandableCard>
              </ExpandableTrigger>
            </Expandable>
          );
        })}
      </div>
    </section>
  );
}
