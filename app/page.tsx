'use client';
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Confetti from "react-confetti";
import Image from "next/image";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";


const HER_NAME = "Roju";
const FIRST_BDAY_TOGETHER = new Date("2021-10-04");
const BIRTHDAY_MONTH = 10;
const BIRTHDAY_DAY = 4;

const GALLERY_IMAGES: string[] = [
    "/photos/1.jpeg",
    "/photos/2.jpeg",
    "/photos/2.jpeg",
    "/photos/3.jpeg",
    "/photos/4.jpeg",
    "/photos/5.jpeg",
];

function countBirthdaysTogether(firstCelebrationDate: Date, today = new Date()) {
    const firstYear = firstCelebrationDate.getFullYear();
    const currentYear = today.getFullYear();

    let count = 0;
    for (let y = firstYear; y <= currentYear; y++) {
        const thisYearsBday = new Date(y, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY);
        if (thisYearsBday >= firstCelebrationDate && thisYearsBday <= today) {
            count++;
        }
    }
    return count;
}

function timeUntilNextBirthday(today = new Date()) {
    // Set the target time to 11:59 PM on October 3rd
    const targetTime = new Date(today.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY - 1, 23, 59, 0);

    // If the current time is past the target time, set the target to next year's birthday
    if (today > targetTime) {
        targetTime.setFullYear(today.getFullYear() + 1);
    }

    const ms = targetTime.getTime() - today.getTime(); // Total milliseconds difference
    const totalSeconds = Math.floor(ms / 1000); // Total full seconds
    const totalMinutes = Math.floor(totalSeconds / 60); // Total full minutes
    const totalHours = Math.floor(totalMinutes / 60); // Total full hours
    const totalDays = Math.floor(totalHours / 24); // Total full days

    const remainingHours = totalHours % 24; // Remaining hours after accounting for full days
    const remainingMinutes = totalMinutes % 60; // Remaining minutes after accounting for full hours
    const remainingSeconds = totalSeconds % 60; // Remaining seconds after accounting for full minutes

    return { totalDays, remainingHours, remainingMinutes, remainingSeconds };
}

function daysUntilNextBirthday(today = new Date()) {
    const { totalDays } = timeUntilNextBirthday(today);
    return totalDays;
}

function hoursUntilNextBirthday(today = new Date()) {
    const { remainingHours } = timeUntilNextBirthday(today);
    return remainingHours;
}

function minutesUntilNextBirthday(today = new Date()) {
    const { remainingMinutes } = timeUntilNextBirthday(today);
    return remainingMinutes;
}

function secondsUntilNextBirthday(today = new Date()) {
    const { remainingSeconds } = timeUntilNextBirthday(today);
    return remainingSeconds;
}


// Simple number animation hook
function useAnimatedNumber(target: number, duration = 1200) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const start = performance.now();
        let raf: number;
        const step = (ts: number) => {
            const p = Math.min(1, (ts - start) / duration);
            setValue(Math.round(p * target));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return value;
}

function MusicButton() {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null); // Explicitly type the ref

    useEffect(() => {
        // Create audio on mount
        const audio = new Audio("/music/bg.mp3");
        audio.loop = true;
        audioRef.current = audio;
        return () => audio.pause(); // Cleanup on unmount
    }, []);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return; // Ensure audio exists
        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            audio.play().catch(() => {}); // Handle play errors
            setPlaying(true);
        }
    };

    return (
        <button
            onClick={toggle}
            className="fixed bottom-5 right-5 z-50 rounded-full px-4 py-3 shadow-lg bg-pink-500 text-white hover:bg-pink-600 transition"
            aria-label="Toggle music"
        >
            {playing ? "⏸️ Pause" : "▶️ Play"}
        </button>
    );
}

interface ThemeToggleProps {
    dark: boolean;
    setDark: (value: boolean) => void;
}

function ThemeToggle({ dark, setDark }: ThemeToggleProps) {
    return (
        <button
            onClick={() => setDark(!dark)}
            className="fixed sm:top-5 top-16 right-5 z-50 p-3 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600"
            aria-label="Toggle theme"
        >
            {dark ? "☀️" : "🌙"}
        </button>
    );
}


function FloatingHearts() {
    const init = async (engine: Engine) => {
        await loadSlim(engine);
    };
    return (
        <Particles
            id="tsparticles"
            init={init}
            className="absolute inset-0 -z-10"
            options={{
                fullScreen: false,
                background: { color: { value: "transparent" } },
                particles: {
                    number: { value: 12 },
                    move: { enable: true, direction: "top", speed: 0.8, outModes: { default: "out" } },
                    opacity: { value: 0.8 },
                    size: { value: 14 },
                    shape: {
                        type: "char",
                        character: [{ value: "💖" }, { value: "💕" }, { value: "🎈" }],
                    },
                },
                detectRetina: true,
            }}
        />
    );
}

function GiftBox() {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex flex-col items-center mt-10">
            <motion.div
                whileHover={{ scale: 1.06, rotate: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setOpen(true)}
                className="cursor-pointer text-7xl select-none"
                title="Open me"
            >
                🎁
            </motion.div>

            {open && (
                <motion.div
                    initial={{ scale: 0, rotate: 6, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.7 }}
                    className="mt-6 p-6 bg-pink-100 rounded-2xl shadow-lg max-w-md text-center"
                >
                    <p className="text-lg font-semibold text-pink-600 font-mono">
                        Surprise! You are my greatest gift 💝
                    </p>
                    <p className="text-gray-700 mt-2 font-mono">
                        Today and always, I choose you. Here&apos;s to a lifetime of birthdays together.
                    </p>
                </motion.div>
            )}
        </div>
    );
}

function LoveLetter() {
    const [open, setOpen] = useState(false);
    return (
        <section className="py-20 bg-white text-center">
            <h2 className="text-4xl font-bold text-pink-600 mb-6">A Message For You 💌</h2>
            <motion.button
                whileTap={{ scale: 0.96 }}
                className="bg-purple-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-purple-600 transition"
                onClick={() => setOpen(!open)}
            >
                {open ? "Hide Letter" : "Open Letter"}
            </motion.button>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden mt-6 max-w-2xl mx-auto p-6 bg-pink-100 rounded-2xl shadow-lg text-left"
            >
                <p className="text-lg text-gray-700 leading-relaxed" style={{ fontFamily: 'cursive' }}>
                    My dearest {HER_NAME},<br />
                    Every moment with you is a blessing. Thank you for filling my life with joy, patience,
                    and the warmest love. On your special day, I wish you endless giggles, cozy nights,
                    new adventures, and dreams that come true. You are my favorite hello and hardest goodbye.
                    Forever yours. ❤️
                </p>
            </motion.div>
        </section>
    );
}


function GalleryGrid() {
    return (
        <section className="py-20 bg-white">
            <h2 className="text-4xl font-bold text-center text-pink-600 mb-10">Our Memories 📸</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 md:px-10">
                {GALLERY_IMAGES.map((src, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-2xl overflow-hidden shadow-lg group"
                    >
                        <Image src={src} alt={`Memory ${i + 1}`} width={600} height={600} className="object-cover w-full h-64" />
                        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50">
                            <p className="text-sm text-gray-600 font-mono opacity-90 group-hover:opacity-100 transition">
                                &quot;A favorite moment with you.&quot;
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}


function Doodles() {
    return (
        <div className="pointer-events-none select-none">
            <svg className="absolute top-24 left-6 w-16 h-16 opacity-50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M10 50 C 10 20, 50 20, 50 50 S 90 80, 90 50" className="text-pink-400" />
            </svg>
            <svg className="absolute bottom-24 right-6 w-16 h-16 opacity-50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="50" cy="50" r="30" className="text-purple-400" />
                <path d="M30 55 L50 35 L70 55" className="text-purple-400" />
            </svg>
            <svg className="absolute top-1/2 right-1/3 w-16 h-16 opacity-40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 60 Q 50 10, 80 60" className="text-rose-400" />
                <path d="M35 55 Q 50 35, 65 55" className="text-rose-400" />
            </svg>
        </div>
    );
}

function ParallaxLayer() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 600], [0, -40]);
    const y2 = useTransform(scrollY, [0, 600], [0, -80]);
    const y3 = useTransform(scrollY, [0, 600], [0, -120]);

    return (
        <>
            <motion.div style={{ y: y1 }} className="pointer-events-none select-none text-6xl absolute top-10 left-10">🎈</motion.div>
            <motion.div style={{ y: y2 }} className="pointer-events-none select-none text-6xl absolute top-20 right-16">🎂</motion.div>
            <motion.div style={{ y: y3 }} className="pointer-events-none select-none text-6xl absolute top-40 left-1/2">💘</motion.div>
        </>
    );
}

export default function Home() {
    const [showConfetti, setShowConfetti] = useState(false);
    const [dark, setDark] = useState(false);
    const [specialMessage, setSpecialMessage] = useState(false); // State for special message

    const birthdaysCount = useMemo(() => countBirthdaysTogether(FIRST_BDAY_TOGETHER), []);
    const animatedCount = useAnimatedNumber(birthdaysCount);

    // State for live countdown
    const [timeLeft, setTimeLeft] = useState(timeUntilNextBirthday());

    useEffect(() => {
        // Update the countdown every second
        const interval = setInterval(() => {
            setTimeLeft(timeUntilNextBirthday());
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useEffect(() => {
        // Check if the current time is October 3rd at midnight
        const now = new Date();
        if (
            now.getMonth() === 9 && // October (0-based index)
            now.getDate() === 3 &&
            now.getHours() === 0 &&
            now.getMinutes() === 0
        ) {
            setSpecialMessage(true); // Trigger the special message
        }
    }, []);

    return (
        <main className={`${dark ? "bg-[#0f0a1f] text-white" : "bg-[linear-gradient(135deg,#fde2e4,#e9d5ff,#fff3bf)] text-gray-800"} relative min-h-screen overflow-x-hidden`}>
            {/* Google Font quick include (Great Vibes for headings) */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />

            {/* Controls */}
            <ThemeToggle dark={dark} setDark={setDark} />
            <MusicButton />

            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
                <FloatingHearts />
                <ParallaxLayer />
                <Doodles />
            </div>

            {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

            {/* Special Message Modal */}
            {specialMessage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                        <h2 className="text-3xl font-bold text-pink-600 mb-4">🎉 Special Midnight Surprise! 🎉</h2>
                        <p className="text-gray-700 font-mono">
                            You opened this at the perfect time! Here's to celebrating the most magical moments with you. 💖
                        </p>
                        <button
                            onClick={() => setSpecialMessage(false)}
                            className="mt-6 bg-pink-500 text-white px-4 py-2 rounded-full shadow hover:bg-pink-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            )}

            {/* 🥳 Hero */}
            <section className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl sm:text-6xl font-extrabold text-pink-600" style={{ fontFamily: 'Great Vibes, cursive' }}
                >
                    Happy Birthday, {HER_NAME} 💖
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 text-lg max-w-2xl font-mono"
                >
                    You make my world brighter every day. I&apos;m so lucky to have you in my life.
                </motion.p>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="font-mono mt-8 bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 transition"
                    onClick={() => setShowConfetti(true)}
                >
                    Click for Surprise 🎉
                </motion.button>

                {/* Cute counters */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow text-gray-800">
                        <p className="text-sm font-mono">Birthdays together</p>
                        <p className="text-4xl font-bold text-pink-600">{animatedCount}</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow text-gray-800">
                        <p className="text-sm font-mono">Days until your next birthday</p>
                        <p className="text-4xl font-bold text-purple-600">{timeLeft.totalDays}</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow text-gray-800">
                        <p className="text-sm font-mono">Hours until your next birthday</p>
                        <p className="text-4xl font-bold text-blue-600">{timeLeft.remainingHours}</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow text-gray-800">
                        <p className="text-sm font-mono">Minutes and Seconds</p>
                        <p className="text-4xl font-bold text-green-600">
                            {timeLeft.remainingMinutes}m {timeLeft.remainingSeconds}s
                        </p>
                    </div>
                </div>
            </section>


            {/* 🖼️ Gallery */}
            <GalleryGrid />

            {/* 💌 Love Letter */}
            <LoveLetter />

            {/* 🎁 Gift Box */}
            <section className="py-20 bg-gradient-to-b from-white to-pink-50">
                <h2 className="text-4xl font-bold text-center text-pink-600">A Little Gift For You 🎁</h2>
                <GiftBox />
            </section>

            {/* 💫 Ending */}
            <section className="py-24 text-center">
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl sm:text-4xl font-semibold"
                    style={{ fontFamily: 'Great Vibes, cursive' }}
                >
                    I love you to the moon 🌙 and back 💫
                </motion.h3>
                <p className="mt-4 opacity-80 font-mono">Forever and always.</p>
                <p className="mt-4 opacity-80 font-mono">Made with 💘 by Aarjaw for {HER_NAME} | You are my universe 🌌</p>
            </section>
        </main>
    );
}
