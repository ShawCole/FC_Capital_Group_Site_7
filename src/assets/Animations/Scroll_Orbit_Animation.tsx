import React, { useMemo, useRef, useState, useEffect } from "react";
import {
    motion,
    useScroll,
    useMotionValue,
    useMotionValueEvent,
} from "framer-motion";

// ===================== Geometry helpers =====================
const twoPi = Math.PI * 2;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutQuart = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 4);
// C2-joined quintic with end-slope k (k>=1 -> stronger slow at the start)
// Wk(0)=0, Wk'(0)=0, Wk''(0)=0, Wk(1)=1, Wk'(1)=k, Wk''(1)=0
const easeMatchedC2K = (t, k) => {
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

// Blend/gating helpers (pure)
const invLerp = (a, b, v) => (v - a) / Math.max(1e-9, b - a);
const smoothstep = (t) => {
    t = clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
};
// New: signed inverse lerp that supports a>b ranges
const invLerpAny = (a, b, v) => {
    let den = b - a;
    if (Math.abs(den) < 1e-9) den = den >= 0 ? 1e-9 : -1e-9;
    return (v - a) / den;
};

// NEW: Constants and angDiff helper
const EPS = 1e-6;
const EPS_DEN = 1e-5;

function angDiff(a, b) {
    // Wrap difference to (-π, π]
    return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

// DOM coordinates use y-down, so y = cy - r * sin(theta)
function orbitPoint(cx, cy, r, theta) {
    return {
        x: cx + r * Math.cos(theta),
        y: cy - r * Math.sin(theta),
    };
}

// Signed angular delta in a given direction (dir = +1 CCW, -1 CW)
function dTheta(dir, from, to) {
    const mod = (a) => ((a % twoPi) + twoPi) % twoPi;
    const a = mod(from);
    const b = mod(to);
    if (dir === 1) {
        return ((b - a) % twoPi + twoPi) % twoPi; // CCW shortest positive
    }
    return -(((a - b) % twoPi + twoPi) % twoPi); // CW negative
}

// REPLACED: Robust tangent solver
/**
 * @typedef {object} TangentResult
 * @property {number} tx - Tangent point x
 * @property {number} ty - Tangent point y
 * @property {number} phi - Orbit param at tangent point
 * @property {boolean} hasRealTangent - True if d >= r
 * @property {number} dLine - Linear distance to tangent point
 */

/**
 * Tangent point from P(sx, sy) to circle (cx, cy, r), honoring orbit direction (dir = +1 CCW, -1 CW).
 * @returns {TangentResult}
 */
function tangentFromPointToCircle(
    sx,
    sy,
    cx,
    cy,
    r,
    dir // 1=CCW, -1=CW
) {
    const dx = sx - cx;
    const dy = sy - cy;
    const d = Math.hypot(dx, dy);
    // y-down circle param angle at (x, y): phi = atan2(cy - y, x - cx)
    const phiRadial = Math.atan2(cy - sy, sx - cx);

    // On-circle (or numerically on)
    if (Math.abs(d - r) <= EPS) {
        return {
            tx: sx,
            ty: sy,
            phi: phiRadial,
            hasRealTangent: true,
            dLine: 0,
        };
    }

    // Inside-circle: snap to nearest circle point, treat as immediate on-orbit entry
    if (d < r - EPS) {
        const tx = cx + r * Math.cos(phiRadial);
        const ty = cy - r * Math.sin(phiRadial);
        return {
            tx,
            ty,
            phi: phiRadial,
            hasRealTangent: true,
            dLine: 0,
        };
    }

    // Outside-circle (existing logic remains, but no 'pickUpward'):
    // compute both tangents, pick the one
    // whose unit tangent vector at T aligns with 'dir'.

    // Angle from center to start (DOM y-down)
    const beta = Math.atan2(cy - sy, sx - cx); // Need beta for outside case
    // Two candidate tangent angles
    const alpha = Math.acos(r / d);
    const phiA = beta - alpha;
    const phiB = beta + alpha;

    const tA = { x: cx + r * Math.cos(phiA), y: cy - r * Math.sin(phiA), phi: phiA };
    const tB = { x: cx + r * Math.cos(phiB), y: cy - r * Math.sin(phiB), phi: phiB };

    const upA = tA.y < sy; // Retain for potential future use, but don't filter on it
    const upB = tB.y < sy;

    // Direction alignment at the tangent:
    // - CCW tangent (DIR=+1): (-sin φ, -cos φ)
    // - CW  tangent (DIR=-1): ( sin φ,  cos φ)
    function dirAligned(phi) {
        const tvx = dir === 1 ? -Math.sin(phi) : Math.sin(phi);
        const tvy = dir === 1 ? -Math.cos(phi) : Math.cos(phi);

        const tx = cx + r * Math.cos(phi);
        const ty = cy - r * Math.sin(phi);

        // IMPORTANT: vector from start to tangent (approach direction), not tangent to start
        const ax = tx - sx;
        const ay = ty - sy;

        const dot = tvx * ax + tvy * ay;
        return dot > 0;
    }

    // Prefer direction-aligned candidates
    let candidates = [
        { ...tA, upward: upA, ok: dirAligned(tA.phi) },
        { ...tB, upward: upB, ok: dirAligned(tB.phi) },
    ].filter((c) => c.ok);

    // REMOVED: 'pickUpward' filter logic

    // Fallback if no aligned candidate survives
    if (!candidates.length) {
        candidates = [
            { ...tA, upward: upA },
            { ...tB, upward: upB },
        ];
        // REMOVED: 'pickUpward' filter from fallback
    }

    // Finally, pick the closest by straight-line distance
    candidates.sort(
        (a, b) => Math.hypot(sx - a.x, sy - a.y) - Math.hypot(sx - b.x, sy - b.y)
    );

    const best = candidates[0];
    return {
        tx: best.x,
        ty: best.y,
        phi: best.phi,
        hasRealTangent: true, // d > r
        dLine: Math.hypot(sx - best.x, sy - best.y), // Return dLine
    };
}

/**
 * REPLACED: Resilient computeEqualSpacingOmega
 */
function computeEqualSpacingOmega({
    dir,
    R,
    phi,
    thetaFinal,
    dLine,
    s,
    prevW,
}) {
    const sgn = dir === 1 ? 1 : -1;
    const Δ = (2 * Math.PI) / 3;
    const pairs = [
        [0, 1],
        [0, 2],
        [1, 2],
    ];
    const ws = [];

    for (const [i, j] of pairs) {
        const A = s[j] - s[i];
        if (Math.abs(A) < EPS_DEN) continue; // near-singular; skip

        const Bij = (dLine[j] - dLine[i]) / Math.max(R, EPS);
        const num = (j - i) * Δ - angDiff(phi[i], phi[j]) - sgn * Bij; // Use angDiff
        const den = sgn * A;
        const w = num / den;

        if (Number.isFinite(w) && w > 1e-6) ws.push(w);
    }

    if (!ws.length)
        return prevW && isFinite(prevW) && prevW > 1e-6 ? prevW : null;
    ws.sort((a, b) => a - b);
    return ws[Math.floor(ws.length / 2)]; // median
}

/**
 * Compute start offsets s[i] so that all icons land simultaneously at t=1.
 * s_i = 1 - ( d_i/(R*w) + dth_i/w )
 * Then shift if needed so min(s) >= 0; normalization later will set latest t2=1.
 */
function computeSimultaneousLandingStarts({ R, w, dLine, dThetaAbs }) {
    const sRaw = dLine.map(
        (d, i) =>
            1 - (d / (R * Math.max(w, 1e-9)) + dThetaAbs[i] / Math.max(w, 1e-9))
    );
    const minS = Math.min(...sRaw);
    const shift = minS < 0 ? -minS : 0;
    return sRaw.map((si) => si + shift);
}

// NEW: world-space sampler
function worldPosAt(
    iconInfo,
    t,
    { ORBIT_CENTER_X, orbitCenterY, orbitRadius, linearEase } // pass easeMatchedC2K
) {
    const { start, tangent, delta, s, t1, t2, xFinal, yFinal } = iconInfo;

    if (t < s) return { x: start.x, y: start.y };

    if (t < t1) {
        const linearAlpha = (t - s) / Math.max(1e-6, t1 - s);
        const a = linearEase(linearAlpha);
        return { x: lerp(start.x, tangent.x, a), y: lerp(start.y, tangent.y, a) };
    }

    if (t < t2) {
        const alpha = (t - t1) / Math.max(1e-6, t2 - t1);
        const theta = tangent.phi + delta * alpha;
        return orbitPoint(ORBIT_CENTER_X, orbitCenterY, orbitRadius, theta);
    }

    return { x: xFinal, y: yFinal };
}

// ===================== Component =====================
const ORBIT_CENTER_X = 400;
// const ORBIT_CENTER_Y = 400; // Will be replaced by state
const MASTER_BREAK_TIME = 0.8; // all icons finish arc by this scroll progress
const START_POLY_ANGLE = Math.PI / 2; // top (12 o'clock)

export default function App() {
    const containerRef = useRef(null);

    // Controls
    const [orbitRadius, setOrbitRadius] = useState(240); // Default 240
    const [orbitCenterY, setOrbitCenterY] = useState(200); // Default 200
    const [iconSpacing, setIconSpacing] = useState(190); // Default 190
    const [startX, setStartX] = useState(160); // Default 160
    const [startY, setStartY] = useState(690); // Default 690
    // REMOVED: stagger state
    const [rotationDeg, setRotationDeg] = useState(0); // Default 0
    const [orbitDir, setOrbitDir] = useState(-1); // NEW: +1 for CCW, -1 for CW
    const [lineSlowdownK, setLineSlowdownK] = useState(2.0); // Default 2.0
    const [gateStart, setGateStart] = useState(0.15); // NEW: Scroll gate (start at 15% page)
    const [liftPx, setLiftPx] = useState(220); // NEW: Base lift
    const [freezeY, setFreezeY] = useState(680); // NEW: Follow pin Y
    const [followRamp, setFollowRamp] = useState(0.15); // Default 0.15
    // NEW: Camera/UX parameters
    const [centerAtGateY, setCenterAtGateY] = useState(500); // Default 500
    const [freezeStartY, setFreezeStartY] = useState(500); // Default 500
    const [freezeEndY, setFreezeEndY] = useState(680); // Default 680
    const [pagePct, setPagePct] = useState(0);
    const [orbitPct, setOrbitPct] = useState(0);

    // Scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });
    const { scrollYProgress: pageProgress } = useScroll();

    // Motion values (fixed 3 icons)
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
    const stage_y = useMotionValue(0); // NEW: Stage motion

    // Build the motion plan once per control change
    const plan = useMemo(() => {
        // Start points: lowest is icon 3, then 2, then 1
        const P3 = { x: startX, y: startY };
        const P2 = { x: startX, y: startY - iconSpacing };
        const P1 = { x: startX, y: startY - 2 * iconSpacing };

        // Tangents
        const t3 = tangentFromPointToCircle(
            P3.x,
            P3.y,
            ORBIT_CENTER_X,
            orbitCenterY,
            orbitRadius,
            orbitDir
        );
        const t2 = tangentFromPointToCircle(
            P2.x,
            P2.y,
            ORBIT_CENTER_X,
            orbitCenterY,
            orbitRadius,
            orbitDir
        );
        const t1 = tangentFromPointToCircle(
            P1.x,
            P1.y,
            ORBIT_CENTER_X,
            orbitCenterY,
            orbitRadius,
            orbitDir
        );

        // Linear distances (from tangent results)
        const d1 = t1.dLine;
        const d2 = t2.dLine;
        const d3 = t3.dLine;
        const dLine = [d1, d2, d3]; // Array for helpers
        const phi = [t1.phi, t2.phi, t3.phi]; // Array for helpers

        // NEW: Get k and create scaled linear distances for timing math
        const k = lineSlowdownK; // emphasis
        const dLineScaled = dLine.map((d) => d * k); // scale linear durations by k

        // Final angles
        const N = 3;
        const theta0 = START_POLY_ANGLE + (rotationDeg * Math.PI) / 180;
        const thetaFinal_3 = theta0;
        const thetaFinal_1 = theta0 + (twoPi / N) * 1;
        const thetaFinal_2 = theta0 + (twoPi / N) * 2;
        const thetaFinal = [thetaFinal_1, thetaFinal_2, thetaFinal_3]; // Array for helpers

        // Initial signed deltas
        const dSigned1 = dTheta(orbitDir, t1.phi, thetaFinal_1);
        const dSigned2 = dTheta(orbitDir, t2.phi, thetaFinal_2);
        const dSigned3 = dTheta(orbitDir, t3.phi, thetaFinal_3);

        // Direction-agnostic lap selection by smallest |delta|
        let deltas = [dSigned1, dSigned2, dSigned3];

        // Indices sorted by ascending |delta|
        const sortIdxByMag = (arr) =>
            [0, 1, 2].sort((i, j) => Math.abs(arr[i]) - Math.abs(arr[j]));

        // Add one full lap in the same orbit direction as this delta
        const addOneLapSameDir = (d) =>
            d + ((d > 0) ? 1 : d < 0 ? -1 : orbitDir === 1 ? 1 : -1) * twoPi;

        // Apply exactly one lap only in boundary ranges
        if (rotationDeg <= -49) {
            const [i0] = sortIdxByMag(deltas);
            deltas[i0] = addOneLapSameDir(deltas[i0]); // one icon
        } else if (rotationDeg >= 83) {
            const [i0, i1] = sortIdxByMag(deltas);
            deltas[i0] = addOneLapSameDir(deltas[i0]); // two icons
            deltas[i1] = addOneLapSameDir(deltas[i1]);
        }

        // REPLACED: Two-pass timing logic for simultaneous landing
        // Magnitudes for arc distances (after lap-lift)
        const dthAbs = [
            Math.abs(deltas[0]),
            Math.abs(deltas[1]),
            Math.abs(deltas[2]),
        ];

        // A) Try equal-spacing w with a neutral stagger (start offsets will be set next)
        let w = computeEqualSpacingOmega({
            dir: orbitDir,
            R: orbitRadius,
            phi: phi,
            thetaFinal: thetaFinal,
            dLine: dLineScaled, // CHANGED
            s: [0, 0, 0], // temporary
        });

        // If unsolvable, seed w by ensuring latest finisher would end at t=1 with zero stagger
        if (!(w && isFinite(w) && w > 1e-6)) {
            const need1 = (dLineScaled[0] / orbitRadius + dthAbs[0]) / 1; // CHANGED
            const need2 = (dLineScaled[1] / orbitRadius + dthAbs[1]) / 1; // CHANGED
            const need3 = (dLineScaled[2] / orbitRadius + dthAbs[2]) / 1; // CHANGED
            w = Math.max(need1, need2, need3);
        }
        // const v = orbitRadius * w; // v is computed later

        // B) Compute start offsets so all land at the same time (t ≈ 1 before normalization)
        let sArr = computeSimultaneousLandingStarts({
            R: orbitRadius,
            w,
            dLine: dLineScaled, // CHANGED
            dThetaAbs: dthAbs,
        });

        // C) Recompute equal-spacing w with these simultaneous-landing starts
        let w2 = computeEqualSpacingOmega({
            dir: orbitDir,
            R: orbitRadius,
            phi,
            thetaFinal,
            dLine: dLineScaled, // CHANGED
            s: sArr,
            prevW: w,
        });
        if (w2 && isFinite(w2) && w2 > 1e-6) {
            w = w2;
        }

        // D) Recompute starts with final w to restore exact simultaneity
        sArr = computeSimultaneousLandingStarts({
            R: orbitRadius,
            w,
            dLine: dLineScaled, // CHANGED
            dThetaAbs: dthAbs,
        });

        // E) (Optional) One more equal-spacing pass
        const w3 = computeEqualSpacingOmega({
            dir: orbitDir,
            R: orbitRadius,
            phi,
            thetaFinal,
            dLine: dLineScaled, // CHANGED
            s: sArr,
            prevW: w,
        });
        if (w3 && isFinite(w3) && w3 > 1e-6) {
            w = w3;
        }

        // F) Proceed to compute velocities/timings with this final (w, sArr) pair and normalize
        // Recompute v in case w changed
        const vFinal = orbitRadius * w;

        // Entry (linear) durations with speed match v = R*w
        // Linear duration must be T_lin = d * k / vFinal to preserve speed match at handoff
        const tlin = [
            (d1 * k) / Math.max(vFinal, 1e-9), // CHANGED
            (d2 * k) / Math.max(vFinal, 1e-9), // CHANGED
            (d3 * k) / Math.max(vFinal, 1e-9), // CHANGED
        ];

        // Orbit durations with shared w
        const tarc = [
            dthAbs[0] / Math.max(w, 1e-9),
            dthAbs[1] / Math.max(w, 1e-9),
            dthAbs[2] / Math.max(w, 1e-9),
        ];

        // Absolute times (pre-normalization)
        let t1Abs = [
            sArr[0] + tlin[0],
            sArr[1] + tlin[1],
            sArr[2] + tlin[2],
        ];
        let t2Abs = [
            t1Abs[0] + tarc[0],
            t1Abs[1] + tarc[1],
            t1Abs[2] + tarc[2],
        ];

        // Normalize to fill 0..1; since we forced simultaneous landing, all t2Abs are equal => 1 after normalization
        const lastEndAbs = Math.max(t2Abs[0], t2Abs[1], t2Abs[2]);
        const invLE = 1 / Math.max(lastEndAbs, 1e-9);
        const sN = sArr.map((s) => s * invLE);
        const t1N = t1Abs.map((t) => t * invLE);
        const t2N = t2Abs.map((t) => t * invLE);

        return {
            w, // equal-spacing angular speed (post-adjust)
            v: vFinal,
            lastEnd: 1, // timeline normalized to 0..1
            icons: [
                {
                    name: "icon1",
                    start: P1,
                    tangent: { x: t1.tx, y: t1.ty, phi: t1.phi },
                    delta: deltas[0],
                    s: sN[0],
                    t1: t1N[0],
                    t2: t2N[0],
                    xFinal: orbitPoint(
                        ORBIT_CENTER_X,
                        orbitCenterY,
                        orbitRadius,
                        thetaFinal_1
                    ).x,
                    yFinal: orbitPoint(
                        ORBIT_CENTER_X,
                        orbitCenterY,
                        orbitRadius,
                        thetaFinal_1
                    ).y,
                },
                {
                    name: "icon2",
                    start: P2,
                    tangent: { x: t2.tx, y: t2.ty, phi: t2.phi },
                    delta: deltas[1],
                    s: sN[1],
                    t1: t1N[1],
                    t2: t2N[1],
                    xFinal: orbitPoint(
                        ORBIT_CENTER_X,
                        orbitCenterY,
                        orbitRadius,
                        thetaFinal_2
                    ).x,
                    yFinal: orbitPoint(
                        ORBIT_CENTER_X,
                        orbitCenterY,
                        orbitRadius,
                        thetaFinal_2
                    ).y,
                },
                {
                    name: "icon3",
                    start: P3,
                    tangent: { x: t3.tx, y: t3.ty, phi: t3.phi },
                    delta: deltas[2],
                    s: sN[2],
                    t1: t1N[2],
                    t2: t2N[2],
                    xFinal: orbitPoint(
                        ORBIT_CENTER_X,
                        orbitCenterY,
                        orbitRadius,
                        thetaFinal_3
                    ).x,
                    yFinal: orbitPoint(
                        ORBIT_CENTER_X,
                        orbitCenterY,
                        orbitRadius,
                        thetaFinal_3
                    ).y,
                },
            ],
        };
    }, [
        orbitRadius,
        iconSpacing,
        startX,
        startY,
        // stagger, // REMOVED
        rotationDeg,
        orbitDir,
        orbitCenterY,
        lineSlowdownK, // NEW Dependency
        // ADDED new dependencies for camera
        centerAtGateY,
        freezeStartY,
        freezeEndY,
        followRamp,
        liftPx,
        gateStart,
    ]);

    // Emit a single JSON log for baking (copy this payload into bakedPlan.ts)
    useEffect(() => {
        try {
            const onceKey = "__SCROLL_ORBIT_BAKED_JSON_LOGGED__";
            const w = (window as any);
            if (w && !w[onceKey]) {
                const payload = {
                    ...plan,
                    orbitCenterX: ORBIT_CENTER_X,
                    orbitCenterY,
                    orbitRadius,
                };
                // Clear, single-line JSON for easy copy
                console.log("BAKED_PLAN_JSON:", JSON.stringify(payload));
                w[onceKey] = true;
            }
        } catch {
            // no-op
        }
        // Only re-log if the plan's core parameters change
    }, [plan, orbitCenterY, orbitRadius]);

    // High‑resolution page percent
    useMotionValueEvent(pageProgress, "change", (v) => {
        setPagePct(Number((v * 100).toFixed(2)));
    });

    // Drive the animation from scroll
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // REPLACED: Time calculations
        const raw = clamp(latest, 0, 1);

        // Gate: map [gateStart..1] → [0..1] in forward plan-time
        const tPlan = clamp(invLerp(gateStart, 1.0, raw), 0, 1);
        setOrbitPct(Number((tPlan * 100).toFixed(2)));

        // Reversed playback for motion/camera (orbit→tangent→linear→start)
        const tPlay = 1 - tPlan;

        // Linear easing used in worldPosAt for the linear segment
        const linearEase = (u) => easeMatchedC2K(u, lineSlowdownK);

        // 0) Pre-align stage before the animation starts (tPlan == 0)
        // Place the orbit center at a desired on-screen Y (centerAtGateY) with no time advancement.
        const stageAtGate = centerAtGateY - orbitCenterY;

        // Drive icons (reversed time)
        const drive = (iconIdx, setXY, setText) => {
            // Added setText back
            const info = plan.icons[iconIdx];
            const p = worldPosAt(info, tPlay, {
                ORBIT_CENTER_X,
                orbitCenterY,
                orbitRadius,
                linearEase,
            });
            setXY(p.x, p.y);

            // NEW Fade Logic: Fade in during the linear leg [t1..s]
            if (tPlay >= info.t1) {
                // On orbit or before
                setText(0);
            } else if (tPlay < info.t1 && tPlay > info.s) {
                // On linear path
                // Fade should start when linear motion starts (tPlay = info.t1)
                const linearFadeProgress = clamp(invLerpAny(info.t1, info.s, tPlay), 0, 1);
                setText(smoothstep(linearFadeProgress));
            } else {
                // Landed at start
                setText(1);
            }
        };

        drive(
            0,
            (x, y) => {
                icon1_x.set(x);
                icon1_y.set(y);
            },
            (op) => text1_opacity.set(op)
        );
        drive(
            1,
            (x, y) => {
                icon2_x.set(x);
                icon2_y.set(y);
            },
            (op) => text2_opacity.set(op)
        );
        drive(
            2,
            (x, y) => {
                icon3_x.set(x);
                icon3_y.set(y);
            },
            (op) => text3_opacity.set(op)
        );

        // Camera targeting
        const bottom = plan.icons[2];

        // If we haven't started the gated animation yet, just hold the pre-aligned view and bail.
        if (tPlan <= 0) {
            stage_y.set(stageAtGate);
            // Optional: keep title/text off here if desired
            title_opacity.set(0);
            text1_opacity.set(0);
            text2_opacity.set(0);
            text3_opacity.set(0);
            return;
        }

        // World positions at "now" and at the handoff (reverse-time t1)
        const pNow = worldPosAt(bottom, tPlay, {
            ORBIT_CENTER_X,
            orbitCenterY,
            orbitRadius,
            linearEase,
        });
        const pAtHandoff = worldPosAt(bottom, bottom.t1, {
            ORBIT_CENTER_X,
            orbitCenterY,
            orbitRadius,
            linearEase,
        });

        // Stage offset that would pin purple at handoff (snap-free pickup alignment)
        const stageAlignAtT1 = freezeStartY - pAtHandoff.y;

        // 1) On-orbit pre-follow: blend from the gate alignment to the handoff alignment
        // Reverse on-orbit window is tPlay ∈ [bottom.t2(=1) .. bottom.t1]
        const uBase = clamp(invLerpAny(bottom.t2, bottom.t1, tPlay), 0, 1); // 0 at t2(=1), 1 at t1
        const stageBase = lerp(stageAtGate, stageAlignAtT1, smoothstep(uBase));

        // 2) Pinned linear window: move the pin target from freezeStartY -> freezeEndY
        // Reverse linear window is tPlay ∈ (bottom.t1 .. bottom.s]
        const uPin = clamp(invLerpAny(bottom.t1, bottom.s, tPlay), 0, 1); // 0 at t1, 1 at s
        const freezeTargetY = lerp(freezeStartY, freezeEndY, uPin);
        const stageFollow = freezeTargetY - pNow.y;

        // Select which camera mode we're in
        let stageY;
        if (tPlay >= bottom.t1) {
            // Still on-orbit (pre-follow)
            stageY = stageBase;
        } else if (tPlay > bottom.s) {
            // In the pinned linear window
            stageY = stageFollow;
        } else {
            // After reverse-time landing: freeze camera at end pin position
            stageY = freezeEndY - bottom.start.y;
        }

        stage_y.set(stageY);

        // UI fade (example: forward fade near plan end)
        // ONLY for title now
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
                    fontSize: 12,
                    lineHeight: 1.2,
                    pointerEvents: "none",
                    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                }}
            >
                <div>Page: {pagePct.toFixed(2)}%</div>
                <div>Orbit: {orbitPct.toFixed(2)}%</div>
            </div>
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background: "transparent",
                }}
            >
                {/* Controls */}
                <div
                    style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        padding: 16,
                        color: "white",
                        width: 280,
                        // hidden in production
                        display: "none",
                        flexDirection: "column",
                        gap: 12,
                        fontSize: 14,
                        zIndex: 100,
                    }}
                >
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Orbit Radius: {orbitRadius.toFixed(0)}px
                        <input
                            type="range"
                            min={100}
                            max={300}
                            value={orbitRadius}
                            onChange={(e) => setOrbitRadius(Number(e.target.value))}
                        />
                    </label>
                    {/* NEW: Slider for Orbit Height */}
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Orbit Height: {orbitCenterY.toFixed(0)}
                        <input
                            type="range"
                            min={200}
                            max={600}
                            value={orbitCenterY}
                            onChange={(e) => setOrbitCenterY(Number(e.target.value))}
                        />
                    </label>
                    {/* NEW: Slider for Base Lift (kept, though now auto-aligned) */}
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Base Lift (px): {liftPx.toFixed(0)}
                        <input
                            type="range"
                            min={0}
                            max={400}
                            step={1}
                            value={liftPx}
                            onChange={(e) => setLiftPx(Number(e.target.value))}
                        />
                    </label>
                    {/* NEW: Sliders for two-point pin */}
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Orbit Center @ Gate (px): {centerAtGateY.toFixed(0)}
                        <input
                            type="range"
                            min={0}
                            max={800}
                            step={1}
                            value={centerAtGateY}
                            onChange={(e) => setCenterAtGateY(Number(e.target.value))}
                        />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Freeze Start Y (px): {freezeStartY.toFixed(0)}
                        <input
                            type="range"
                            min={0}
                            max={800}
                            step={1}
                            value={freezeStartY}
                            onChange={(e) => setFreezeStartY(Number(e.target.value))}
                        />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Freeze End Y (px): {freezeEndY.toFixed(0)}
                        <input
                            type="range"
                            min={0}
                            max={800}
                            step={1}
                            value={freezeEndY}
                            onChange={(e) => setFreezeEndY(Number(e.target.value))}
                        />
                    </label>
                    {/* NEW: Slider for Follow Ramp */}
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Follow Ramp (s): {followRamp.toFixed(2)}
                        <input
                            type="range"
                            min={0.01}
                            max={1.0}
                            step={0.01}
                            value={followRamp}
                            onChange={(e) => setFollowRamp(Number(e.target.value))}
                        />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Icon Spacing (start): {iconSpacing.toFixed(0)}px
                        <input
                            type="range"
                            min={50}
                            max={250} // CHANGED from 200
                            value={iconSpacing}
                            onChange={(e) => setIconSpacing(Number(e.target.value))}
                        />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Start X (lowest): {startX.toFixed(0)}
                        <input
                            type="range"
                            min={0}
                            max={800}
                            value={startX}
                            onChange={(e) => setStartX(Number(e.target.value))}
                        />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Start Y (lowest): {startY.toFixed(0)}
                        <input
                            type="range"
                            min={0}
                            max={800}
                            value={startY}
                            onChange={(e) => setStartY(Number(e.target.value))}
                        />
                    </label>
                    {/* REMOVED: Stagger Slider */}
                    {/* REMOVED: Auto Stagger Checkbox */}
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Polygon Rotation: {rotationDeg.toFixed(0)}°
                        <input
                            type="range"
                            min={-180}
                            max={180}
                            value={rotationDeg}
                            onChange={(e) => setRotationDeg(Number(e.target.value))}
                        />
                    </label>
                    {/* NEW: Slider for Easing Emphasis */}
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        Linear Slowdown Emphasis: {lineSlowdownK.toFixed(1)}x
                        <input
                            type="range"
                            min={1}
                            max={4}
                            step={0.1}
                            value={lineSlowdownK}
                            onChange={(e) => setLineSlowdownK(Number(e.target.value))}
                        />
                    </label>
                    {/* NEW: Button to toggle direction */}
                    <button
                        onClick={() => setOrbitDir((d) => d * -1)}
                        style={{
                            background: "rgba(255,255,255,0.2)",
                            color: "white",
                            border: "none",
                            padding: "10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Direction: {orbitDir === 1 ? "Counter-Clockwise" : "Clockwise"}
                    </button>
                </div>

                {/* Stage - WRAPPED IN MOTION.DIV */}
                <motion.div
                    style={{
                        position: "relative",
                        width: 800,
                        height: 800,
                        y: stage_y,
                    }}
                >
                    {/* Title */}
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
                        Our Commitment
                    </motion.h1>

                    {/* Icon 1 (Blue) */}
                    <motion.div
                        style={{
                            position: "absolute",
                            width: 100, // CHANGED
                            height: 100, // CHANGED
                            borderRadius: "50%",
                            background: "#0099ff",
                            x: icon1_x,
                            y: icon1_y,
                            top: 0,
                            left: 0,
                            // Center the icon on its (x, y)
                            marginLeft: -50, // CHANGED
                            marginTop: -50, // CHANGED
                        }}
                    />
                    <motion.div
                        style={{
                            position: "absolute",
                            width: 300, // CHANGED
                            color: "white",
                            fontSize: 40, // CHANGED
                            // Position relative to icon's motion values
                            top: 0, // CHANGED
                            left: 0, // CHANGED
                            marginLeft: 65, // CHANGED
                            marginTop: -50, // CHANGED
                            x: icon1_x, // CHANGED
                            y: icon1_y, // CHANGED
                            opacity: text1_opacity,
                        }}
                    >
                        <b>Feature One</b>
                        {/* REMOVED subtitle */}
                    </motion.div>

                    {/* Icon 2 (Green) */}
                    <motion.div
                        style={{
                            position: "absolute",
                            width: 100, // CHANGED
                            height: 100, // CHANGED
                            borderRadius: "50%",
                            background: "#00cc66",
                            x: icon2_x,
                            y: icon2_y,
                            top: 0,
                            left: 0,
                            marginLeft: -50, // CHANGED
                            marginTop: -50, // CHANGED
                        }}
                    />
                    <motion.div
                        style={{
                            position: "absolute",
                            width: 300, // CHANGED
                            color: "white",
                            fontSize: 40, // CHANGED
                            // Position relative to icon's motion values
                            top: 0, // CHANGED
                            left: 0, // CHANGED
                            marginLeft: 65, // CHANGED
                            marginTop: -50, // CHANGED
                            x: icon2_x, // CHANGED
                            y: icon2_y, // CHANGED
                            opacity: text2_opacity,
                        }}
                    >
                        <b>Feature Two</b>
                        {/* REMOVED subtitle */}
                    </motion.div>

                    {/* Icon 3 (Purple) */}
                    <motion.div
                        style={{
                            position: "absolute",
                            width: 100, // CHANGED
                            height: 100, // CHANGED
                            borderRadius: "50%",
                            background: "#9933ff",
                            x: icon3_x,
                            y: icon3_y,

                            top: 0,
                            left: 0,
                            marginLeft: -50, // CHANGED
                            marginTop: -50, // CHANGED
                        }}
                    />
                    <motion.div
                        style={{
                            position: "absolute",
                            width: 300, // CHANGED
                            color: "white",
                            fontSize: 40, // CHANGED
                            // Position relative to icon's motion values
                            top: 0, // CHANGED
                            left: 0, // CHANGED
                            marginLeft: 65, // CHANGED
                            marginTop: -50, // CHANGED
                            x: icon3_x, // CHANGED
                            y: icon3_y, // CHANGED
                            opacity: text3_opacity,
                        }}
                    >
                        <b>Feature Three</b>
                        {/* REMOVED subtitle */}
                    </motion.div>

                    {/* Optional: visualize orbit circle */}
                    <div
                        style={{
                            position: "absolute",
                            left: ORBIT_CENTER_X - orbitRadius,
                            top: orbitCenterY - orbitRadius, // CHANGED
                            width: orbitRadius * 2,
                            height: orbitRadius * 2,
                            borderRadius: "50%",
                            border: "1px dashed rgba(255,255,255,0.2)",
                            display: "none", // HIDDEN
                        }}
                    />

                    {/* Debug overlay (optional) */}
                    <svg
                        width={800}
                        height={800}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            pointerEvents: "none",
                            display: "none", // HIDDEN
                        }}
                    >
                        {plan.icons.map((ic, i) => (
                            <g key={i} strokeWidth={1}>
                                <line
                                    x1={ic.start.x}
                                    y1={ic.start.y}
                                    x2={ic.tangent.x}
                                    y2={ic.tangent.y}
                                    stroke="rgba(0,200,250,0.6)"
                                />
                                <line
                                    x1={ORBIT_CENTER_X}
                                    y1={orbitCenterY} // CHANGED
                                    x2={ic.tangent.x}
                                    y2={ic.tangent.y}
                                    stroke="rgba(255,200,0,0.6)"
                                />
                                <circle cx={ic.tangent.x} cy={ic.tangent.y} r={3} fill="white" />
                            </g>
                        ))}
                    </svg>
                </motion.div>
            </div>
        </div>
    );
}