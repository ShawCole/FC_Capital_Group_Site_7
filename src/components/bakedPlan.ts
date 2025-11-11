// src/components/bakedPlan.ts
// How to use:
// 1) Temporarily render Scroll_Orbit_Animation instead of the baked player.
// 2) Open DevTools Console and copy the object printed after the label:
//    BAKED_PLAN_JSON: { ... }
// 3) Paste ONLY the JSON object below (replace the placeholder) and keep the export name bakedPlan.

export type BakedPlan = any; // Minimal type so TS compiles before JSON is pasted
export const bakedPlan: BakedPlan = { "w": 6.676253198247956, "v": 1602.3007675795093, "lastEnd": 1, "icons": [{ "name": "icon1", "start": { "x": 160, "y": 310 }, "tangent": { "x": 160, "y": 199.99999999999991, "phi": -3.1415926535897936 }, "delta": -5.759586531581288, "s": 1.1102230246251565e-16, "t1": 0.13730256169841318, "t2": 1, "xFinal": 192.1539030917347, "yFinal": 319.99999999999994 }, { "name": "icon2", "start": { "x": 160, "y": 500 }, "tangent": { "x": 160, "y": 200.00000000000003, "phi": -3.141592653589793 }, "delta": -3.6651914291880914, "s": 0.07654918917604592, "t1": 0.45101072108080853, "t2": 1, "xFinal": 607.8460969082653, "yFinal": 320.0000000000001 }, { "name": "icon3", "start": { "x": 160, "y": 690 }, "tangent": { "x": 160, "y": 200.00000000000003, "phi": -3.141592653589793 }, "delta": -1.5707963267948966, "s": 0.1530983783520914, "t1": 0.7647188804632036, "t2": 1, "xFinal": 400, "yFinal": -40 }], "orbitCenterX": 400, "orbitCenterY": 200, "orbitRadius": 240 };