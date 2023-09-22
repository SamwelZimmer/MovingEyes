"use client";

import { useRecoilState } from "recoil";
import React, { useEffect } from "react";

import { mouseTrackerAtom } from "../atoms/mouseTrackerAtom";

export default function MouseTracker() {

    const [position, setPosition] = useRecoilState(mouseTrackerAtom);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
          setPosition({
            x: event.clientX,
            y: event.clientY,
          });
        };
    
        // Attach the event listener to the document
        document.addEventListener('mousemove', handleMouseMove);
    
        // Cleanup the event listener when the component is unmounted
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Empty dependency array ensures this useEffect runs once when the component mounts and cleans up when it unmounts
};