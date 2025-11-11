import React, { useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { bakedPlan } from "./bakedPlan";

// Minimal helpers for playback only
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const invLerp = (a: number, b: number, v: number) => (v - a) / Math.max(1e-9, b - a);
const invLerpAny = (a: number, b: number, v: number) => {
    let den = b - a;
    if (Math.abs(den) < 1e-9) den = den >= 0 ? 1e-9 : -1e-9;
    return (v - a) / den;
};
const smoothstep = (t: number) => {
    t = clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
};
const easeOutQuart = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 4);

// DOM y-down orbit point
const orbitPoint = (cx: number, cy: number, r: number, theta: number) => ({
    x: cx + r * Math.cos(theta),
    y: cy - r * Math.sin(theta),
});

// Linear-phase easing (match capture feel)
const lineEaseMatchedC2K = (t: number, k: number) => {
    t = clamp(t, 0, 1);
    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t3 * t;
    const t5 = t4 * t;
    const a = 6 - 3 * k;
    const b = 7 * k - 15;
    const c = 10 - 4 * k;
    return a * t5 + b * t4 + c * t3;
};

// Hardcoded playback constants (no UI state)
const STAGE_W = 800;
const STAGE_H = 800;
const ORBIT_CENTER_X = bakedPlan.orbitCenterX;
const ORBIT_CENTER_Y = bakedPlan.orbitCenterY;
const ORBIT_RADIUS = bakedPlan.orbitRadius;

// Scroll gating and camera defaults (fast, production-ready)
const GATE_START = 0.16;   // when scroll begins to drive the animation
const CENTER_AT_GATE_Y = 550; // orbit center alignment at gate
const FREEZE_START_Y = 550;   // pin target for bottom icon during linear
const LINE_SLOWDOWN_K = 2.0;  // matches capture feel
const HEADER_OFFSET_PX = 0;   // adjust if header should offset the pin
const FINISH_FREEZE_SHIFT_PX = 200; // purple icon ends 200px lower than at freeze start
const CAMERA_RISE_FACTOR = 0; // reduce upward camera travel before pickup (0=no rise, 1=full)

// Assets
const INDIVIDUAL_IMG = new URL("./icons/background/Individual_Background.png", import.meta.url).href;
const COMMUNITY_IMG = new URL("./icons/background/Community_Background.png", import.meta.url).href;
const LAND_IMG = new URL("./icons/background/Land_Background.png", import.meta.url).href;

// Baked world-position sampler
function worldPosAt(icon: any, t: number) {
    const { start, tangent, delta, s, t1, t2, xFinal, yFinal } = icon;

    if (t < s) return { x: start.x, y: start.y };

    if (t < t1) {
        const a = lineEaseMatchedC2K((t - s) / Math.max(1e-6, t1 - s), LINE_SLOWDOWN_K);
        return { x: lerp(start.x, tangent.x, a), y: lerp(start.y, tangent.y, a) };
    }

    if (t < t2) {
        const alpha = (t - t1) / Math.max(1e-6, t2 - t1);
        const theta = tangent.phi + delta * alpha;
        return orbitPoint(ORBIT_CENTER_X, ORBIT_CENTER_Y, ORBIT_RADIUS, theta);
    }

    return { x: xFinal, y: yFinal };
}

export default function ScrollOrbitBaked() {
    const containerRef = useRef(null);
    const pageVRef = useRef(0);
    const sectionVRef = useRef(0);
    const localGateStartRef = useRef(null);
    const gateActiveRef = useRef(false);

    // Debug state: page scroll % and orbit progress %
    const [pageScrollPct, setPageScrollPct] = useState(0);
    const [orbitPct, setOrbitPct] = useState(0);
    const [isFixed, setIsFixed] = useState(false);

    // Motion values (3 icons + title + camera)
    const icon1_x = useMotionValue(0);
    const icon1_y = useMotionValue(0);
    const icon2_x = useMotionValue(0);
    const icon2_y = useMotionValue(0);
    const icon3_x = useMotionValue(0);
    const icon3_y = useMotionValue(0);
    const title_opacity = useMotionValue(0);
    const stage_y = useMotionValue(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Global page scroll (0..1 over entire page)
    const { scrollYProgress: pageScrollYProgress } = useScroll();
    useMotionValueEvent(pageScrollYProgress, "change", (v) => {
        pageVRef.current = v;
        setPageScrollPct(Number((v * 100).toFixed(2)));
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        sectionVRef.current = latest;

        // Determine hard-pin window: only while the section is in view and after gate
        const inSection = latest > 0 && latest < 1;
        const afterGate = pageVRef.current >= GATE_START;
        const gateActive = inSection && afterGate;
        gateActiveRef.current = gateActive;
        setIsFixed(gateActive);

        // Capture the section-local progress where the gate starts,
        // so that orbit reaches 100% exactly when the section ends.
        if (gateActive && localGateStartRef.current === null) {
            localGateStartRef.current = latest;
        }

        // Drive animation from SECTION progress once gate has started.
        // Map section progress linearly from gate-start to section end (1.0) → 0..1.
        let tPlan = 0;
        const localStart = localGateStartRef.current;
        if (localStart !== null) {
            if (latest <= localStart) {
                tPlan = 0;
            } else {
                tPlan = clamp(invLerp(localStart, 1.0, latest), 0, 1);
            }
        }
        const tPlay = 1 - tPlan;

        // Update orbit % (0..100) to 2 decimals
        setOrbitPct(Number((tPlan * 100).toFixed(2)));

        // Pre-align camera before start: place orbit center at CENTER_AT_GATE_Y
        const stageAtGate = CENTER_AT_GATE_Y - ORBIT_CENTER_Y;

        // Drive baked icons (guard if JSON not yet pasted)
        const icons = Array.isArray(bakedPlan?.icons) ? bakedPlan.icons : [];
        if (icons.length < 3) {
            // Keep stage aligned so page doesn’t jump while waiting for JSON
            stage_y.set(stageAtGate);
            return;
        }
        const drive = (idx: number, setXY: (x: number, y: number) => void) => {
            const info = icons[idx];
            const p = worldPosAt(info, tPlay);
            setXY(p.x, p.y);
        };

        if (tPlan <= 0) {
            stage_y.set(stageAtGate);
            title_opacity.set(0);
            return;
        }

        drive(0, (x, y) => { icon1_x.set(x); icon1_y.set(y); });
        drive(1, (x, y) => { icon2_x.set(x); icon2_y.set(y); });
        drive(2, (x, y) => { icon3_x.set(x); icon3_y.set(y); });

        // Camera: pin bottom icon (index 2) with snap-free pickup
        const bottom = icons[2];
        const pNow = worldPosAt(bottom, tPlay);
        const pAtHandoff = worldPosAt(bottom, bottom.t1);

        const stageAlignAtT1 = FREEZE_START_Y - pAtHandoff.y;
        const uBase = clamp(invLerpAny(bottom.t2, bottom.t1, tPlay), 0, 1); // reverse on-orbit window
        const stageBase = lerp(stageAtGate, stageAlignAtT1, smoothstep(uBase));

        let stageY: number;
        if (tPlay >= bottom.t1) {
            // Before pickup (pre-linear): reduce how far the camera rises
            stageY = lerp(stageAtGate, stageBase, CAMERA_RISE_FACTOR);
        } else if (tPlay > bottom.s) {
            // During linear, gradually shift the freeze line so the purple icon
            // ends 200px lower at the end of the freeze compared to its start.
            const linU = clamp(invLerpAny(bottom.t1, bottom.s, tPlay), 0, 1);
            const freezeY = FREEZE_START_Y + FINISH_FREEZE_SHIFT_PX * linU;
            stageY = freezeY - pNow.y;
        } else {
            // After landing (post-linear), keep the final shifted freeze alignment
            stageY = (FREEZE_START_Y + FINISH_FREEZE_SHIFT_PX) - bottom.start.y;
        }

        stage_y.set(stageY);

        // Title fade near the end of the forward plan-time
        const fade = easeOutQuart(clamp((tPlan - 0.85) / 0.15, 0, 1));
        title_opacity.set(fade);
    });

    return (
        <div
            ref={containerRef}
            style={{
                height: "500vh",
                position: "relative",
                fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                margin: 0,
                padding: 0,
                width: "100%",
            }}
        >
            {/* Placeholder preserves layout when stage is fixed */}
            <div style={{ height: isFixed ? "100vh" : 0 }} />
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
            <div
                style={{
                    position: isFixed ? "fixed" : "relative",
                    top: isFixed ? HEADER_OFFSET_PX : undefined,
                    left: isFixed ? 0 : undefined,
                    right: isFixed ? 0 : undefined,
                    zIndex: isFixed ? 20 : 1,
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background: "transparent",
                }}
            >
                {/* Stage (no controls in production) */}
                <motion.div style={{ position: "relative", width: STAGE_W, height: STAGE_H, y: stage_y }}>
                    <motion.h1
                        style={{
                            position: "absolute",
                            top: "10%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "white",
                            fontSize: 48,
                            opacity: title_opacity,
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        Features
                    </motion.h1>

                    {/* Icon 1 (replaced with Individual background image) */}
                    <motion.img
                        src={INDIVIDUAL_IMG}
                        alt="Individual"
                        style={{
                            position: "absolute",
                            width: 100,
                            height: 100,
                            x: icon1_x,
                            y: icon1_y,
                            top: 0,
                            left: 0,
                            marginLeft: -50,
                            marginTop: -50,
                            objectFit: "contain",
                            borderRadius: 21,
                            pointerEvents: "none",
                        }}
                    />
                    {/* Icon 2 (replaced with Community background image) */}
                    <motion.img
                        src={COMMUNITY_IMG}
                        alt="Community"
                        style={{
                            position: "absolute",
                            width: 100,
                            height: 100,
                            x: icon2_x,
                            y: icon2_y,
                            top: 0,
                            left: 0,
                            marginLeft: -50,
                            marginTop: -50,
                            objectFit: "contain",
                            borderRadius: 21,
                            pointerEvents: "none",
                        }}
                    />
                    {/* Icon 3 (replaced with Land background image) */}
                    <motion.img
                        src={LAND_IMG}
                        alt="Land"
                        style={{
                            position: "absolute",
                            width: 100,
                            height: 100,
                            x: icon3_x,
                            y: icon3_y,
                            top: 0,
                            left: 0,
                            marginLeft: -50,
                            marginTop: -50,
                            objectFit: "contain",
                            borderRadius: 21,
                            pointerEvents: "none",
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
}