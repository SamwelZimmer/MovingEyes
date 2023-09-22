import { Variants } from "framer-motion";

export interface AnimationDirections {
    enter: {
      opacity: number;
      x?: string | number;
      y?: string | number;
    };
    exit: {
      opacity: number;
      x?: string | number;
      y?: string | number;
    };
}

export const directionMap: Record<"up" | "down" | "left" | "right", AnimationDirections> = {
    "up": {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "100%" },
    },
    "down": {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "-100%" },
    },
    "left": {
        enter: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: "100%" },
    },
    "right": {
        enter: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: "-100%" },
    },
};

export const directionVariants: Variants = {
    enter: directionMap.up.enter,
    exit: directionMap.up.exit,
};
  