import React, { useMemo, useState, useEffect } from "react";
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
    Building2,
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
      --fc-forest:#0f2f27;         /* deep green */
      --fc-forest-2:#133b31;       /* alt deep green */
      --fc-sage:#2f6b5a;           /* sage accent for UI */
      --fc-sand:#efe7db;           /* warm beige background */
      --fc-stone:#d6cec2;          /* light stone */
      --fc-gold:#c9a96a;           /* restrained gold accent */
      --fc-gold-600:#b6924a;
      --fc-maya:#2c2a1f;           /* subtle Mayan motif color */
    }
    .fc-container{max-width:1200px;margin-inline:auto;padding-inline:1rem}
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
    .btn{display:inline-flex;align-items:center;gap:.5rem;border-radius:9999px;padding:.75rem 1.1rem;font-weight:600}
    .btn-primary{background:var(--fc-gold);color:#1b1b1b}
    .btn-primary:hover{background:var(--fc-gold-600)}
    .btn-outline{border:1px solid var(--fc-stone);color:white}
    .btn-outline:hover{border-color:#fff;background:rgba(255,255,255,.06)}
    .pill{border:1px solid rgba(255,255,255,.2);padding:.35rem .7rem;border-radius:9999px;font-size:.85rem}
    .chip{border:1px solid #e6e6e6;border-radius:9999px;padding:.35rem .7rem;font-size:.8rem}
    .kbd{background:#111;color:#f9f9f9;border-radius:.5rem;padding:.1rem .4rem;border:1px solid #333}
    .link-soft{color:var(--fc-gold)}
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
            h1: "Bridging capital with Mexico’s finest opportunities",
            subtitle:
                "Off‑market land, hospitality, and programmatic JVs with governance, title, and entitlements prepared for IC.",
            cta1: "Connect With Us",
            cta2: "Submit a project",
        },
        pillars: {
            title: "What we stand for",
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
    const t = useMemo(() => i18n[lang], [lang]);
    const [filter, setFilter] = useState("all");
    const [leavingUrl, setLeavingUrl] = useState("");

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

    return (
        <div className="min-h-screen text-[var(--fc-ink)] bg-white">
            <BrandCSS />

            {/* HEADER */}
            <header className="sticky top-0 z-40 bg-[var(--fc-forest)]/80 fc-blur text-white border-b border-white/10">
                <div className="fc-container flex items-center justify-between py-3">
                    <a href="#home" className="flex items-center gap-3 group">
                        <div className="h-9 w-9">
                            <img src={FCLogo} alt="FC Capital Group" className="h-9 w-9 object-contain" draggable={false} />
                        </div>
                        <div>
                            <div className="font-extrabold tracking-tight">FC CAPITAL GROUP</div>
                        </div>
                    </a>

                    <nav className="hidden md:flex items-center gap-6 text-sm">
                        <a href="#strategies" className="hover:opacity-100 opacity-90">
                            {t.nav.strategies}
                        </a>
                        <a href="#portfolio" className="hover:opacity-100 opacity-90">
                            {t.nav.portfolio}
                        </a>
                        <a href="#impact" className="hover:opacity-100 opacity-90">
                            {t.nav.impact}
                        </a>
                        <a href="#insights" className="hover:opacity-100 opacity-90">
                            {t.nav.insights}
                        </a>
                        <a href="#about" className="hover:opacity-100 opacity-90">
                            {t.nav.team}
                        </a>
                        <a href="#partner" className="hover:opacity-100 opacity-90">
                            {t.nav.partner}
                        </a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <a href="#login" className="btn btn-outline">
                            <Lock size={16} /> {t.nav.login}
                        </a>
                        <a href="#contact" className="btn btn-primary">
                            <Phone size={16} /> {lang === "en" ? "WhatsApp" : "WhatsApp"}
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <Section id="home" tone="dark" className="relative overflow-hidden">
                <div className="absolute inset-0 fc-hero-pattern opacity-40 pointer-events-none" />
                <div className="fc-container grid md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7">

                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            {t.hero.h1}
                        </h1>
                        <p className="mt-4 text-lg text-white/85 max-w-2xl">
                            {t.hero.subtitle}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href="#contact" className="btn btn-primary">
                                {t.hero.cta1} <ArrowRight size={18} />
                            </a>
                            <a href="#partner" className="btn btn-outline">
                                {t.hero.cta2}
                            </a>
                        </div>
                        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                            <StatTile label={lang === "en" ? "Years in market" : "Años en el mercado"} value="10+" />
                            <StatTile label={lang === "en" ? "Off‑market deals" : "Oportunidades off‑market"} value="70+" />
                            <StatTile label={lang === "en" ? "Cities in MX" : "Ciudades en MX"} value="12" />
                        </div>
                    </div>
                    <div className="md:col-span-5">
                        <div className="fc-card p-6 md:p-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--fc-sand)] text-[var(--fc-forest)]">
                                    <Landmark />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--fc-charcoal)]">
                                    {lang === "en" ? "Invest in Mexico with Clarity" : "Invierte en México con Claridad"}
                                </h3>
                            </div>
                            <p className="mt-4 text-neutral-700">
                                {lang === "en"
                                    ? "We align international investors with trusted operators and underwrite opportunities to institutional standards, from early land and income properties to boutique hospitality. The focus is simple: transparent terms, resilient structures, and results you can measure. If you are ready to diversify with purpose and build something that lasts, let’s connect."
                                    : "Alineamos a inversionistas internacionales con operadores confiables y llevamos las oportunidades a estándares institucionales, desde terreno temprano y activos con renta hasta hospitalidad boutique. El enfoque es simple: términos transparentes, estructuras resilientes y resultados medibles. Si deseas diversificar con propósito y construir algo que perdure, hablemos."}
                            </p>
                            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                                <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-[var(--fc-gold)] mt-0.5 flex-none h-4.5 w-4.5" /> {lang === "en" ? "Cross-border execution and clear, bilingual documentation" : "Ejecución transfronteriza y documentación bilingüe clara"}</li>
                                <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-[var(--fc-gold)] mt-0.5 flex-none h-4.5 w-4.5" /> {lang === "en" ? "Discipline from diligence through post-close oversight" : "Disciplina desde la diligencia hasta el seguimiento post-cierre"}</li>
                                <li className="flex gap-2 items-start"><CheckCircle2 size={18} className="text-[var(--fc-gold)] mt-0.5 flex-none h-4.5 w-4.5" /> {lang === "en" ? "Purpose and performance with measurable outcomes" : "Propósito y rendimiento con métricas verificables"}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Section>

            {/* PILLARS */}
            <Section id="principles" tone="sand">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">{t.pillars.title}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[{
                        icon: <ShieldCheck className="text-[var(--fc-forest)]" />,
                        title: t.pillars.p1,
                        desc: t.pillars.p1d,
                    }, {
                        icon: <Star className="text-[var(--fc-forest)]" />,
                        title: t.pillars.p2,
                        desc: t.pillars.p2d,
                    }, {
                        icon: <Handshake className="text-[var(--fc-forest)]" />,
                        title: t.pillars.p3,
                        desc: t.pillars.p3d,
                    }].map((card, i) => (
                        <div key={i} className="fc-card p-6 md:p-8">
                            <div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--fc-stone)]/40">{card.icon}</div>
                            <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
                            <p className="mt-2 text-neutral-600">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* STRATEGIES */}
            <Section id="strategies">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2">{t.strategies.title}</h2>
                <p className="text-neutral-600 max-w-2xl mb-8">
                    {lang === "en"
                        ? "Three complementary pillars designed for security, purpose, and durable returns across Mexico."
                        : "Tres pilares complementarios diseñados para seguridad, propósito y retornos duraderos en México."}
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    {[{
                        icon: <Leaf />,
                        title: t.strategies.s1.name,
                        desc: t.strategies.s1.desc,
                        tags: t.strategies.s1.tags,
                        bg: "bg-[var(--fc-sand)]",
                    }, {
                        icon: <Recycle />,
                        title: t.strategies.s2.name,
                        desc: t.strategies.s2.desc,
                        tags: t.strategies.s2.tags,
                        bg: "bg-white",
                    }, {
                        icon: <Building2 />,
                        title: t.strategies.s3.name,
                        desc: t.strategies.s3.desc,
                        tags: t.strategies.s3.tags,
                        bg: "bg-white",
                    }].map((s, i) => (
                        <div key={i} className={`fc-card p-6 md:p-8 border border-[var(--fc-stone)]/60 ${s.bg}`}>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg grid place-items-center bg-[var(--fc-forest)]/10 text-[var(--fc-forest)]">{s.icon}</div>
                                <h3 className="text-xl font-semibold">{s.title}</h3>
                            </div>
                            <p className="mt-3 text-neutral-700">{s.desc}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {s.tags.map((tg) => (
                                    <span key={tg} className="chip">{tg}</span>
                                ))}
                            </div>
                            <a href="#portfolio" className="mt-5 inline-flex items-center text-[var(--fc-forest)] font-semibold">
                                {lang === "en" ? "View opportunities" : "Ver oportunidades"} <ArrowRight size={18} className="ml-2" />
                            </a>
                        </div>
                    ))}
                </div>
            </Section>

            {/* PORTFOLIO */}
            <Section id="portfolio" tone="sand">
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold">{t.portfolio.title}</h2>
                        <p className="text-neutral-600 mt-2 max-w-2xl">
                            {lang === "en"
                                ? "Curated pipeline and representative case studies. Full data room on request."
                                : "Pipeline curado y casos representativos. Data room completo bajo solicitud."}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {Object.entries(t.portfolio.filters).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`chip ${filter === key ? "bg-[var(--fc-gold)]/90 text-[var(--fc-maya)] border-[var(--fc-gold)]" : ""}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {filtered.map((p) => (
                        <div key={p.id} className="fc-card p-6 md:p-7 flex flex-col">
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <MapPin size={16} /> {p.region}
                                <span className="mx-2">•</span>
                                <span>{p.stage}</span>
                            </div>
                            <h3 className="mt-2 text-xl font-semibold">{p.title}</h3>
                            <p className="mt-2 text-neutral-700 flex-1">{p.desc}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-neutral-600">{p.kpi}</span>
                                <a href="#contact" className="btn btn-primary text-sm">{lang === "en" ? "Open deck" : "Abrir deck"}</a>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* IMPACT */}
            <Section id="impact" tone="dark" className="fc-gradient">
                <div className="flex items-center gap-3 mb-4 text-[var(--fc-charcoal)]"><h2 className="text-3xl md:text-4xl font-extrabold text-[var(--fc-charcoal)]">{t.impact.title}</h2></div>
                <p className="max-w-2xl text-neutral-700">{t.impact.subtitle}</p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="fc-card p-6">
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={kpiSeries} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
                                    <defs>
                                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#c9a96a" stopOpacity={0.7} />
                                            <stop offset="100%" stopColor="#c9a96a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                                    <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="hectares" stroke="#c9a96a" fill="url(#g1)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            {t.impact.kpis.map((k) => (
                                <div key={k.key} className="text-center">
                                    <div className="text-2xl font-bold text-[var(--fc-gold)]">{kpiSeries[kpiSeries.length - 1][k.key]}</div>
                                    <div className="text-xs text-neutral-600">{k.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="fc-card p-6">
                        <h3 className="text-xl font-semibold">{lang === "en" ? "Methodology (summary)" : "Metodología (resumen)"}</h3>
                        <ul className="mt-3 space-y-2 text-neutral-700 text-sm">
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "Baselines by asset type (energy, water, biodiversity, jobs)" : "Líneas base por tipo de activo (energía, agua, biodiversidad, empleos)"}</li>
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "Additionality & leakage tests on upgrades and concessions" : "Pruebas de adicionalidad y fugas en mejoras y concesiones"}</li>
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "Annual assurance with third‑party partners" : "Aseguramiento anual con terceros"}</li>
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "Public dashboard & PDF reports" : "Dashboard público y reportes PDF"}</li>
                        </ul>
                        <div className="mt-5 flex gap-3">
                            <a href="#" className="btn btn-primary"><Download size={16} /> {lang === "en" ? "Download sample report" : "Descargar reporte de muestra"}</a>
                            <a href="#insights" className="btn btn-outline">{lang === "en" ? "View insights" : "Ver ideas"}</a>
                        </div>
                    </div>
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
                                ? "Ambitious and resilient, Felix built FC Capital Group to bridge global capital with Mexico’s finest, purpose‑led opportunities. More than sales—he crafts assets and partnerships that create lasting value for investors, communities, and future generations."
                                : "Ambicioso y resiliente, Felix creó FC Capital Group para tender un puente entre el capital global y las mejores oportunidades con propósito en México. Más que ventas: construye activos y alianzas que generan valor duradero para inversionistas, comunidades y futuras generaciones."}
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "10+ years in Mexican real estate & investments" : "10+ años en inmobiliario e inversiones en México"}</li>
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "Resilience, integrity, excellence" : "Resiliencia, integridad, excelencia"}</li>
                            <li className="flex gap-2"><CheckCircle2 className="text-[var(--fc-gold)]" /> {lang === "en" ? "Story‑driven advisory—purpose with performance" : "Asesoría con storytelling—propósito con rendimiento"}</li>
                        </ul>
                        <div className="mt-6 flex gap-3">
                            <a href="#contact" className="btn btn-primary"><Phone size={16} /> {lang === "en" ? "Speak with Felix" : "Hablar con Felix"}</a>
                            <a href="https://www.linkedin.com" className="btn btn-outline"><ExternalLink size={16} /> LinkedIn</a>
                            <a href="https://www.instagram.com" className="btn btn-outline"><ExternalLink size={16} /> Instagram</a>
                        </div>
                    </div>
                    <div className="fc-card p-6 md:p-8">
                        <div className="text-sm uppercase tracking-wide text-neutral-500">{lang === "en" ? "Guiding beliefs" : "Creencias guía"}</div>
                        <blockquote className="mt-3 text-xl font-semibold">
                            “{lang === "en" ? "Persistence beats resistance—bridging investors with Mexico’s finest opportunities." : "La persistencia vence la resistencia—tendemos un puente entre inversionistas y las mejores oportunidades de México."}”
                        </blockquote>
                        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                            <div className="p-4 rounded-xl border border-[var(--fc-stone)]/60"><div className="font-semibold">{lang === "en" ? "Clarity" : "Claridad"}</div><p className="text-neutral-600 mt-1">{lang === "en" ? "Simple structures, transparent terms." : "Estructuras simples, términos transparentes."}</p></div>
                            <div className="p-4 rounded-xl border border-[var(--fc-stone)]/60"><div className="font-semibold">{lang === "en" ? "Purpose" : "Propósito"}</div><p className="text-neutral-600 mt-1">{lang === "en" ? "Investments that build legacy and community." : "Inversiones que construyen legado y comunidad."}</p></div>
                            <div className="p-4 rounded-xl border border-[var(--fc-stone)]/60"><div className="font-semibold">{lang === "en" ? "Excellence" : "Excelencia"}</div><p className="text-neutral-600 mt-1">{lang === "en" ? "Discipline from underwriting to operations." : "Disciplina del underwriting a la operación."}</p></div>
                            <div className="p-4 rounded-xl border border-[var(--fc-stone)]/60"><div className="font-semibold">{lang === "en" ? "Integrity" : "Integridad"}</div><p className="text-neutral-600 mt-1">{lang === "en" ? "Truth over hype; relationships first." : "Verdad sobre hype; relaciones primero."}</p></div>
                        </div>
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
                    <form className="fc-card p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-3">
                            <input className="p-3 rounded-xl border" placeholder={t.contact.name} required />
                            <input className="p-3 rounded-xl border" type="email" placeholder={t.contact.email} required />
                        </div>
                        <input className="p-3 rounded-xl border mt-3" placeholder={t.contact.phone} />
                        <textarea className="p-3 rounded-xl border mt-3 h-32" placeholder={t.contact.msg} />
                        <div className="flex items-center gap-3 mt-4">
                            <button className="btn btn-primary">{t.contact.send}</button>
                            <a href="#" className="btn btn-outline"><Download size={16} /> {lang === "en" ? "One‑pager" : "One‑pager"}</a>
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
                                    <div className="font-extrabold tracking-tight">FC CAPITAL GROUP</div>
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

