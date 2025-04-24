"use client";

import { useState } from "react";
import { Button } from "../ui/button";
export function Carousel({ children }) {
  const [index, setIndex] = useState(0);
  const items = Array.isArray(children) ? children : [children];

  const next = () => {
    setIndex((index + 1) % items.length);
  };

  return (
    <div className="space-y-4">
      <div className="h-28 flex items-center justify-center border rounded-xl bg-white shadow-sm px-4 text-lg font-medium text-gray-700">
        {items[index]}
      </div>
      <div className="text-center">
        <Button onClick={next}>Next</Button>
      </div>
    </div>
  );
}

export function CarouselItem({ children }) {
  return <div>{children}</div>;
}
