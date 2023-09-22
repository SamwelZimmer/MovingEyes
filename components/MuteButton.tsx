"use client";

import { useRecoilState } from "recoil";
import { motion } from "framer-motion";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";

import { muteSoundAtom } from "../atoms/muteSoundAtom";

export default function MuteButton() {
    const [muted, setMuted] = useRecoilState(muteSoundAtom);

    return (
        <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={() => setMuted(!muted)} 
            className="p-4 aspect-square text-white/50 hover:text-white "
        >
            { muted ? <HiOutlineSpeakerXMark size={32} /> : <HiOutlineSpeakerWave size={32} /> }        
        </motion.button>
    );
}