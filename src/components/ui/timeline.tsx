"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState, RefObject } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  scrollContainerRef?: RefObject<HTMLElement>;
}

export const Timeline = ({ data, scrollContainerRef }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        setHeight(ref.current.scrollHeight);
      }
    };
    
    updateHeight();
    
    // Recalculate on resize
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [data]);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div className="w-full font-sans" ref={ref}>
      <div className="relative pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-16 gap-4 md:gap-6"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start w-auto md:w-72 flex-shrink-0">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-muted border border-border p-2" />
              </div>
              <h3 className="hidden md:block text-lg md:pl-16 md:text-xl font-bold text-muted-foreground whitespace-nowrap">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-16 pr-4 md:pl-0 md:pr-4 flex-1 min-w-0">
              <h3 className="md:hidden block text-xl mb-4 text-left font-bold text-muted-foreground">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        
        {/* Background line */}
        <div
          style={{ height: height + "px" }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-border/50 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        />
        
        {/* Animated glow line */}
        <motion.div
          style={{
            height: heightTransform,
            opacity: opacityTransform,
          }}
          className="absolute md:left-8 left-8 top-0 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-purple-500/50 rounded-full shadow-[0_0_8px_2px_rgba(147,51,234,0.5)]"
        />
      </div>
    </div>
  );
};
