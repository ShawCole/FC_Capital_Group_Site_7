import React, { useRef, useState, useEffect } from "react";
import {
    motion,
    useScroll,
    useMotionValueEvent,
    useMotionValue,
    transform,
    MotionValue,
    useTransform,
} from "framer-motion";
const CommunityIcon = new URL("./icons/background/Community_Background.png", import.meta.url).href;
const IndividualIcon = new URL("./icons/background/Individual_Background.png", import.meta.url).href;
const LandIcon = new URL("./icons/background/Land_Background.png", import.meta.url).href;

// --- 1. Define Orbit Parameters ---
const ORBIT_CENTER_X = 400;
const ORBIT_CENTER_Y = 400;

// --- 2. Define Angles (in Radians) ---
const START_ANGLE = 0; // 3 o'clock
const END_ANGLE_BASE = Math.PI; // 9 o'clock

// --- 3. Define Icon Start Angles (Equilateral Triangle) ---
// This is the FIX: Reverting to the correct start angles.
// Icon 1 (Blue) is at 11 o'clock. Icon 2 (Green) is at 7 o'clock.
const ICON_3_START_ANGLE = START_ANGLE; // 0 (Purple)
const ICON_1_START_ANGLE = START_ANGLE + (Math.PI * 2) / 3; // 2*PI/3 (Blue)
const ICON_2_START_ANGLE = START_ANGLE + (Math.PI * 4) / 3; // 4*PI/3 (Green)


// --- 4. Define Final Resting Y Positions ---
const FINAL_Y_3 = 690; // Icon 3 is the anchor

// --- 5. NEW ROBUST BREAKPOINT LOGIC ---
// Define the unique break angle for each icon.
// They all break at 9 o'clock (PI), but on different loops
// to ensure the 3-2-1 break order.
const ICON_3_BREAK_ANGLE = END_ANGLE_BASE; // PI (Breaks first - Purple)
const ICON_2_BREAK_ANGLE = END_ANGLE_BASE + (Math.PI * 2); // 3*PI (Breaks second - Green)
const ICON_1_BREAK_ANGLE = END_ANGLE_BASE + (Math.PI * 2); // 3*PI (Breaks last - Blue)

// The "master" timeline is based on the icon that travels the furthest (Icon 1)
// This is the FIX: Recalculated master distance based on correct start angle.
// Icon 1 travels: 3*PI - 2*PI/3 = 7*PI/3
// Icon 2 travels: 3*PI - 4*PI/3 = 5*PI/3
// Icon 3 travels: PI
// Longest path is 7*PI/3 (Icon 1), which is 1.16 orbits.
const MASTER_TRAVEL_DISTANCE = ICON_1_BREAK_ANGLE - ICON_1_START_ANGLE; // 7*PI/3
const MASTER_BREAK_TIME = 0.8; // Finish orbit at 80% scroll to leave time for drop

// --- 6. Define Easing ---
// This is a power-of-4 easing function.
const quarticOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Interface to store the icon's state at the *exact* moment
 * it crosses the breakpoint.
 */
interface HandoffState {
    x: number; // The exact X position
    y: number; // The exact Y position
    scroll: number; // The exact scroll %
}

/**
 * The main component
 */
export default function ScrollOrbit({ showControls = false }: { showControls?: boolean }) {
    const containerRef = useRef(null);

    // --- 7. SLIDER STATE ---
    const [iconSpacing, setIconSpacing] = useState(100);
    const [orbitRadius, setOrbitRadius] = useState(200);

    // --- 8. DYNAMIC CONSTANTS (Calculated on every render) ---
    // Recalculate Final Y positions based on slider state
    const FINAL_Y_2 = FINAL_Y_3 - iconSpacing;
    const FINAL_Y_1 = FINAL_Y_2 - iconSpacing;

    // Recalculate "Golden Velocity" based on slider state
    // dAngle/dScroll = (Total Angle) / (Total Scroll)
    const dAngle_dScroll = MASTER_TRAVEL_DISTANCE / MASTER_BREAK_TIME; // (7*PI/3) / 0.8
    // V_y = -cos(angle) * R * (dAngle/dScroll)
    // At the 9 o'clock break (angle=PI, 3*PI, 5*PI), cos(angle) = -1
    // So, V_y = -(-1) * R * (dAngle/dScroll) = R * (dAngle/dScroll)
    const orbitalVerticalVelocity =
        orbitRadius * dAngle_dScroll;

    // --- 9. Setup Scroll Tracking ---
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });
    // Global page scroll progress (for high‑resolution page %)
    const { scrollYProgress: pageProgress } = useScroll();

    // --- Track sizing (pre + pinned + post) ---
    const preRollVh = 20;     // see a bit of the section before pin
    const postRollVh = 300;   // time while pinned (scroll budget after pin)
    const trackVh = preRollVh + 100 + postRollVh; // total container height in vh
    const stageY = useMotionValue(0); // no visual shift; pin at container start
    const [topOffset, setTopOffset] = useState(0);
    const pinNudgePx = -2; // moved view window down by 8px

    // Respect the fixed site header height so sticky pins below it
    useEffect(() => {
        const measure = () => {
            const hdr = document.querySelector('header');
            setTopOffset(hdr ? (hdr as HTMLElement).offsetHeight : 0);
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    // --- Debug state: page scroll % and orbit progress % ---
    const [pageScrollPct, setPageScrollPct] = useState(0);
    const [orbitPct, setOrbitPct] = useState(0);

    // Drive page % from Framer's high‑resolution progress
    useMotionValueEvent(pageProgress, "change", (v) => {
        setPageScrollPct(Number((v * 100).toFixed(2)));
    });

    // --- Motion Values ---
    const icon1_x = useMotionValue(0);
    const icon1_y = useMotionValue(0);
    const text1_opacity = useMotionValue(0);

    const icon2_x = useMotionValue(0);
    const icon2_y = useMotionValue(0);
    const text2_opacity = useMotionValue(0);

    const icon3_x = useMotionValue(0);
    const icon3_y = useMotionValue(0);
    const text3_opacity = useMotionValue(0);

    const title_opacity = useMotionValue(0);

    // --- Handoff State Refs ---
    // These store the handoff state to make the animation deterministic
    const icon1Handoff = useRef(null);
    const icon2Handoff = useRef(null);
    const icon3Handoff = useRef(null);

    // --- 10. The "BRAIN" ---
    // This event listener runs on every scroll frame
    const [isPinned, setIsPinned] = useState(false);
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Normalize scroll progress to the pinned window [preRoll .. preRoll+postRoll]
        const start = preRollVh / trackVh;
        const end = (preRollVh + postRollVh) / trackVh;
        const p = transform(latest, [start, end], [0, 1], { clamp: true });
        // Debug: update orbit percentage (2 decimal places)
        setOrbitPct(Number((p * 100).toFixed(2)));
        setIsPinned(latest >= start && latest <= end);
        // `latest` is the scroll progress from 0.0 to 1.0

        // --- Master Angle Calculation ---
        // Calculate the "master" angle based on scroll within pinned window.
        const currentAngle = transform(
            p,
            [0, MASTER_BREAK_TIME],
            [0, MASTER_TRAVEL_DISTANCE]
        );

        // --- Logic for Icon 1 (Blue) ---
        // This icon breaks last
        const i1_orbitAngle = ICON_1_START_ANGLE + currentAngle;
        const i1_current_x = ORBIT_CENTER_X + Math.cos(i1_orbitAngle) * orbitRadius;
        const i1_current_y = ORBIT_CENTER_Y - Math.sin(i1_orbitAngle) * orbitRadius;

        if (i1_orbitAngle < ICON_1_BREAK_ANGLE && p < MASTER_BREAK_TIME) {
            // Phase 1: Orbit
            icon1_x.set(i1_current_x);
            icon1_y.set(i1_current_y);
            icon1Handoff.current = null; // Reset handoff ref on scroll up
        } else {
            // Phase 3: Slowdown
            if (!icon1Handoff.current) {
                // Capture the exact handoff state ONCE
                icon1Handoff.current = {
                    x: ORBIT_CENTER_X - orbitRadius, // Guaranteed X
                    y: ORBIT_CENTER_Y,                 // Guaranteed Y
                    scroll: MASTER_BREAK_TIME, // We know it breaks at this time
                };
            }

            const { x: handoffX, y: handoffY, scroll: handoffScroll } =
                icon1Handoff.current;

            icon1_x.set(handoffX); // Lock X

            // ROBUST DURATION CALCULATION
            const i1_distance = FINAL_Y_1 - handoffY;
            const i1_duration = 4 * (i1_distance / orbitalVerticalVelocity);
            const i1_land = handoffScroll + i1_duration;

            const newY = transform(
                p,
                [handoffScroll, i1_land],
                [handoffY, FINAL_Y_1],
                { ease: quarticOut }
            );
            icon1_y.set(newY);

            const newOpacity = transform(p, [handoffScroll, i1_land], [0, 1], { ease: quarticOut });
            text1_opacity.set(newOpacity);
        }

        // --- Logic for Icon 2 (Green) ---
        // This icon breaks second
        const i2_orbitAngle = ICON_2_START_ANGLE + currentAngle;
        const i2_current_x = ORBIT_CENTER_X + Math.cos(i2_orbitAngle) * orbitRadius;
        const i2_current_y = ORBIT_CENTER_Y - Math.sin(i2_orbitAngle) * orbitRadius;

        if (i2_orbitAngle < ICON_2_BREAK_ANGLE) {
            // Phase 1: Orbit
            icon2_x.set(i2_current_x);
            icon2_y.set(i2_current_y);
            icon2Handoff.current = null;
        } else {
            // Phase 3: Slowdown
            if (!icon2Handoff.current) {
                // Find the scroll time for this specific break
                const i2_break_scroll = transform(ICON_2_BREAK_ANGLE - ICON_2_START_ANGLE, [0, MASTER_TRAVEL_DISTANCE], [0, MASTER_BREAK_TIME]);
                icon2Handoff.current = {
                    x: ORBIT_CENTER_X - orbitRadius, // Guaranteed X
                    y: ORBIT_CENTER_Y,                 // Guaranteed Y
                    scroll: i2_break_scroll,
                };
            }
            const { x: handoffX, y: handoffY, scroll: handoffScroll } =
                icon2Handoff.current;
            icon2_x.set(handoffX);

            const i2_distance = FINAL_Y_2 - handoffY;
            const i2_duration = 4 * (i2_distance / orbitalVerticalVelocity);
            const i2_land = handoffScroll + i2_duration;

            const newY = transform(
                p,
                [handoffScroll, i2_land],
                [handoffY, FINAL_Y_2],
                { ease: quarticOut }
            );
            icon2_y.set(newY);
            const newOpacity = transform(p, [handoffScroll, i2_land], [0, 1], { ease: quarticOut });
            text2_opacity.set(newOpacity);
        }

        // --- Logic for Icon 3 (Purple) ---
        // This icon breaks first
        const i3_orbitAngle = ICON_3_START_ANGLE + currentAngle;
        const i3_current_x = ORBIT_CENTER_X + Math.cos(i3_orbitAngle) * orbitRadius;
        const i3_current_y = ORBIT_CENTER_Y - Math.sin(i3_orbitAngle) * orbitRadius;

        if (i3_orbitAngle < ICON_3_BREAK_ANGLE) {
            // Phase 1: Orbit
            icon3_x.set(i3_current_x);
            icon3_y.set(i3_current_y);
            icon3Handoff.current = null;
        } else {
            // Phase 3: Slowdown
            if (!icon3Handoff.current) {
                // Find the scroll time for this specific break
                const i3_break_scroll = transform(ICON_3_BREAK_ANGLE - ICON_3_START_ANGLE, [0, MASTER_TRAVEL_DISTANCE], [0, MASTER_BREAK_TIME]);
                icon3Handoff.current = {
                    x: ORBIT_CENTER_X - orbitRadius, // Guaranteed X
                    y: ORBIT_CENTER_Y,                 // Guaranteed Y
                    scroll: i3_break_scroll,
                };
            }
            const { x: handoffX, y: handoffY, scroll: handoffScroll } =
                icon3Handoff.current;
            icon3_x.set(handoffX);

            const i3_distance = FINAL_Y_3 - handoffY;
            const i3_duration = 4 * (i3_distance / orbitalVerticalVelocity);
            const i3_land = handoffScroll + i3_duration;

            const newY = transform(
                p,
                [handoffScroll, i3_land],
                [handoffY, FINAL_Y_3],
                { ease: quarticOut }
            );
            icon3_y.set(newY);

            const newOpacity = transform(p, [handoffScroll, i3_land], [0, 1], { ease: quarticOut });
            text3_opacity.set(newOpacity);
        }

        // --- Logic for Main Title ---
        // Find the *first* break time (which is Icon 3's)
        const i3_break_scroll = transform(ICON_3_BREAK_ANGLE - ICON_3_START_ANGLE, [0, MASTER_TRAVEL_DISTANCE], [0, MASTER_BREAK_TIME]);

        if (p < i3_break_scroll) {
            title_opacity.set(0);
        } else {
            // Fades in when the *first* icon (Icon 3) *begins* its drop
            const { scroll: handoffScroll } = icon3Handoff.current || { scroll: i3_break_scroll };
            const i3_distance = FINAL_Y_3 - (ORBIT_CENTER_Y); // Handoff Y is center
            const i3_duration = 4 * (i3_distance / orbitalVerticalVelocity);
            const i3_land = handoffScroll + i3_duration;

            const titleOp = transform(p, [handoffScroll, i3_land], [0, 1], { ease: quarticOut });
            title_opacity.set(titleOp);
        }
    });

    // --- 11. The "Scaffolding" (JSX) ---
    return (
        <div
            ref={containerRef}
            style={{
                height: `${trackVh}vh`, // Scrollable area
                position: "relative",
            }}
        >
            {/* Debug overlay (fixed, top-left) */}
            <div
                style={{
                    position: "fixed",
                    top: 8,
                    left: 8,
                    zIndex: 1000,
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: 8,
                    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
                    fontSize: 12,
                    lineHeight: 1.2,
                    pointerEvents: "none",
                }}
            >
                <div>Page: {pageScrollPct.toFixed(2)}%</div>
                <div>Orbit: {orbitPct.toFixed(2)}%</div>
            </div>

            {/* Pre-roll spacer before pin */}
            <div style={{ height: `${preRollVh}vh` }} />

            {/* Placeholder occupies layout while the stage is fixed */}
            {isPinned && (
                <div style={{ height: `calc(100vh - ${topOffset}px)` }} />
            )}

            {/* Stage: switches to fixed while pinned for guaranteed pinning */}
            <motion.div
                style={{
                    position: isPinned ? "fixed" : "relative",
                    top: isPinned ? topOffset + pinNudgePx : undefined,
                    left: isPinned ? 0 : undefined,
                    right: isPinned ? 0 : undefined,
                    height: `calc(100vh - ${topOffset}px)`,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background: "transparent",
                    zIndex: isPinned ? 20 : undefined,
                }}
            >
                {/* --- SLIDER CONTROLS --- */}
                {showControls && (
                    <div
                        style={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                            background: "rgba(255, 255, 255, 0.1)",
                            borderRadius: 8,
                            padding: "16px",
                            zIndex: 10,
                            color: "white",
                            fontFamily: "sans-serif",
                            fontSize: "14px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            width: "250px",
                        }}
                    >
                        {/* --- Slider 1: Icon Spacing --- */}
                        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            Final Icon Spacing: {iconSpacing.toFixed(0)}px
                            <input
                                type="range"
                                min="50"
                                max="200"
                                value={iconSpacing}
                                onChange={(e) => setIconSpacing(Number(e.target.value))}
                                style={{ width: "100%" }}
                            />
                        </label>

                        {/* --- Slider 2: Orbit Radius --- */}
                        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            Orbit Radius: {orbitRadius.toFixed(0)}px
                            <input
                                type="range"
                                min="100"
                                max="300"
                                value={orbitRadius}
                                onChange={(e) => setOrbitRadius(Number(e.target.value))}
                                style={{ width: "100%" }}
                            />
                        </label>
                    </div>
                )}

                {/* 800x800 "stage" for the animation */}
                <div style={{ position: "relative", width: 800, height: 800 }}>
                    {/* Main Title */}
                    <motion.h1
                        style={{
                            position: "absolute",
                            top: "10%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "white",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "48px",
                            opacity: title_opacity,
                            textAlign: "center",
                        }}
                    >
                        Your Title Here
                    </motion.h1>

                    {/* --- Icon 1 (Community) --- */}
                    <motion.img
                        src={CommunityIcon}
                        alt="Community"
                        style={{
                            position: "absolute",
                            width: 50,
                            height: 50,
                            x: icon1_x,
                            y: icon1_y,
                            top: 0,
                            left: 0,
                            objectFit: "contain",
                        }}
                    />
                    <motion.div
                        style={{
                            position: "absolute",
                            width: 200,
                            color: "white",
                            fontSize: "16px",
                            fontFamily: "Inter, sans-serif",
                            top: FINAL_Y_1 + 80, // Moved down by additional 20px
                            left: (ORBIT_CENTER_X - orbitRadius) + 60, // Handoff X + icon width + padding
                            opacity: text1_opacity,
                        }}
                    >
                        <b>Feature One</b>
                        <p>Your description for the first feature appears here.</p>
                    </motion.div>

                    {/* --- Icon 2 (Individual) --- */}
                    <motion.img
                        src={IndividualIcon}
                        alt="Individual"
                        style={{
                            position: "absolute",
                            width: 50,
                            height: 50,
                            x: icon2_x,
                            y: icon2_y,
                            top: 0,
                            left: 0,
                            objectFit: "contain",
                        }}
                    />
                    <motion.div
                        style={{
                            position: "absolute",
                            width: 200,
                            color: "white",
                            fontSize: "16px",
                            fontFamily: "Inter, sans-serif",
                            top: FINAL_Y_2 + 10, // Uses dynamic state + spacing
                            left: (ORBIT_CENTER_X - orbitRadius) + 60, // Handoff X + icon width + padding
                            opacity: text2_opacity,
                        }}
                    >
                        <b>Feature Two</b>
                        <p>The second feature's text lines up right here.</p>
                    </motion.div>

                    {/* --- Icon 3 (Land) --- */}
                    <motion.img
                        src={LandIcon}
                        alt="Land"
                        style={{
                            position: "absolute",
                            width: 50,
                            height: 50,
                            x: icon3_x,
                            y: icon3_y,
                            top: 0,
                            left: 0,
                            objectFit: "contain",
                        }}
                    />
                    <motion.div
                        style={{
                            position: "absolute",
                            width: 200,
                            color: "white",
                            fontSize: "16px",
                            fontFamily: "Inter, sans-serif",
                            top: FINAL_Y_3 + 10, // Uses dynamic state + spacing
                            left: (ORBIT_CENTER_X - orbitRadius) + 60, // Handoff X + icon width + padding
                            opacity: text3_opacity,
                        }}
                    >
                        <b>Feature Three</b>
                        <p>And finally, the third feature is described here.</p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Post-roll spacer (controls how long pinned window lasts) */}
            <div style={{ height: `${postRollVh}vh` }} />

            {/* Pre-roll spacer after pin (not required since track height already provides scroll) */}
        </div>
    );
}