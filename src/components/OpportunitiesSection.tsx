import { motion } from "framer-motion";
import { ArrowRight, Flame, ShieldCheck, Sparkles, Trophy, Dices, Gift, BookOpen } from "lucide-react";
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
    disclaimer: "Odds podem mudar. Confira na casa antes de apostar. +18. Jogue com responsabilidade.",
  },
  casino: {
    eyebrow: "Em alta agora",
    title: "Jogos em",
    highlight: "destaque",
    disclaimer: "Condições podem variar. +18. Jogue com responsabilidade.",
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

const CARD_COPY: Record<Cat, {
  badge: string;
  cta: string;
  primaryMeta: (op: Opportunity) => string | null;
  secondaryMeta: (op: Opportunity) => string | null;
  showOdd: (op: Opportunity) => boolean;
  oddCaption: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  sports: {
    badge: "Odd em destaque",
    cta: "Conferir odd",
    primaryMeta: (op) => op.event_name,
    secondaryMeta: (op) => (op.market_name ? `Mercado: ${op.market_name}` : "Mercado simples"),
    showOdd: (op) => !!op.odd_label,
    oddCaption: "Odd em destaque",
    tag: "Sports",
    icon: Trophy,
  },
  casino: {
    badge: "Jogo em destaque",
    cta: "Ver jogo",
    primaryMeta: (op) => op.event_name,
    secondaryMeta: (op) => op.market_name,
    showOdd: () => false,
    oddCaption: "",
    tag: "Cassino",
    icon: Dices,
  },
  offer: {
    badge: "Oferta oficial",
    cta: "Resgatar oferta",
    primaryMeta: (op) => op.event_name,
    secondaryMeta: (op) => op.market_name,
    showOdd: (op) => !!op.odd_label,
    oddCaption: "Destaque",
    tag: "Oferta",
    icon: Gift,
  },
  guide: {
    badge: "Guia rápido",
    cta: "Ler guia",
    primaryMeta: (op) => op.event_name,
    secondaryMeta: (op) => op.market_name,
    showOdd: () => false,
    oddCaption: "",
    tag: "Guia",
    icon: BookOpen,
  },
};

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-3">
    {[0, 1, 2].map((i) => (
      <div key={i} className="h-44 rounded-2xl border border-border bg-card/60 animate-pulse" />
    ))}
  </div>
);

const getImage = (op: Opportunity) =>
  (op as any).image_url || (op as any).banner_url || (op as any).thumbnail_url || null;

const ImageOrFallback = ({ op, cat }: { op: Opportunity; cat: Cat }) => {
  const src = getImage(op);
  const Icon = CARD_COPY[cat].icon;

  if (src) {
    return (
      <div className="relative h-32 w-full overflow-hidden bg-background">
        <img
          src={src}
          alt={op.title || op.event_name || "Destaque"}
          loading="lazy"
          decoding="async"
          width={800}
          height={320}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => ((e.currentTarget.style.display = "none"))}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-primary/40 via-card to-background flex items-center justify-center">
      <div className="absolute inset-0 pitch-grid opacity-30" />
      <Icon className="relative w-10 h-10 text-accent/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
    </div>
  );
};

const Card = ({ op, onClick, showTag }: { op: Opportunity; onClick: () => void; showTag: boolean }) => {
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
      className={`group relative w-full text-left overflow-hidden rounded-2xl border bg-card/90 backdrop-blur shadow-[0_6px_24px_hsl(0_0%_0%/0.35)] transition-all ${
        hasUrl
          ? "border-border hover:border-accent/60 active:scale-[0.99] cursor-pointer"
          : "border-border/50 opacity-70 cursor-not-allowed"
      }`}
    >
      <ImageOrFallback op={op} cat={cat} />

      {/* Top-left badge floating over image */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-accent-foreground shadow-md">
          <Flame className="w-3 h-3" /> {badgeLabel}
        </span>
        {showTag && (
          <span className="inline-flex items-center rounded-full bg-background/80 backdrop-blur border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground/90">
            {copy.tag}
          </span>
        )}
      </div>

      {showOdd && op.odd_label && (
        <div className="absolute top-2 right-2 flex flex-col items-end leading-none rounded-lg bg-background/85 backdrop-blur border border-accent/40 px-2 py-1">
          <span className="font-stadium text-xl font-black text-accent">{op.odd_label}</span>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground mt-0.5">
            {copy.oddCaption}
          </span>
        </div>
      )}

      <div className="p-4 pt-3">
        {op.title && (
          <h3 className="font-stadium text-xl uppercase text-foreground leading-tight mb-1 line-clamp-2">
            {op.title}
          </h3>
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

        <div className="flex items-center justify-between pt-2 border-t border-border/60">
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
  const hasMixedCategories =
    new Set(items.map((o) => normalizeCategory(o.category))).size > 1;

  return (
    <motion.section
      className="w-full max-w-lg mx-auto mb-10 md:mb-14"
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
          <p className="text-muted-foreground text-xs mt-2 max-w-sm">
            Curadoria da PlayBet. Confira tudo na casa parceira antes de decidir.
          </p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((op) => (
            <Card key={op.id} op={op} onClick={() => handleClick(op)} showTag={hasMixedCategories} />
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
