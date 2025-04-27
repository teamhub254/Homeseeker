
import { useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

export function useCarouselAutoplay(
  api: CarouselApi | null,
  interval: number = 5000
) {
  useEffect(() => {
    if (!api) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, interval);

    return () => clearInterval(timer);
  }, [api, interval]);
}
