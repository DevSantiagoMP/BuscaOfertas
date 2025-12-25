import type { RefObject } from "react";

export const scrollSlider = (
  ref: RefObject<HTMLElement | null>,
  direction: "left" | "right",
  amount: number = 350
) => {
  if (!ref.current) return;

  ref.current.scrollBy({
    left: direction === "left" ? -amount : amount,
    behavior: "smooth",
  });
};