import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    Compass,
    Download,
    ExternalLink,
    Globe,
    Handshake,
    Landmark,
    Leaf,
    LineChart,
    Lock,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Recycle,
    ShieldCheck,
    Star,
    Users,
    Languages,
    Palette,
    Building2,
    Menu,
    X,
} from "lucide-react";
import {
    LineChart as ReLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import FCLogo from "./assets/FC_LOGO_WARM_BEIGE.png";
import FelixPortrait from "./assets/Photos/photo_-0994.jpg";
import MeetingPhoto from "./assets/Photos/img-a2031f86.png";
import Portrait0778 from "./assets/Photos/photo_-0778.jpg";
import TulumMiniature from "./assets/Photos/Tulum-Miniature.png";
import LaReservaAngled2 from "./assets/Photos/la_reserva_angeled_2.png";
import SitePlan6808 from "./assets/Photos/IMG_6808.jpg";
import SitePlan6797 from "./assets/Photos/IMG_6797.jpg";
import SitePhoto6802 from "./assets/Photos/IMG_5699E3FC4B58-1.jpeg";
import LaReservaPlan from "./assets/Photos/La_Reserva.png";
import AwenMasterPlan from "./assets/Photos/a0d40afb-5c6d-460b-9ed7-f277a40eb04a.jpg";
import ScrollOrbit from "./components/ScrollOrbit";
import ScrollOrbitBaked from "./components/ScrollOrbitBaked";

// =============================
// FC CAPITAL GROUP — SINGLE-FILE SITE
// Built for: Felix Cisneros (FC Capital Group)
// Style: Premium finance × nature-positive, bilingual (EN/ES)
// Stack: React + Tailwind + Framer Motion + Recharts
// =============================

// --- Brand Tokens (tailwind-friendly via CSS variables) ---
const BrandCSS = () => (
    <style>{`
    :root{
      --fc-ink:#0e0f11;            /* near-black */
      --fc-charcoal:#1b1f1d;       /* charcoal */
      --fc-forest:#213c2b;         /* Main Green */
      --fc-stone:#d9d3cb;          /* Main Light */
      --fc-blue:#21325e;           /* Main Blue */
      --fc-brown:#38322a;          /* Accent Brown */
      --fc-sand:#efe7db;           /* Accent Sand */
      --fc-beige:#f9dcba;          /* Accent Beige */
      --fc-forest-2:#133b31;       /* alt deep green */
      --fc-sage:#2f6b5a;           /* sage accent for UI */
      --fc-gold:#c9a96a;           /* restrained gold accent */
      --fc-gold-600:#b6924a;
      --fc-maya:#2c2a1f;           /* subtle Mayan motif color */
    }
    .fc-container{max-width:1200px;margin-inline:auto;padding-inline:1rem}
    /* Ensure no horizontal gap on small screens */
    @media (max-width: 768px){
      .fc-container{padding-inline:1rem}
      body{overflow-x:hidden}
      html{overflow-x:hidden}
    }
    .fc-card{background:white;border-radius:1.25rem;box-shadow:0 8px 24px rgba(12,21,16,.08);}
    .fc-blur{backdrop-filter: blur(10px)}
    .fc-gradient{background: radial-gradient(1200px 600px at 90% -10%, rgba(201,169,106,0.10), rgba(19,59,49,0) 60%),
                             radial-gradient(1000px 500px at -10% 120%, rgba(15,47,39,0.20), rgba(0,0,0,0) 60%),
                             linear-gradient(180deg, rgba(19,59,49,.04), rgba(19,59,49,0));}
    .fc-hero-pattern{background-image:
      radial-gradient(1px 1px at 25px 25px, rgba(201,169,106,.35) 0, rgba(201,169,106,0) 50%),
      linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px),
      linear-gradient(0deg, rgba(255,255,255,.04) 1px, transparent 1px);
      background-size: 50px 50px, 50px 50px, 50px 50px;
      mask-image: radial-gradient(circle at 60% 10%, black, transparent 65%);
    }
    .fc-maya-border{border-image: repeating-linear-gradient(90deg, var(--fc-gold) 0 10px, transparent 10px 20px) 8}
    .btn{display:inline-flex;align-items:center;gap:.5rem;border-radius:.75rem;padding:.75rem 1.1rem;font-weight:600}
    .btn-primary{background:var(--fc-gold);color:#1b1b1b}
    .btn-primary:hover{background:var(--fc-gold-600)}
    .btn-outline{border:1px solid var(--fc-stone);color:white}
    .btn-outline:hover{border-color:#fff;background:rgba(255,255,255,.06)}
    .pill{border:1px solid rgba(255,255,255,.2);padding:.35rem .7rem;border-radius:9999px;font-size:.85rem}
    .chip{border:1px solid #e6e6e6;border-radius:9999px;padding:.35rem .7rem;font-size:.8rem}
    .kbd{background:#111;color:#f9f9f9;border-radius:.5rem;padding:.1rem .4rem;border:1px solid #333}
    .link-soft{color:var(--fc-gold)}
    /* Hide scrollbars universally */
    .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
    .no-scrollbar::-webkit-scrollbar{display:none}
    /* Prevent overscroll bounce/jitter */
    .fc-hscroll{overscroll-behavior:none}
    .fc-touch{touch-action:pan-x}
  `}</style>
);

// --- Bilingual copy dictionary ---
const i18n = {
    en: {
        nav: {
            strategies: "Strategies",
            portfolio: "Portfolio",
            impact: "Impact",
            insights: "Insights",
            team: "About",
            partner: "Partner with us",
            login: "LP Login",
        },
        hero: {
            kicker: "FC Capital Group",
            h1: "Bridging global capital with Mexico's finest opportunities",
            subtitle:
                "We align international investors with trusted operators and structure real estate, hospitality, and JV opportunities.",
            cta1: "Connect With Us",
            cta2: "Submit a project",
        },
        pillars: {
            title: "Our Principles",
            p1: "Trust & transparency",
            p1d:
                "Bilingual cross‑border expertise, clear deal structures, and investor‑first disclosures.",
            p2: "Purpose with ROI",
            p2d:
                "We underwrite cashflows and impact—so growth builds wealth and meaning.",
            p3: "Partnership edge",
            p3d:
                "Boutique access to off‑market deals with vetted developers and operators.",
        },
        strategies: {
            title: "Investment strategies",
            s1: {
                name: "Nature‑based & Eco‑tourism",
                desc:
                    "Reef‑, forest‑ and culture‑anchored destinations: lodges, villas, concessions, and upgrades with efficiency standards.",
                tags: ["Tulum", "Riviera Maya", "Oaxaca", "Baja Sur"],
            },
            s2: {
                name: "Circular & Sustainable Living",
                desc:
                    "Hospitality and mixed‑use assets with circular design, low‑waste operations, and durable brand equity.",
                tags: ["Retrofits", "Waste‑lite ops", "Supply partners"],
            },
            s3: {
                name: "Legacy Real Assets",
                desc:
                    "Early‑phase land, villas, plazas, and income‑generating buildings—curated for stability and multi‑gen value.",
                tags: ["Land (early)", "Yield assets", "Architectural villas"],
            },
        },
        portfolio: {
            title: "Select opportunities",
            filters: { all: "All", eco: "Eco‑tourism", circular: "Circular", legacy: "Legacy" },
        },
        impact: {
            title: "A Track Record You Can Underwrite",
            subtitle:
                "We publish methodology, baselines, and performance to keep promises accountable.",
            kpis: [
                { label: "hectares stewarded", key: "hectares" },
                { label: "tCO₂e avoided", key: "tco2e" },
                { label: "local jobs supported", key: "jobs" },
            ],
        },
        avatars: {
            title: "Who we serve",
            legacy: "Legacy Builder",
            impact: "Impact Diversifier",
            nextgen: "Next‑Gen Wealth Migrator",
        },
        partner: {
            title: "Partner with us",
            lp: "Limited Partners",
            coinv: "Co‑investors",
            dev: "Developers",
            cta: "Book a call",
        },
        contact: {
            title: "Let’s talk",
            subtitle:
                "Clarity and peace of mind. Share a few details and we’ll reply within one business day.",
            name: "Full name",
            email: "Email",
            phone: "WhatsApp / Phone",
            msg: "What are you looking to achieve?",
            send: "Send inquiry",
        },
        footer: {
            rights: "All rights reserved.",
            disclaimer:
                "Disclaimer: Investments carry risk. Past performance does not guarantee future results. This is not an offer to sell or a solicitation to buy any security.",
        },
    },
    es: {
        nav: {
            strategies: "Estrategias",
            portfolio: "Portafolio",
            impact: "Impacto",
            insights: "Ideas",
            team: "Sobre nosotros",
            partner: "Aliados",
            login: "Acceso LP",
        },
        hero: {
            kicker: "FC Capital Group",
            h1: "Conectando capital con las mejores oportunidades de México",
            subtitle:
                "Tierra off‑market, hospitalidad y JVs programáticos con gobernanza, título y permisos listos para comité.",
            cta1: "Invertir / Solicitar deck",
            cta2: "Presentar proyecto",
        },
        pillars: {
            title: "Nuestros principios",
            p1: "Confianza y transparencia",
            p1d:
                "Experiencia transfronteriza bilingüe, estructuras claras y divulgaciones para el inversionista.",
            p2: "Propósito con retorno",
            p2d:
                "Bajo escritura de flujos e impacto: crecimiento que crea riqueza y sentido.",
            p3: "Ventaja en alianzas",
            p3d:
                "Acceso boutique a oportunidades fuera del mercado con desarrolladores validados.",
        },
        strategies: {
            title: "Estrategias de inversión",
            s1: {
                name: "Naturaleza y Eco‑turismo",
                desc:
                    "Destinos anclados en arrecifes, bosques y cultura: lodges, villas, concesiones y mejoras con estándares de eficiencia.",
                tags: ["Tulum", "Riviera Maya", "Oaxaca", "Baja Sur"],
            },
            s2: {
                name: "Vida Circular y Sostenible",
                desc:
                    "Activos de hospitalidad y usos mixtos con diseño circular, operaciones de bajo desperdicio y marca duradera.",
                tags: ["Retrofits", "Bajos residuos", "Proveedores"],
            },
            s3: {
                name: "Activos de Legado",
                desc:
                    "Terrenos en fase temprana, villas, plazas y edificios con renta—curados para estabilidad y valor multigeneracional.",
                tags: ["Terreno (temprano)", "Activos de renta", "Villas arquitectónicas"],
            },
        },
        portfolio: {
            title: "Oportunidades destacadas",
            filters: { all: "Todas", eco: "Eco‑turismo", circular: "Circular", legacy: "Legado" },
        },
        impact: {
            title: "Medición verificable",
            subtitle:
                "Publicamos metodología, líneas base y desempeño para rendir cuentas.",
            kpis: [
                { label: "hectáreas gestionadas", key: "hectares" },
                { label: "tCO₂e evitadas", key: "tco2e" },
                { label: "empleos locales", key: "jobs" },
            ],
        },
        avatars: {
            title: "A quién servimos",
            legacy: "Constructor de Legado",
            impact: "Diversificador con Impacto",
            nextgen: "Migrante de Riqueza Next‑Gen",
        },
        partner: {
            title: "Aliados",
            lp: "Limited Partners",
            coinv: "Co‑inversionistas",
            dev: "Desarrolladores",
            cta: "Agendar llamada",
        },
        contact: {
            title: "Conversemos",
            subtitle:
                "Claridad y tranquilidad. Comparte algunos datos y respondemos en 1 día hábil.",
            name: "Nombre completo",
            email: "Correo",
            phone: "WhatsApp / Teléfono",
            msg: "¿Qué objetivo quieres lograr?",
            send: "Enviar consulta",
        },
        footer: {
            rights: "Todos los derechos reservados.",
            disclaimer:
                "Aviso: Toda inversión implica riesgo. Rendimientos pasados no garantizan resultados futuros. No constituye oferta pública.",
        },
    },
};

// --- Sample data (replace with CMS later) ---
const portfolioItems = [
    {
        id: "eco1",
        title: "Sian Ka’an Eco‑Lodge Upgrade",
        theme: "eco",
        region: "Riviera Maya",
        stage: "Upgrade/Retrofit",
        kpi: "EDGE Gold target",
        desc:
            "Energy‑water retrofits, low‑impact mobility, and reef‑safe operations paired with community employment program.",
    },
    {
        id: "c1",
        title: "Circular Hospitality Supply Hub",
        theme: "circular",
        region: "Quintana Roo",
        stage: "Growth",
        kpi: "Waste −45%",
        desc:
            "Shared reverse‑logistics for hotels & villas: reuse, repair, and recommerce for FF&E and appliances.",
    },
    {
        id: "leg1",
        title: "Architectural Villas Oaxaca",
        theme: "legacy",
        region: "Oaxaca Coast",
        stage: "Early land + design",
        kpi: "IRR 17–20% model",
        desc:
            "Co‑development of 6 luxury villas with local materials, passive cooling, and long‑stay demand.",
    },
    {
        id: "eco2",
        title: "Bacalar Lagoon Low‑Impact Concessions",
        theme: "eco",
        region: "Bacalar",
        stage: "Concessions",
        kpi: "Visitor fees → conservation",
        desc:
            "Guided nature experiences with capped daily throughput; revenues tied to conservation fund.",
    },
    {
        id: "c2",
        title: "Plaza Retrofit (PV + Water)",
        theme: "circular",
        region: "Pachuca",
        stage: "Retrofit",
        kpi: "tCO₂e −30%",
        desc:
            "Rooftop PV, greywater reuse, and efficient chillers for a stabilized mixed‑use plaza.",
    },
    {
        id: "leg2",
        title: "Income Buildings – Riviera Maya",
        theme: "legacy",
        region: "RM",
        stage: "Income",
        kpi: "7–9% cash‑on‑cash",
        desc:
            "Stabilized assets with disciplined ops and trustworthy property management.",
    },
];

const kpiSeries = [
    { quarter: "2024 Q1", hectares: 120, tco2e: 210, jobs: 18 },
    { quarter: "2024 Q2", hectares: 200, tco2e: 380, jobs: 26 },
    { quarter: "2024 Q3", hectares: 310, tco2e: 540, jobs: 35 },
    { quarter: "2024 Q4", hectares: 420, tco2e: 760, jobs: 49 },
    { quarter: "2025 Q1", hectares: 560, tco2e: 980, jobs: 63 },
    { quarter: "2025 Q2", hectares: 690, tco2e: 1200, jobs: 78 },
];

// --- Helpers ---
const Section = ({ id, children, tone = "light", className = "" }) => (
    <section
        id={id}
        className={
            "py-16 md:py-24 " +
            (tone === "dark"
                ? "bg-[var(--fc-forest)] text-white"
                : tone === "sand"
                    ? "bg-[var(--fc-sand)]"
                    : "bg-white") +
            " " +
            className
        }
    >
        <div className="fc-container">{children}</div>
    </section>
);

const StatTile = ({ label, value }) => (
    <div className="fc-card p-6 md:p-8 text-center">
        <div className="text-4xl md:text-5xl font-extrabold text-[var(--fc-forest)]">
            {value}
        </div>
        <div className="mt-2 text-sm text-neutral-600">{label}</div>
    </div>
);

const Pill = ({ children }) => (
    <span className="pill text-white/90">{children}</span>
);

// --- External link interstitial ---
function LeavingSiteModal({ url, onClose, onContinue }) {
    return (
        <AnimatePresence>
            {url && (
                <motion.div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="fc-card max-w-xl w-[92%] p-6 md:p-8"
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.96, opacity: 0 }}
                    >
                        <div className="flex items-start gap-4">
                            <ShieldCheck className="text-[var(--fc-forest)]" />
                            <div>
                                <h3 className="text-xl font-semibold">
                                    You’re leaving FC Capital Group’s site
                                </h3>
                                <p className="text-neutral-600 mt-1">
                                    We don’t control the content on external sites. Continue?
                                </p>
                                <p className="mt-2 text-sm text-neutral-500 break-all">{url}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3 justify-end">
                            <button className="btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={() => onContinue(url)}>
                                Continue <ExternalLink size={16} />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// --- Main Site Component ---
export default function FCCapitalSite() {
    const [lang, setLang] = useState("en");
    const [mobileOpen, setMobileOpen] = useState(false);
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [hoveredMenu, setHoveredMenu] = useState("");
    const desktopCarouselRef = useRef(null);
    const [carouselPaused, setCarouselPaused] = useState(false);
    const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);
    const dragStateRef = useRef({ startX: 0, scrollLeft: 0 });
    const t = useMemo(() => i18n[lang], [lang]);
    const [filter, setFilter] = useState("all");
    const [leavingUrl, setLeavingUrl] = useState("");
    const [showBrandGuide, setShowBrandGuide] = useState(false);

    // trap external links to show interstitial
    useEffect(() => {
        const handler = (e) => {
            const anchor = e.target.closest("a");
            if (!anchor) return;
            const href = anchor.getAttribute("href");
            if (!href) return;
            const isExternal = /^https?:\/\//.test(href) && !href.includes("#");
            if (isExternal) {
                e.preventDefault();
                setLeavingUrl(href);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const filtered = portfolioItems.filter((p) =>
        filter === "all" ? true : p.theme === filter
    );

    useEffect(() => {
        // Lock scroll when mobile menu is open
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    useEffect(() => {
        const update = () => {
            setHeaderHeight(headerRef.current ? headerRef.current.offsetHeight : 0);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    // Desktop carousel auto-scroll (slow), with drag/hover control
    useEffect(() => {
        const el = desktopCarouselRef.current;
        if (!el) return;

        let rafId = 0;
        const step = () => {
            if (!carouselPaused && !isDraggingCarousel) {
                const max = el.scrollWidth - el.clientWidth;
                if (el.scrollLeft >= max - 1) {
                    el.scrollLeft = 0; // loop
                } else {
                    el.scrollLeft += 0.3; // speed (px per frame)
                }
            }
            rafId = requestAnimationFrame(step);
        };
        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [carouselPaused, isDraggingCarousel]);

    // Clamp scroll position to avoid overflow jitter on edges
    useEffect(() => {
        const el = desktopCarouselRef.current;
        if (!el) return;
        const onScroll = () => {
            const max = el.scrollWidth - el.clientWidth;
            if (el.scrollLeft < 0) el.scrollLeft = 0;
            if (el.scrollLeft > max) el.scrollLeft = max;
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    const onCarouselMouseDown = (e) => {
        const el = desktopCarouselRef.current;
        if (!el) return;
        setIsDraggingCarousel(true);
        dragStateRef.current.startX = e.pageX - el.offsetLeft;
        dragStateRef.current.scrollLeft = el.scrollLeft;
    };
    const onCarouselMouseMove = (e) => {
        if (!isDraggingCarousel) return;
        const el = desktopCarouselRef.current;
        if (!el) return;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - dragStateRef.current.startX) * 1; // drag sensitivity
        el.scrollLeft = dragStateRef.current.scrollLeft - walk;
    };
    const endCarouselDrag = () => setIsDraggingCarousel(false);

    return (
        <div className="min-h-screen text-[var(--fc-ink)] bg-white overflow-x-hidden">
            <BrandCSS />

            {/* HEADER */}
            <div onMouseLeave={() => setHoveredMenu("")}>
                <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-[var(--fc-forest)]/80 fc-blur text-white border-b border-white/10">
                    <div className="fc-container flex items-center justify-between py-3">
                        <a href="#hero-main" className="flex items-center gap-3 group">
                            <div className="h-9 w-9">
                                <img src={FCLogo} alt="FC Capital Group" className="h-9 w-9 object-contain" draggable={false} />
                            </div>
                            <div>
                                <div className="font-extrabold tracking-tight text-xl">FC CAPITAL GROUP</div>
                                <div className="opacity-80 text-[11px]">BOUTIQUE INVESTMENT FIRM</div>
                            </div>
                        </a>

                        <nav className="hidden md:flex items-center gap-6 text-sm">
                            <a href="#about" className={`hover:opacity-100 ${hoveredMenu === "about" ? "opacity-100 font-semibold" : "opacity-90"}`} onMouseEnter={() => setHoveredMenu("about")}>About</a>
                            <a href="#approach" className={`hover:opacity-100 ${hoveredMenu === "approach" ? "opacity-100 font-semibold" : "opacity-90"}`} onMouseEnter={() => setHoveredMenu("approach")}>Approach</a>
                            <a href="#portfolio" className={`hover:opacity-100 ${hoveredMenu === "portfolio" ? "opacity-100 font-semibold" : "opacity-90"}`} onMouseEnter={() => setHoveredMenu("portfolio")}>Portfolio</a>
                            <a href="#partner" className={`hover:opacity-100 ${hoveredMenu === "partners" ? "opacity-100 font-semibold" : "opacity-90"}`} onMouseEnter={() => setHoveredMenu("partners")}>Partners</a>
                            <a href="#insights" className={`hover:opacity-100 ${hoveredMenu === "insights" ? "opacity-100 font-semibold" : "opacity-90"}`} onMouseEnter={() => setHoveredMenu("insights")}>Insights</a>
                        </nav>

                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2">
                                <a href="#invest" className="btn btn-primary">Invest</a>
                                <a href="#login" className="btn btn-outline">
                                    <Lock size={16} /> Investor Portal Login
                                </a>
                            </div>
                            <button
                                className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10"
                                onClick={() => setMobileOpen((v) => !v)}
                                aria-label="Open menu"
                            >
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Spacer removed to allow header to overlay first section */}

                {/* Desktop mega-submenu extension (full-width, off-white, no seam) */}
                {hoveredMenu && (
                    <div className="hidden md:block">
                        <div
                            className="bg-[var(--fc-sand)] text-[var(--fc-charcoal)] fixed left-0 right-0 z-40 border-b border-[var(--fc-stone)]/50"
                            style={{ top: headerHeight }}
                            onMouseEnter={() => { }}
                        >
                            <div className="fc-container py-8">
                                <div className="grid grid-cols-12 gap-8 items-start">
                                    {/* Left anchor: breadcrumb + big title */}
                                    <div className="col-span-4">
                                        <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--fc-charcoal)]/60">FC CAPITAL GROUP</div>
                                        <div className="mt-2 text-3xl font-serif">
                                            {hoveredMenu === "about" && "About"}
                                            {hoveredMenu === "approach" && "Approach"}
                                            {hoveredMenu === "portfolio" && "Portfolio"}
                                            {hoveredMenu === "insights" && "Insights"}
                                            {hoveredMenu === "partners" && "Partners"}
                                        </div>
                                    </div>
                                    {/* Right: vertical list */}
                                    <div className="col-span-8">
                                        <div className="grid gap-3 text-[var(--fc-charcoal)]">
                                            {hoveredMenu === "about" && (
                                                <>
                                                    <a href="#about" className="hover:underline">Who We Are</a>
                                                    <a href="#founder" className="hover:underline">Founder’s Letter</a>
                                                    <a href="#principles" className="hover:underline">Principles</a>
                                                </>
                                            )}
                                            {hoveredMenu === "approach" && (
                                                <>
                                                    <a href="#approach" className="hover:underline">Investment Approach</a>
                                                    <a href="#insights" className="hover:underline">Strategic/Investment Insights</a>
                                                    <a href="#risk" className="hover:underline">Risk & Stewardship</a>
                                                </>
                                            )}
                                            {hoveredMenu === "portfolio" && (
                                                <>
                                                    <a href="#portfolio" className="hover:underline">Real Estate & Hospitality</a>
                                                    <a href="#portfolio" className="hover:underline">Private Equity & Ventures</a>
                                                    <a href="#portfolio" className="hover:underline">Strategic Land</a>
                                                    <a href="#portfolio" className="hover:underline">Tailored</a>
                                                    <a href="#portfolio" className="hover:underline">Case Snapshots</a>
                                                </>
                                            )}
                                            {hoveredMenu === "insights" && (
                                                <>
                                                    <a href="#blog" className="hover:underline">Blog</a>
                                                    <a href="#podcast" className="hover:underline">First Row Podcast</a>
                                                    <a href="#subscribe" className="hover:underline">Subscribe</a>
                                                </>
                                            )}
                                            {hoveredMenu === "partners" && (
                                                <>
                                                    <a href="#partner" className="hover:underline">Partnership Programs</a>
                                                    <a href="#partner" className="hover:underline">Developer Network</a>
                                                    <a href="#partner" className="hover:underline">Co‑Investor Opportunities</a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile dropdown menu as fixed overlay, starting below header (no animation) */}
            {mobileOpen && (
                <div
                    className="sm:hidden fixed left-0 right-0 bottom-0 z-50 bg-black/40"
                    style={{ top: headerHeight }}
                    onClick={() => setMobileOpen(false)}
                >
                    <div
                        className="fixed left-0 right-0 bg-[var(--fc-forest)] text-white border-b border-white/10"
                        style={{ top: headerHeight }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="fc-container pt-4 pb-6 grid gap-4">
                            {[
                                { label: 'About', items: ['Who We Are', 'Founder’s Letter', 'Principles'], anchors: ['#about', '#founder', '#principles'] },
                                { label: 'Approach', items: ['Investment Approach', 'Strategic/Investment Insights', 'Risk & Stewardship'], anchors: ['#approach', '#insights', '#risk'] },
                                { label: 'Portfolio', items: ['Real Estate & Hospitality', 'Private Equity & Ventures', 'Strategic Land', 'Tailored', 'Case Snapshots'], anchors: ['#portfolio', '#portfolio', '#portfolio', '#portfolio', '#portfolio'] },
                                { label: 'Partners', items: ['Partnership Programs', 'Developer Network', 'Co‑Investor Opportunities'], anchors: ['#partner', '#partner', '#partner'] },
                                { label: 'Insights', items: ['Blog', 'First Row Podcast', 'Subscribe'], anchors: ['#insights', '#podcast', '#subscribe'] }
                            ].map((grp, gi) => (
                                <details key={gi} className="bg-white/5 rounded-lg">
                                    <summary className="cursor-pointer px-4 py-3 font-semibold flex items-center justify-between">{grp.label}<span className="opacity-80">▾</span></summary>
                                    <div className="px-4 pb-3 grid gap-1 mt-2">
                                        {grp.items.map((it, ii) => (
                                            <a
                                                key={ii}
                                                href={grp.anchors[ii]}
                                                className="block w-full text-left py-2 text-white hover:underline"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {it}
                                            </a>
                                        ))}
                                    </div>
                                </details>
                            ))}
                            <a href="#invest" className="btn btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>Invest</a>
                            <a href="#login" className="btn btn-outline w-full justify-center" onClick={() => setMobileOpen(false)}>Investor Portal Login</a>
                        </div>
                    </div>
                </div>
            )}

            {/* === BEGIN HERO MAIN === */}
            {/* HERO (top) */}
            <Section id="hero-main" data-section="hero-main" tone="dark" className="relative overflow-hidden !py-0 pb-0" style={{ paddingTop: headerHeight }}>
                <div className="absolute inset-0 fc-hero-pattern opacity-40 pointer-events-none" />
                <div className="flex items-center justify-center" style={{ height: `820px` }}>
                    <div className="grid md:grid-cols-12 gap-8 items-center w-[1170px] mx-auto">
                        <div className="md:col-span-7 w-[560px] h-[620px] flex flex-col justify-center" data-block="hero-main-content">

                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Invest in Mexico with Clarity</h1>
                            <p className="mt-4 mb-4 pt-4 pb-4 text-lg text-white/85 max-w-2xl">
                                {t.hero.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a href="#contact" className="btn btn-primary">
                                    {t.hero.cta1}
                                </a>
                                <a href="#partner" className="btn btn-outline">
                                    {t.hero.cta2}
                                </a>
                            </div>

                        </div>
                        <div className="md:col-span-5" data-block="hero-main-images">
                            <div className="fc-card p-0 overflow-hidden">
                                <img src={MeetingPhoto} alt="Team meeting" className="block w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
            {/* === END HERO MAIN === */}

            {/* BRAND GUIDE hidden in floating panel; section removed */}

            {/* === BEGIN FIRST INTRO === */}
            {/* FIRST INTRO (formerly hero-2) */}
            <Section id="first-intro" data-section="first-intro" tone="sand" className="relative overflow-hidden !py-0 pb-0" style={{ paddingTop: headerHeight }}>
                <div className="absolute inset-0 fc-hero-pattern opacity-40 pointer-events-none" />
                <div className="w-[1170px] mx-auto flex items-center gap-8" style={{ height: `820px` }}>
                    <div className="relative flex justify-end items-start w-[560px] h-[620px] box-border pl-2 pr-2 pt-8" data-block="first-intro-images">
                        {/* Picture A (large) */}
                        <div className="fc-card p-0 overflow-hidden w-[328px] h-[479px]">
                            <img src={Portrait0778} alt="Portrait" className="block w-full h-full object-cover" />
                        </div>
                        {/* Picture B (small, overlapping) */}
                        <div className="absolute left-0 bottom-[46px] z-10">
                            <div className="fc-card p-0 overflow-hidden w-40 md:w-52 aspect-[3/4]">
                                <img src={LaReservaAngled2} alt="Tulum miniature" className="block w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                    <div className="w-[560px] h-[620px] box-border pl-8 flex flex-col" data-block="first-intro-content">
                        <div className="h-16 flex items-center">
                            <div className="text-sm uppercase tracking-[0.2em] text-[var(--fc-charcoal)]/60">Our Core Competence</div>
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                {t.hero.h1}
                            </h1>
                            <p className="mt-4 text-lg text-[var(--fc-ink)] max-w-2xl">
                                We are a boutique capital management group based in Mexico, connecting global capital with impactful development projects. Our small, dedicated team ensures personalized service and strategic investment solutions.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a href="#contact" className="btn btn-primary">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div className="flex-1" />
                    </div>
                </div>
            </Section>
            {/* === END FIRST INTRO === */}

            {/* INSERTED: Strategies (clone) */}
            <Section id="strategies-inline" className="!pt-8 !pb-0 md:!pt-8 md:!pb-0">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2">All Projects Must:</h2>
                <p className="text-neutral-600 mb-6">(Above all else)</p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="fc-card p-6 md:p-8 border border-[var(--fc-stone)]/60 bg-[var(--fc-sand)]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--fc-forest)]/10 text-[var(--fc-forest)] hidden"><Building2 /></div>
                            <h3 className="text-xl font-semibold">Serve the land they are built on</h3>
                        </div>
                    </div>
                    <div className="fc-card p-6 md:p-8 border border-[var(--fc-stone)]/60 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--fc-forest)]/10 text-[var(--fc-forest)]"><Leaf /></div>
                            <h3 className="text-xl font-semibold">Benefit the community they live in</h3>
                        </div>
                    </div>
                    <div className="fc-card p-6 md:p-8 border border-[var(--fc-stone)]/60 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--fc-forest)]/10 text-[var(--fc-forest)]"><Recycle /></div>
                            <h3 className="text-xl font-semibold">Support the individuals they impact</h3>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: -128 }}>
                    <ScrollOrbitBaked />
                </div>
            </Section>

            {/* DUPLICATE: Portfolio */}
            <Section id="portfolio-2" tone="dark" className="!py-8 md:!py-8">
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-center md:text-left">Who We Are</h2>
                        <p className="text-white mt-2 max-w-2xl mx-auto md:mx-0 text-center md:text-left">
                            {lang === "en" ? "The Bridge between Vision and Value." : "The Bridge between Vision and Value."}
                        </p>
                        {/* Additional paragraph box */}
                        <div className="p-6 md:p-7 mt-4 bg-transparent text-lg md:text-xl">
                            {lang === "en" ? (
                                <div className="text-white space-y-4">
                                    <p>FC Capital Group is a boutique investment firm connecting global investors with Mexico’s refined opportunities.</p>
                                    <p>Founded by Felix Cisneros, we operate at the intersection of institutional discipline and cultural depth, blending financial strategy and long-term value creation.</p>
                                    <p>Rooted in Tulum with a global mindset, we identify and develop enduring assets in real estate, hospitality, and ventures where design, purpose, and performance align.</p>
                                    <p>Our portfolio is a living trust between visionaries and stewards of value.</p>
                                </div>
                            ) : (
                                <p className="text-white">FC Capital Group conecta capital global con las mejores oportunidades de México—con gobernanza, términos claros y ejecución en campo.</p>
                            )}
                        </div>
                        {/* Where we operate chip row */}
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            {['Tulum', 'CDMX', 'Guadelajara', 'Puerto Escondito', 'Playa Del Carmen', 'Baja California', 'Hidalgo'].map((city) => (
                                <span key={city} className="chip bg-white text-black">{city}</span>
                            ))}
                        </div>
                    </div>

                </div>

            </Section>

            {/* DUPLICATE: Strategies */}
            <Section id="strategies-2" className="!py-8 md:!py-8">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Available Investments</h2>
                <p className="text-neutral-600 mb-6">Curated opportunities. Enduring value.</p>
                <div className="grid gap-6">
                    {/* Row 1: Left */}
                    <div className="flex justify-center items-start gap-6">
                        <div className="hidden md:block">
                            <div className="p-0 overflow-hidden w-[320px]" style={{ background: "transparent", border: "none", boxShadow: "none", outline: "none" }}>
                                <img src={LaReservaPlan} alt="Site plan" className="block w-full h-auto object-cover" />
                            </div>
                        </div>
                        <div className="p-6 md:p-8 w-full md:max-w-[680px]" style={{ background: "transparent", border: "none", boxShadow: "none" }}>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold">Real Estate & Hospitality</h3>
                            </div>
                            <p className="mt-3 text-neutral-700">From residential and mixed-use developments to boutique hospitality, we target assets that combine location, design, and cultural resonance. Our projects are built to last, offering stability and tangible growth.</p>
                        </div>
                    </div>
                    {/* Row 2: Left */}
                    <div className="flex justify-center items-start gap-6">
                        <div className="p-6 md:p-8 w-full md:max-w-[680px] text-right" style={{ background: "transparent", border: "none", boxShadow: "none" }}>
                            <div className="flex items-center gap-3 justify-end">
                                <h3 className="text-xl font-semibold">Private Equity & Ventures</h3>
                            </div>
                            <p className="mt-3 text-neutral-700">We partner with companies that share our values and vision. With investors who develop responsibly, scale intelligently, and deliver sustainable returns.</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="fc-card p-0 overflow-hidden w-[320px]">
                                <img src={SitePhoto6802} alt="Architecture detail" className="block w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>
                    {/* Row 3: Left */}
                    <div className="flex justify-center items-start gap-6">
                        <div className="hidden md:block">
                            <div className="p-0 overflow-hidden w-[320px]" style={{ background: "transparent", border: "none", boxShadow: "none", outline: "none", borderRadius: "1.25rem" }}>
                                <img src={AwenMasterPlan} alt="Lots plan" className="block w-full h-auto object-cover" />
                            </div>
                        </div>
                        <div className="p-6 md:p-8 w-full md:max-w-[384px]" style={{ background: "transparent", border: "none", boxShadow: "none" }}>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold">Strategic Land Holdings</h3>
                            </div>
                            <p className="mt-3 text-neutral-700">Through selective land acquisition, we secure high-potential sites that provide optionality and long-term growth, especially in emerging and high-demand regions like Tulum and beyond.</p>
                        </div>
                    </div>
                </div>
            </Section>
            {/* APPROACH (replaces previous 'portfolio' content) */}
            <Section id="portfolio" tone="sand" className="!py-8 md:!py-8">
                <h2 className="text-3xl md:text-4xl font-extrabold">Our Approach</h2>
                <p className="text-neutral-600 mt-2 max-w-2xl">Guided by discipline. Driven by vision. Grounded in value.</p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="fc-card p-6 md:p-8">
                        <h3 className="text-xl font-semibold">Fundamentals First</h3>
                        <p className="mt-3 text-neutral-700">Every investment starts with rigorous due diligence. We look at market data, legal structure, and macro trends with institutional precision.</p>
                        <p className="mt-3 text-neutral-700">We look for asymmetric opportunities: tangible assets with intrinsic value and built‑in downside protection.</p>
                    </div>

                    <div className="fc-card p-6 md:p-8">
                        <h3 className="text-xl font-semibold">Vision Beyond the Numbers</h3>
                        <p className="mt-3 text-neutral-700">Financials tell one story, but vision completes it.</p>
                        <p className="mt-3 text-neutral-700">We back ventures with real narrative weight: destinations and developments shaped by design, sustainability, and cultural integrity. Capital alone doesn’t create value; context does.</p>
                    </div>

                    <div className="fc-card p-6 md:p-8">
                        <h3 className="text-xl font-semibold">Fidelity to Time</h3>
                        <p className="mt-3 text-neutral-700">We think in cycles, not quarters.</p>
                        <p className="mt-3 text-neutral-700">Our horizon is long‑term stewardship: nurturing projects that mature thoughtfully, balancing returns with resilience. In a world that moves fast, patience is a competitive advantage.</p>
                    </div>
                </div>
            </Section>

            {/* STRATEGIES (moved here between Portfolio and Principles) */}
            <Section id="strategies" className="!py-8 md:!py-8">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Partners and Bridges</h2>
                <p className="text-neutral-600 max-w-2xl mb-8">Building opportunity through collaboration.</p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="fc-card p-6 md:p-8 border border-[var(--fc-stone)]/60 bg-[var(--fc-sand)]">
                        <h3 className="text-xl font-semibold">Tulum Land & Property</h3>
                        <div className="text-neutral-600 mt-1">Michael Gill</div>
                        <p className="mt-3 text-neutral-700">Guiding us through Mexico’s most promising developments with local insight and strategic precision.</p>
                    </div>
                    <div className="fc-card p-6 md:p-8 border border-[var(--fc-stone)]/60 bg-white">
                        <h3 className="text-xl font-semibold">La Reserva</h3>
                        <div className="text-neutral-600 mt-1">Hidde Resink</div>
                        <p className="mt-3 text-neutral-700">Pioneering sustainable and culturally conscious residential projects that redefine luxury living.</p>
                    </div>
                    <div className="fc-card p-6 md:p-8 border border-[var(--fc-stone)]/60 bg-white">
                        <h3 className="text-xl font-semibold">Wave Architecture</h3>
                        <div className="text-neutral-600 mt-1">Armando Uribe</div>
                        <p className="mt-3 text-neutral-700">Designing spaces that harmonize with environment and experience, shaping places that endure.</p>
                    </div>
                </div>
            </Section>

            {/* PILLARS (moved down) */}
            <Section id="principles" tone="sand" className="pt-8 md:pt-8 pb-8 md:pb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center md:text-left">{t.pillars.title}</h2>

                {/* Desktop: infinite marquee-style carousel */}
                <div className="hidden md:block overflow-hidden relative">
                    <div
                        ref={desktopCarouselRef}
                        className="flex gap-6 overflow-x-auto no-scrollbar fc-hscroll fc-touch cursor-grab active:cursor-grabbing pl-5 pr-5"
                        onMouseEnter={() => setCarouselPaused(true)}
                        onMouseLeave={() => { setCarouselPaused(false); endCarouselDrag(); }}
                        onMouseDown={onCarouselMouseDown}
                        onMouseMove={onCarouselMouseMove}
                        onMouseUp={endCarouselDrag}
                    >
                        {[
                            {
                                title: 'Vision Alignment',
                                desc: 'All investments must serve a clear long-term vision rooted in purpose, cultural integrity, and financial growth. We invest in ideas and assets that contribute to sustainable prosperity and legacy creation.'
                            },
                            {
                                title: 'Governance & Integrity',
                                desc: 'Our reputation is our greatest asset. We operate under the highest ethical standards, ensuring transparency, compliance, and fairness in every negotiation, partnership, and fiduciary decision.'
                            },
                            {
                                title: 'Capital Discipline',
                                desc: 'We allocate resources strategically, balancing ambition with accountability. Every investment decision follows rigorous due diligence, measured risk exposure, and responsible capital stewardship.'
                            },
                            {
                                title: 'Operational Excellence',
                                desc: 'Execution defines our value. We build, manage, and deliver with precision, ensuring every project meets world-class standards in design, quality, and sustainability.'
                            },
                            {
                                title: 'Human & Social Capital',
                                desc: 'We recognize people as the foundation of long-term success. Our partnerships, communities, and teams are cultivated with empathy, collaboration, and respect for shared growth.'
                            },
                            {
                                title: 'Innovation & Sustainability',
                                desc: 'We integrate new technologies and eco-intelligent systems that enhance efficiency, resilience, and harmony with nature. Innovation is guided by intention, not trend.'
                            },
                            {
                                title: 'Cultural & Legacy Impact',
                                desc: 'Our portfolio reflects more than profit; it represents values, stories, and heritage. Each investment must create enduring cultural, environmental, and societal value that extends beyond our lifetime.'
                            }
                        ].concat([
                            // duplicate for seamless loop
                            {
                                title: 'Vision Alignment',
                                desc: 'All investments must serve a clear long-term vision rooted in purpose, cultural integrity, and financial growth. We invest in ideas and assets that contribute to sustainable prosperity and legacy creation.'
                            },
                            {
                                title: 'Governance & Integrity',
                                desc: 'Our reputation is our greatest asset. We operate under the highest ethical standards, ensuring transparency, compliance, and fairness in every negotiation, partnership, and fiduciary decision.'
                            }
                        ]).map((card, i) => (
                            <div key={i} className="fc-card p-6 md:p-8 w-[370px] shrink-0">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold">{card.title}</h3>
                                </div>
                                <p className="mt-2 text-neutral-600">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                    {/* Progressive translucent edges (no blur): transparent at margin, opaque at 20px */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-[20px] bg-gradient-to-r from-[var(--fc-sand)] to-transparent"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-[20px] bg-gradient-to-l from-[var(--fc-sand)] to-transparent"></div>
                </div>

                {/* Mobile: vertical scroll within fixed height, with translucent top/bottom fades */}
                <div className="md:hidden relative">
                    <div className="max-h-[600px] overflow-y-auto pr-1 pt-5">
                        {[
                            {
                                title: 'Vision Alignment',
                                desc: 'All investments must serve a clear long-term vision rooted in purpose, cultural integrity, and financial growth. We invest in ideas and assets that contribute to sustainable prosperity and legacy creation.'
                            },
                            {
                                title: 'Governance & Integrity',
                                desc: 'Our reputation is our greatest asset. We operate under the highest ethical standards, ensuring transparency, compliance, and fairness in every negotiation, partnership, and fiduciary decision.'
                            },
                            {
                                title: 'Capital Discipline',
                                desc: 'We allocate resources strategically, balancing ambition with accountability. Every investment decision follows rigorous due diligence, measured risk exposure, and responsible capital stewardship.'
                            },
                            {
                                title: 'Operational Excellence',
                                desc: 'Execution defines our value. We build, manage, and deliver with precision, ensuring every project meets world-class standards in design, quality, and sustainability.'
                            },
                            {
                                title: 'Human & Social Capital',
                                desc: 'We recognize people as the foundation of long-term success. Our partnerships, communities, and teams are cultivated with empathy, collaboration, and respect for shared growth.'
                            },
                            {
                                title: 'Innovation & Sustainability',
                                desc: 'We integrate new technologies and eco-intelligent systems that enhance efficiency, resilience, and harmony with nature. Innovation is guided by intention, not trend.'
                            },
                            {
                                title: 'Cultural & Legacy Impact',
                                desc: 'Our portfolio reflects more than profit; it represents values, stories, and heritage. Each investment must create enduring cultural, environmental, and societal value that extends beyond our lifetime.'
                            }
                        ].map((card, i) => (
                            <div key={i} className="fc-card p-6 md:p-8 mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold">{card.title}</h3>
                                </div>
                                <p className="mt-2 text-neutral-600">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                    {/* Top gradient: opaque 20px above margin, transparent at margin */}
                    <div className="pointer-events-none absolute inset-x-0 -top-px h-[20px] bg-gradient-to-b from-[var(--fc-sand)] to-transparent"></div>
                    {/* Bottom gradient: opaque 20px below margin, transparent at margin */}
                    <div className="pointer-events-none absolute inset-x-0 -bottom-px h-[20px] bg-gradient-to-t from-[var(--fc-sand)] to-transparent"></div>
                </div>
            </Section>







            {/* AVATARS / WHO WE SERVE */}
            <Section id="avatars">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">{t.avatars.title}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[{
                        title: t.avatars.legacy,
                        icon: <Users />,
                        bullets: lang === "en" ? ["Family security & multi‑gen planning", "Stable, tangible assets", "Spanish‑language diligence & private events"] : ["Seguridad familiar y planeación multigeneracional", "Activos tangibles y estables", "Diligencia en español y eventos privados"],
                    }, {
                        title: t.avatars.impact,
                        icon: <Leaf />,
                        bullets: lang === "en" ? ["ESG‑aligned real assets", "Transparent impact data", "Regenerative destinations & supply"] : ["Activos reales alineados a ESG", "Datos de impacto transparentes", "Destinos y cadenas regenerativas"],
                    }, {
                        title: t.avatars.nextgen,
                        icon: <Globe />,
                        bullets: lang === "en" ? ["Lifestyle + passive income", "Step‑by‑step cross‑border guidance", "Architectural villas & long‑stay demand"] : ["Estilo de vida + ingreso pasivo", "Guía transfronteriza paso a paso", "Villas arquitectónicas y estadías largas"],
                    }].map((a, i) => (
                        <div key={i} className="fc-card p-6 md:p-8">
                            <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--fc-forest)]/10 text-[var(--fc-forest)]">{a.icon}</div><h3 className="text-xl font-semibold">{a.title}</h3></div>
                            <ul className="mt-4 space-y-2 text-neutral-700 text-sm">
                                {a.bullets.map((b, bi) => (<li key={bi} className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {b}</li>))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ABOUT FELIX */}
            <Section id="about" tone="sand">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold">Felix Cisneros</h2>
                        <p className="mt-3 text-neutral-700">
                            {lang === "en"
                                ? "Felix began his work in Mexico in the field, walking the land, meeting notaries and city officials, and learning how real projects come to life. He saw how speculation erodes trust and time, and learned that disciplined structure protects both investors and communities. FC Capital Group grew from that lesson. Today we connect international investors with real estate and hospitality opportunities in Mexico, structured to institutional standards with clear governance, Investment Committee ready underwriting, and steady oversight. We are based in Tulum with a global lens, and we only work where we know the ground."
                                : "Felix comenzó su trabajo en México en campo: recorriendo tierra, conociendo notarios y autoridades, y entendiendo cómo nacen los proyectos reales. Vio cómo la especulación erosiona la confianza y el tiempo, y aprendió que la estructura disciplinada protege tanto a inversionistas como a comunidades. De esa lección nació FC Capital Group. Hoy conectamos inversionistas internacionales con oportunidades inmobiliarias y de hospitalidad en México, bajo estándares institucionales, gobernanza clara, underwriting listo para Comité de Inversión y supervisión constante. Con base en Tulum y mirada global, sólo trabajamos donde conocemos el terreno."}
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "10+ years in Mexican real estate & investments" : "10+ años en inmobiliario e inversiones en México"}</li>
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "Resilience, integrity, excellence" : "Resiliencia, integridad, excelencia"}</li>
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "Story‑driven advisory—purpose with performance" : "Asesoría con storytelling—propósito con rendimiento"}</li>
                        </ul>
                        <div className="mt-6 flex gap-3">
                            <a href="#contact" className="btn btn-primary"><Phone size={16} /> {lang === "en" ? "Speak with Felix" : "Hablar con Felix"}</a>
                            <a href="https://www.linkedin.com" className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 hover:bg-white/10" aria-label="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM0 8h5v15H0zM8 8h4.8v2.05h.07C13.62 8.59 15.29 7.5 17.6 7.5 22.2 7.5 23 10.46 23 14.34V23H18v-7.6c0-1.81-.03-4.14-2.52-4.14-2.52 0-2.91 1.97-2.91 4v7.74H8V8z" /></svg></a>
                            <a href="https://www.instagram.com" className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 hover:bg-white/10" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.35 3.608 1.325.975.975 1.263 2.242 1.325 3.608.058 1.266.07 1.646.07 4.834s-.012 3.568-.07 4.834c-.062 1.366-.35 2.633-1.325 3.608-.975.975-2.242 1.263-3.608 1.325-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.35-3.608-1.325-.975-.975-1.263-2.242-1.325-3.608C2.175 15.568 2.163 15.188 2.163 12s.012-3.568.07-4.834c.062-1.366.35-2.633 1.325-3.608C4.533 2.583 5.8 2.295 7.166 2.233 8.432 2.175 8.812 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.775.128 4.638.428 3.678 1.388 2.718 2.348 2.418 3.485 2.36 4.762 2.303 6.042 2.29 6.451 2.29 12c0 5.549.013 5.958.07 7.238.058 1.277.358 2.414 1.318 3.374.96.96 2.097 1.26 3.374 1.318C8.332 24.988 8.741 25 12 25s3.668-.012 4.948-.07c1.277-.058 2.414-.358 3.374-1.318.96-.96 1.26-2.097 1.318-3.374.058-1.28.07-1.689.07-7.238 0-5.549-.012-5.958-.07-7.238-.058-1.277-.358-2.414-1.318-3.374C19.362.428 18.225.128 16.948.07 15.668.012 15.259 0 12 0z" /><path d="M12 5.838A6.162 6.162 0 1 0 18.162 12 6.169 6.169 0 0 0 12 5.838zm0 10.162A4 4 0 1 1 16 12a4.005 4.005 0 0 1-4 4z" /><circle cx="18.406" cy="5.594" r="1.44" /></svg></a>
                        </div>
                    </div>
                    <div className="fc-card p-0 overflow-hidden">
                        <img src={FelixPortrait} alt="Felix Cisneros portrait" className="block w-full h-full object-cover" />
                    </div>
                </div>
            </Section>

            {/* PARTNER WITH US */}
            <Section id="partner">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">{t.partner.title}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[{
                        icon: <Lock />, title: t.partner.lp, bullets: lang === "en" ? ["Quarterly pipeline memos", "Co‑investment rights", "Data room access"] : ["Memos trimestrales", "Derechos de co‑inversión", "Acceso a data room"],
                    }, {
                        icon: <Handshake />, title: t.partner.coinv, bullets: lang === "en" ? ["Aligned theses", "Syndication", "Shared diligence"] : ["Tesis alineadas", "Sindicaciones", "Diligencia compartida"],
                    }, {
                        icon: <Building2 />, title: t.partner.dev, bullets: lang === "en" ? ["Capital introductions", "Structuring support", "Transparent terms"] : ["Introducción a capital", "Estructuración", "Términos transparentes"],
                    }].map((c, i) => (
                        <div key={i} className="fc-card p-6 md:p-8">
                            <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--fc-forest)]/10 text-[var(--fc-forest)]">{c.icon}</div><h3 className="text-xl font-semibold">{c.title}</h3></div>
                            <ul className="mt-4 space-y-2 text-neutral-700 text-sm">{c.bullets.map((b, bi) => (<li key={bi} className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {b}</li>))}</ul>
                            <a href="#contact" className="mt-5 inline-flex items-center text-[var(--fc-forest)] font-semibold">{t.partner.cta} <ArrowRight size={18} className="ml-2" /></a>
                        </div>
                    ))}
                </div>
            </Section>

            {/* INSIGHTS / RESOURCES */}
            <Section id="insights" tone="sand">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold">Insights</h2>
                        <p className="text-neutral-600 mt-2 max-w-2xl">{lang === "en" ? "Field notes, market data, and investor letters from across Mexico." : "Notas de campo, datos de mercado y cartas a inversionistas desde México."}</p>
                    </div>
                    <a href="#" className="btn btn-primary"><Download size={16} /> {lang === "en" ? "Download media kit" : "Descargar media kit"}</a>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {[{
                        title: lang === "en" ? "Tulum to Bacalar: blueprint for low‑impact destinations" : "De Tulum a Bacalar: plano para destinos de bajo impacto",
                        tag: "Eco‑tourism",
                    }, {
                        title: lang === "en" ? "Circular retrofits: cashflows from waste reduction" : "Retrofits circulares: flujo a partir de menos residuos",
                        tag: "Circular",
                    }, {
                        title: lang === "en" ? "Architectural villas that hold value" : "Villas arquitectónicas que sostienen valor",
                        tag: "Legacy",
                    }].map((a, i) => (
                        <article key={i} className="fc-card p-6 md:p-7">
                            <div className="text-xs uppercase tracking-wider opacity-70">{a.tag}</div>
                            <h3 className="mt-2 text-xl font-semibold">{a.title}</h3>
                            <p className="mt-2 text-neutral-700">{lang === "en" ? "A pragmatic playbook to balance demand, conservation, and returns." : "Un playbook pragmático para equilibrar demanda, conservación y retornos."}</p>
                            <a href="#" className="mt-4 inline-flex items-center text-[var(--fc-forest)] font-semibold">{lang === "en" ? "Read article" : "Leer artículo"} <ArrowRight size={18} className="ml-2" /></a>
                        </article>
                    ))}
                </div>
            </Section>

            {/* LOGIN */}
            <Section id="login">
                <div className="fc-card p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-extrabold">{lang === "en" ? "LP & Partner Access" : "Acceso LP y Aliados"}</h2>
                    <p className="text-neutral-600 mt-2">{lang === "en" ? "Request credentials to access the data room and live pipeline dashboards." : "Solicita credenciales para acceder al data room y tableros del pipeline."}</p>
                    <form className="mt-4 grid md:grid-cols-3 gap-3">
                        <input className="p-3 rounded-xl border" placeholder={lang === "en" ? "Work email" : "Correo corporativo"} />
                        <input className="p-3 rounded-xl border" placeholder={lang === "en" ? "Organization" : "Organización"} />
                        <button className="btn btn-primary w-full md:w-auto">{lang === "en" ? "Request access" : "Solicitar acceso"}</button>
                    </form>
                </div>
            </Section>

            {/* CONTACT */}
            <Section id="contact" tone="dark">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold">{t.contact.title}</h2>
                        <p className="text-white/85 mt-2 max-w-xl">{t.contact.subtitle}</p>
                        <div className="mt-6 space-y-3 text-white/85">
                            <div className="flex items-center gap-3"><Phone /><span>+52 (xxx) xxx‑xxxx</span></div>
                            <div className="flex items-center gap-3"><Mail /><span>felix@fccapital.group</span></div>
                            <div className="flex items-center gap-3"><MessageSquare /><span>WhatsApp link</span></div>
                        </div>
                    </div>
                    <form className="fc-card p-6 md:p-8 text-[var(--fc-charcoal)]">
                        <div className="grid md:grid-cols-2 gap-3">
                            <input className="p-3 rounded-xl border" placeholder={t.contact.name} required />
                            <input className="p-3 rounded-xl border" type="email" placeholder={t.contact.email} required />
                            <input className="p-3 rounded-xl border md:col-span-2" placeholder={t.contact.phone} />
                            <textarea className="p-3 rounded-xl border h-32 md:col-span-2" placeholder={t.contact.msg} />
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <button className="btn btn-primary">{t.contact.send}</button>
                            <a href="#" className="btn btn-outline text-[var(--fc-charcoal)] border-[var(--fc-stone)] hover:bg-[var(--fc-forest)]/5"><Download size={16} /> {lang === "en" ? "One‑pager" : "One‑pager"}</a>
                        </div>
                    </form>
                </div>
            </Section>

            {/* FOOTER */}
            <footer className="bg-[var(--fc-charcoal)] text-white pt-12 pb-8 border-t border-white/10">
                <div className="fc-container">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9"><img src={FCLogo} alt="FC Capital Group" className="h-9 w-9 object-contain" draggable={false} /></div>
                                <div>
                                    <div className="font-extrabold tracking-tight text-xl">FC CAPITAL GROUP</div>
                                    <div className="opacity-80 text-[11px]">BOUTIQUE INVESTMENT FIRM</div>
                                </div>
                            </div>
                            <p className="mt-3 text-white/80 text-sm max-w-xs">
                                {lang === "en" ? "Bridging investors with Mexico’s finest opportunities—secure, transparent, and purpose‑led." : "Puente hacia las mejores oportunidades de México—seguras, transparentes y con propósito."}
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="pill">Privacy</span>
                                <span className="pill">Cookies</span>
                                <span className="pill">Accessibility</span>
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold mb-3">{lang === "en" ? "Navigation" : "Navegación"}</div>
                            <ul className="space-y-2 text-white/80 text-sm">
                                <li><a href="#strategies" className="hover:underline">{t.nav.strategies}</a></li>
                                <li><a href="#portfolio" className="hover:underline">{t.nav.portfolio}</a></li>
                                <li><a href="#impact" className="hover:underline">{t.nav.impact}</a></li>
                                <li><a href="#insights" className="hover:underline">{t.nav.insights}</a></li>
                                <li><a href="#partner" className="hover:underline">{t.nav.partner}</a></li>
                                <li><a href="#login" className="hover:underline">{t.nav.login}</a></li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-semibold mb-3">{lang === "en" ? "Themes" : "Temas"}</div>
                            <ul className="space-y-2 text-white/80 text-sm">
                                <li>Eco‑tourism</li>
                                <li>Circular & Sustainable</li>
                                <li>Legacy Real Assets</li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-semibold mb-3">{lang === "en" ? "Contact" : "Contacto"}</div>
                            <ul className="space-y-2 text-white/80 text-sm">
                                <li className="flex gap-2 items-center"><Phone size={16} /> +52 (xxx) xxx‑xxxx</li>
                                <li className="flex gap-2 items-center"><Mail size={16} /> felix@fccapital.group</li>
                                <li className="flex gap-2 items-center"><MessageSquare size={16} /> WhatsApp</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10 text-white/70 text-sm">
                        <p>{t.footer.disclaimer}</p>
                        <p className="mt-2">© {new Date().getFullYear()} FC Capital Group. {t.footer.rights}</p>
                    </div>
                </div>
            </footer>

            {/* Floating language toggle */}
            {/* Floating brand guide toggle */}
            <button
                onClick={() => setShowBrandGuide((v) => !v)}
                title="Brand guide"
                aria-label="Brand guide"
                className="fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full bg-white text-[var(--fc-forest)] border border-[var(--fc-stone)] shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--fc-gold)] flex items-center justify-center"
            >
                <Palette size={20} />
            </button>

            <AnimatePresence>
                {showBrandGuide && (
                    <motion.div
                        className="fixed bottom-24 right-24 z-50 overflow-hidden"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 560, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    >
                        <div className="fc-card p-4 md:p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-semibold">Brand Guide</div>
                                <button
                                    className="pill text-[var(--fc-charcoal)]"
                                    onClick={() => setShowBrandGuide(false)}
                                >
                                    Close
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[{
                                    name: 'Main Green', cssVar: '--fc-forest', hex: '#213c2b'
                                }, {
                                    name: 'Main Light', cssVar: '--fc-stone', hex: '#d9d3cb'
                                }, {
                                    name: 'Main Blue', cssVar: '--fc-blue', hex: '#21325e'
                                }, {
                                    name: 'Accent Brown', cssVar: '--fc-brown', hex: '#38322a'
                                }, {
                                    name: 'Accent Sand', cssVar: '--fc-sand', hex: '#efe7db'
                                }, {
                                    name: 'Accent Beige', cssVar: '--fc-beige', hex: '#f9dcba'
                                }].map((c, i) => (
                                    <div key={i} className="fc-card p-3">
                                        <div className="rounded-lg h-14 w-full border" style={{ background: `var(${c.cssVar})`, borderColor: 'rgba(0,0,0,0.06)' }} />
                                        <div className="mt-2">
                                            <div className="text-sm font-semibold">{c.name}</div>
                                            <div className="text-xs text-neutral-600">var({c.cssVar})</div>
                                            <div className="text-xs text-neutral-600">{c.hex}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setLang(lang === "en" ? "es" : "en")}
                title="Switch language"
                aria-label="Switch language"
                className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-[var(--fc-forest)] text-white shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--fc-gold)] flex items-center justify-center"
            >
                <Languages size={20} />
            </button>

            <LeavingSiteModal
                url={leavingUrl}
                onClose={() => setLeavingUrl("")}
                onContinue={(u) => {
                    setLeavingUrl("");
                    window.open(u, "_blank");
                }}
            />
        </div>
    );
}

