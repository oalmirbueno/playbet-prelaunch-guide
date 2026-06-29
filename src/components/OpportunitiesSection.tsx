import { motion } from "framer-motion";
import { ArrowRight, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { useOpportunities, trackOpportunityClick, type Opportunity } from "@/hooks/useOpportunities";

type Cat = "sports" | "casino" | "offer" | "guide";

const normalizeCategory = (c: string | null | undefined): Cat => {
  const v = (c || "").toLowerCase();
  if (v === "casino") return "casino";
  if (v === "offer" || v === "oferta" || v === "promo") return "offer";
  if (v === "guide" || v === "guia") return "guide";
  return "sports";
};

const SECTION_TITLES: Record<Cat, { eyebrow: string; title: string; highlight: string; disclaimer: string }> = {
  sports: {
    eyebrow: "Ao vivo agora",
    title: "Odds em",
    highlight: "destaque",
    disclaimer: "Odds podem mudar. Confira na casa antes de apostar. +18.",
  },
  casino: {
    eyebrow: "Em alta agora",
    title: "Jogos em",
    highlight: "destaque",
    disclaimer: "Jogue com responsabilidade. +18.",
  },
  offer: {
    eyebrow: "Selecionadas hoje",
    title: "Ofertas",
    highlight: "oficiais",
    disclaimer: "Condições podem variar. Confira na casa parceira. +18.",
  },
  guide: {
    eyebrow: "Para começar bem",
    title: "Guias",
    highlight: "rápidos",
    disclaimer: "Conteúdo informativo. Jogue com responsabilidade. +18.",
  },
};

const CARD_COPY: Record<Cat, { badge: string; cta: string; primaryMeta: (op: Opportunity) => string | null; secondaryMeta: (op: Opportunity) => string | null; showOdd: (op: Opportunity) => boolean; oddCaption: string }> = {
  sports: {
    badge: "Odd em destaque",
    cta: "Conferir odd",
    primaryMeta: (op) => op.event_name,
    secondaryMeta: (op) => (op.market_name ? `Mercado: ${op.market_name}` : "Mercado simples"),
    showOdd: (op) => !!op.odd_label,
    oddCaption: "Odd em destaque",
  },
  casino: {
    badge: "Jogo em destaque",
    cta: "Ver na casa",
    primaryMeta: (op) => op.event_name, // jogo
    secondaryMeta: (op) => op.market_name, // provedor/tipo
    showOdd: () => false,
    oddCaption: "",
  },
  offer: {
    badge: "Oferta oficial",
    cta: "Resgatar oferta",
    primaryMeta: (op) => op.event_name,
    secondaryMeta: (op) => op.market_name,
    showOdd: (op) => !!op.odd_label,
    oddCaption: "Destaque",
  },
  guide: {
    badge: "Guia rápido",
    cta: "Ler guia",
    primaryMeta: (op) => op.event_name,
    secondaryMeta: (op) => op.market_name,
    showOdd: () => false,
    oddCaption: "",
  },
};

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-3">
    {[0, 1, 2].map((i) => (
      <div key={i} className="h-32 rounded-2xl border border-border bg-card/60 animate-pulse" />
    ))}
  </div>
);

const Card = ({ op, onClick }: { op: Opportunity; onClick: () => void }) => {
  const cat = normalizeCategory(op.category);
  const copy = CARD_COPY[cat];
  const hasUrl = !!op.destination_url;
  const ctaLabel = op.cta_label || copy.cta;
  const badgeLabel = op.badge || copy.badge;
  const primary = copy.primaryMeta(op);
  const secondary = copy.secondaryMeta(op);
  const showOdd = copy.showOdd(op);

  const Tag: any = hasUrl ? "button" : "div";

  return (
    <Tag
      type={hasUrl ? "button" : undefined}
      onClick={hasUrl ? onClick : undefined}
      aria-disabled={!hasUrl}
      className={`group relative w-full text-left overflow-hidden rounded-2xl border bg-card/90 backdrop-blur p-4 shadow-[0_6px_24px_hsl(0_0%_0%/0.35)] transition-all ${
        hasUrl
          ? "border-border hover:border-accent/60 active:scale-[0.99] cursor-pointer"
          : "border-border/50 opacity-70 cursor-not-allowed"
      }`}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-[#FFDF00]" />

      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 border border-accent/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-accent">
          <Flame className="w-3 h-3" /> {badgeLabel}
        </span>
        {showOdd && op.odd_label && (
          <div className="flex flex-col items-end leading-none">
            <span className="font-stadium text-2xl font-black text-accent">{op.odd_label}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">
              {copy.oddCaption}
            </span>
          </div>
        )}
      </div>

      {op.title && (
        <h3 className="font-stadium text-xl uppercase text-foreground leading-tight mb-1">{op.title}</h3>
      )}
      {op.subtitle && (
        <p className="text-muted-foreground text-xs mb-2 leading-snug line-clamp-2">{op.subtitle}</p>
      )}

      {(primary || secondary) && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
          {primary && (
            <span className="rounded-md bg-primary/30 border border-border px-2 py-0.5 text-foreground/90">
              {primary}
            </span>
          )}
          {secondary && (
            <span className="rounded-md bg-background/60 border border-border px-2 py-0.5 text-foreground/80">
              {secondary}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-border/60 mt-2">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="w-3 h-3 text-accent" /> Selecionado pela PlayBet
        </span>
        <span
          className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider ${
            hasUrl ? "text-accent group-hover:translate-x-0.5 transition-transform" : "text-muted-foreground"
          }`}
        >
          {hasUrl ? ctaLabel : "Em breve"} {hasUrl && <ArrowRight className="w-3.5 h-3.5" />}
        </span>
      </div>
    </Tag>
  );
};

interface Props {
  limit?: number;
}

const OpportunitiesSection = ({ limit = 3 }: Props) => {
  const { data, isLoading, isError } = useOpportunities(limit);

  if (isError) return null;
  if (!isLoading && (!data || data.length === 0)) return null;

  const handleClick = async (op: Opportunity) => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    await trackOpportunityClick(op, ref);
    if (op.destination_url) {
      window.location.assign(op.destination_url);
    }
  };

  const items = (data ?? []).slice(0, 3);
  const dominantCat = normalizeCategory(items[0]?.category);
  const section = SECTION_TITLES[dominantCat];

  return (
    <motion.section
      className="w-full max-w-lg mx-auto mb-8 md:mb-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 mb-2">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">
              {section.eyebrow}
            </span>
          </div>
          <h2 className="font-stadium text-3xl md:text-4xl uppercase text-foreground leading-none">
            {section.title} <span className="text-accent">{section.highlight}</span>
          </h2>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((op) => (
            <Card key={op.id} op={op} onClick={() => handleClick(op)} />
          ))}
        </div>
      )}

      <p className="text-[10px] leading-relaxed text-muted-foreground/80 mt-3 text-center px-2">
        {section.disclaimer}
      </p>
    </motion.section>
  );
};

export default OpportunitiesSection;
