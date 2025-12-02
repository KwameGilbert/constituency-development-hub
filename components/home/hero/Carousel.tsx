"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 1000, stopOnInteraction: true })
  );

  return (
    <Carousel
      className="w-full"
      onMouseEnter={() => plugin.current?.stop()}
      onMouseLeave={() => plugin.current?.reset()}
    >
      <CarouselContent className="h-screen flex items-center justify-center relative">
        <div className="absolute top-1/2 left-0 transform">
          <CarouselPrevious />
        </div>
        <div className="absolute top-1/2 right-0 transform  z-10">
          {/* <CarouselNext className="carousel-next-button" /> */}
          <CarouselNext />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="">
            <div className="p-1">
              <Card className="">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
