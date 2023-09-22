"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import React, { useState, useEffect, useRef } from 'react';
import { Howl } from "howler";
import { useRecoilState } from "recoil";

import { muteSoundAtom } from "../atoms/muteSoundAtom";
import { mouseTrackerAtom } from "../atoms/mouseTrackerAtom";
import { directionMap } from "../helpers/AnimationDirections";
import MouseTracker from "./MouseTracker";

const getRandomBlinkInterval = ( top: number, bottom: number ) => {
    // returns a random number between two numbers
    return Math.floor(Math.random() * (top - bottom + 1) + bottom);
};

export default function Eyes() {

    const [blink, setBlink] = useState(true);
    const [blinkCount, setBlinkCount] = useState(0);
    const [muted, _] = useRecoilState(muteSoundAtom);
    const [blinkingState, setBlinkingState] = useState(false);
    const [mouseOver, setMouseOver] = useState(false);
    let [coverCounter, setCoverCounter] = useState(0);

    const mutedRef = useRef(muted);

    if (coverCounter > 150) {
        setCoverCounter(0);
    }

    const handleMouseEnter = () => {
        setMouseOver(true);
    };

    const handleMouseLeave = () => {
        setMouseOver(false);
    };

    MouseTracker();

    const sound = new Howl({
        src: ["/sfx/blink1.mp3", "/sfx/blink1.ogg", "/sfx/blink1.webm"],
    });

    // handles the blinking of the eyes
    const blinkEye = () => {
            setBlink(true);
    
            if (!mutedRef.current) {
                sound.play();
            }
            setTimeout(() => setBlink(false), 80);
    };    

    // changes to a muted state when user presses button
    useEffect(() => {
        mutedRef.current = muted;
    }, [muted]);    

    // a delay between the initial 'waking' state and the blinking state
    useEffect(() => {
        const timeout = setTimeout(() => setBlinkingState(true), 6000);
    
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (mouseOver) {
            if (blinkingState) {
                setCoverCounter(coverCounter + 1);
            }
            setBlink(true);
        } else {
            setBlink(false);
        }
    }, [mouseOver])

    useEffect(() => {
        let blinkingTimeout: NodeJS.Timeout;
        
        if (!mouseOver) {
            // handles the delay between blinks
            blinkingTimeout = setTimeout(() => {
                blinkEye();

                // After blinking, set the next random blink interval
                const interval = setInterval(() => {
                    blinkEye();
                    clearInterval(interval); // Clear the current interval
                    
                    // Call useEffect function again to set a new random blink interval
                    setBlinkCount(prevCount => prevCount + 1);
                }, getRandomBlinkInterval(10000, 20000));
            }, getRandomBlinkInterval(5000, 10000));
        }
        
        if (!blinkingState && !mouseOver) {
            setBlink(true);
            setTimeout(() => {
                setBlink(false);

                setTimeout(() => {
                    blinkEye();

                    setTimeout(() => {
                        blinkEye();
                    }, 200);
                }, 1000);
            }, 1500);
        }
        
        return () => {
            clearTimeout(blinkingTimeout); // cleanup timeout
        };
    }, [blinkCount, mouseOver]);

    
    return (

        <>
        <div className="relative flex mx-auto h-max items-center">     
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="absolute top-0 left-0 z-10 h-full w-full" />

            <Eye 
                eye="/left_eye.svg" 
                pupil="/left_pupil.svg" 
                lid="/eyelid.svg" 
                blink={blink} 
                pupilPosition={{ width: 80, height: 150, top: 20, left: -9, radius: 15 }}
            />
            <Eye 
                eye="/right_eye.svg" 
                pupil="/right_pupil.svg" 
                lid="/eyelid.svg" 
                blink={blink} 
                pupilPosition={{ width: 80, height: 145, top: 20, left: -12, radius: 10 }}
            />

            
            <SpeechBubble src="/speech_bubbles/bubble_initial.png" top={110} left={-30} direction="up" delay={3500} duration={4000} />

            <div className="hidden sm:block">
                { (coverCounter === 1 || (coverCounter % 12 === 0 && coverCounter !== 0)) &&  <SpeechBubble src="/speech_bubbles/bubble_1.png" top={-50} left={-120} direction="right" delay={200} duration={3000} size={200} /> }
                { (coverCounter === 4 || (coverCounter % 17 === 0 && coverCounter !== 0)) &&  <SpeechBubble src="/speech_bubbles/bubble_2.png" top={-50} left={-120} direction="right" delay={200}  duration={3000} size={200} /> }
                { (coverCounter === 8 || (coverCounter % 23 === 0 && coverCounter !== 0)) &&  <SpeechBubble src="/speech_bubbles/bubble_3.png" top={-60} left={100} direction="down" delay={200}  duration={3000} size={200} /> }
                { (coverCounter === 15 || (coverCounter % 30 === 0 && coverCounter !== 0)) &&  <SpeechBubble src="/speech_bubbles/bubble_4.png" top={80} left={100} direction="up" delay={200}  duration={3000} size={200} /> }
                { (coverCounter === 56 || (coverCounter % 112 === 0 && coverCounter !== 0)) &&  <SpeechBubble src="/speech_bubbles/bubble_5.png" top={100} left={-50} direction="up" delay={200}  duration={3000} size={300} /> }
                { coverCounter === 149 &&  <SpeechBubble src="/speech_bubbles/bubble_6.png" top={-100} left={-50} direction="down" delay={200}  duration={3000} size={300} /> }
            </div>


        </div>
        </>

    );
};

interface SpeechBubble {
    top: number; 
    left: number;
    src: string;
    direction: "left" | "up" | "down" | "right";
    delay?: number;
    duration?: number;
    size?: number;
}

const SpeechBubble = ({ top, left, src, direction, delay=1, duration=2000, size=300 }: SpeechBubble) => {

    const [visible, setVisible] = useState(false);

    const selectedDirection = directionMap[direction as "left" | "up" | "down" | "right"];

    const variants: Variants = {
        enter: selectedDirection.enter,
        exit: selectedDirection.exit,
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, []); 

    return (
        <motion.div 
            className={`${!visible && "hidden"} absolute z-10`}
            animate={visible ? "enter" : "exit"} 
            variants={variants} 
            style={{ top: `${top}%`, left: `${left}%`, width: `${size}px`}} 
        >
            <Image 
                priority
                src={src}
                alt="who turned the lights out?" 
                width={300} 
                height={300} 
                className="w-full"
            />
        </motion.div>
    );
}

interface PupilPosition {
    height: number;
    width: number;
    top: number;
    left: number;
    radius: number;
}

interface EyeProps {
    eye: string;
    pupil: string;
    lid: string;
    blink?: boolean;
    pupilPosition: PupilPosition;
}

const Eye = ({ eye, pupil, lid, blink, pupilPosition }: EyeProps) => {

    const [position, _] = useRecoilState(mouseTrackerAtom);

    const ref = React.useRef<HTMLDivElement | null>(null);

    const rect = ref.current?.getBoundingClientRect();

    const width = pupilPosition.width;
    const height = pupilPosition.height;

    let x_c, y_c
    let x_p = 0, y_p = 0

    const radius = pupilPosition.radius;

    if (rect) {
        x_c = rect.left + (width / 2);
        y_c = rect.top + (height / 2);

        let theta = Math.atan2(y_c - position.y, x_c - position.x);

        x_p = -radius * Math.cos(theta);
        y_p = -radius * Math.sin(theta);        
    };

    return (
        <>

            <div className='relative w-max h-max'>

                {/* eye */}
                <Image 
                    priority 
                    src={eye} alt='eye' 
                    width="100" height="100" 
                />

                {/* pupil */}
                <div className="absolute w-full h-full" style={{ top: `${pupilPosition.top}%`, left: `${pupilPosition.left}%` }}>
                    <div ref={ref} className="relative w-full h-full">
                        <Image 
                            className='absolute'
                            style={{ top: `${y_p + height / 2}px`, left: `${x_p + width / 2}px` }}
                            priority 
                            src={pupil} alt='eye' 
                            width="35" height="35" 
                        />
                    </div>
                </div>

                {/* eyelid */}
                <Image
                    className='absolute eyelid'
                    style={{ bottom: blink ? "0%" : "60%", left: "0%" }}
                    priority 
                    src={lid} alt='eye' 
                    width="100" height="100" 
                />

            </div>
        </>

    );
}