import { atom } from "recoil";

export const mouseTrackerAtom = atom({
    key: "mouseTrackerAtom",
    default: { x: 0, y: 0 },
  });