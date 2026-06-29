import { motion } from "framer-motion";
import { ArrowRight, Flame, ShieldCheck, Sparkles, Trophy, Dices, Gift, BookOpen, Clock, Radio } from "lucide-react";
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

const ICON_BY_CAT: Record<Cat, React.ComponentType<{ className?: string }>> = {
  sports: Trophy,
  casino: Dices,
  offer: Gift,
  guide: BookOpen,
};

const CTA_BY_CAT: Record<Cat, string> = {
  sports: "Conferir odd",
  casino: "Ver jogo",
  offer: "Resgatar oferta",
  guide: "Ler guia",
};

const BADGE_BY_CAT: Record<Cat, string> = {
  sports: "Odd em destaque",
  casino: "Jogo em destaque",
  offer: "Oferta oficial",
  guide: "Guia rápido",
};

// ---------- helpers ----------

const getMeta = (op: Opportunity) => (op.metadata || {}) as NonNullable<Opportunity["metadata"]>;

const getImage = (op: Opportunity): string | null => {
  const m: any = getMeta(op);
  return (
    (op as any).image_url ||
    (op as any).banner_url ||
    (op as any).thumbnail_url ||
    m?.media?.image_url ||
    m?.image_url ||
    null
  );
};

const getImageAlt = (op: Opportunity): string => {
  const m: any = getMeta(op);
  return m?.media?.image_alt || m?.image_alt || op.title || op.event_name || "Destaque";
};

const getHouseName = (op: Opportunity): string | null => {
  const m: any = getMeta(op);
  return (op as any).house_name || m?.house?.name || null;
};

const formatTime = (iso?: string | null): string | null => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  } catch {
    return null;
  }
};

// Build a stable event key (so several opps of same match group together)
const eventKey = (op: Opportunity): string | null => {
  const m: any = getMeta(op);
  const ev = m?.event;
  if (ev?.home_team && ev?.away_team) {
    return `${ev.home_team}__${ev.away_team}`.toLowerCase();
  }
  if (ev?.name) return ev.name.toLowerCase();
  if (op.event_name) return op.event_name.toLowerCase();
  return null;
};

// ---------- skeleton ----------

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-3">
    {[0, 1].map((i) => (
      <div key={i} className="h-44 rounded-2xl border border-border bg-card/60 animate-pulse" />
    ))}
  </div>
);

// ---------- single card (non-grouped) ----------

const SingleCard = ({
  op,
  onClick,
  showTag,
}: {
  op: Opportunity;
  onClick: () => void;
  showTag: boolean;
}) => {
  const cat = normalizeCategory(op.category);
  const hasUrl = !!op.destination_url;
  const ctaLabel = op.cta_label || CTA_BY_CAT[cat];
  const badgeLabel = op.badge || BADGE_BY_CAT[cat];
  const Icon = ICON_BY_CAT[cat];
  const src = getImage(op);
  const house = getHouseName(op);
  const showOdd = (cat === "sports" || cat === "offer") && !!op.odd_label;

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
      {src ? (
        <div className="relative h-32 w-full overflow-hidden bg-background">
          <img
            src={src}
            alt={getImageAlt(op)}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        </div>
      ) : (
        <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-primary/40 via-card to-background flex items-center justify-center">
          <div className="absolute inset-0 pitch-grid opacity-30" />
          <Icon className="relative w-10 h-10 text-accent/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>
      )}

      <div className="absolute top-2 left-2 right-2 flex items-center gap-1.5 flex-wrap pr-16">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-accent-foreground shadow-md max-w-full truncate">
          <Flame className="w-3 h-3 shrink-0" /> <span className="truncate">{badgeLabel}</span>
        </span>
        {showTag && (
          <span className="inline-flex items-center rounded-full bg-background/80 backdrop-blur border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground/90">
            {cat}
          </span>
        )}
      </div>

      {showOdd && op.odd_label && (
        <div className="absolute top-2 right-2 flex flex-col items-end leading-none rounded-lg bg-background/85 backdrop-blur border border-accent/40 px-2 py-1">
          <span className="font-stadium text-xl font-black text-accent">{op.odd_label}</span>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground mt-0.5">
            Odd em destaque
          </span>
        </div>
      )}

      <div className="p-4 pt-3 min-w-0">
        {op.title && (
          <h3 className="font-stadium text-lg sm:text-xl uppercase text-foreground leading-tight mb-1 line-clamp-2 break-words">
            {op.title}
          </h3>
        )}
        {op.subtitle && (
          <p className="text-muted-foreground text-xs mb-2 leading-snug line-clamp-2 break-words">{op.subtitle}</p>
        )}

        {(op.event_name || op.market_name || house) && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] min-w-0">
            {op.event_name && (
              <span className="max-w-full truncate rounded-md bg-primary/30 border border-border px-2 py-0.5 text-foreground/90">
                {op.event_name}
              </span>
            )}
            {op.market_name && (
              <span className="max-w-full truncate rounded-md bg-background/60 border border-border px-2 py-0.5 text-foreground/80">
                {op.market_name}
              </span>
            )}
            {house && (
              <span className="max-w-full truncate rounded-md bg-background/60 border border-border px-2 py-0.5 text-foreground/80">
                {house}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60 min-w-0">
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground truncate">
            <ShieldCheck className="w-3 h-3 text-accent shrink-0" /> Selecionado pela PlayBet
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider shrink-0 ${
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

// ---------- option row inside an event group ----------

const optionBadge = (op: Opportunity, idx: number): string => {
  if (op.badge) return op.badge;
  if (idx === 0) return "Odd em destaque";
  if (idx === 1) return "Mercado simples";
  return "Alternativa";
};

const OptionRow = ({
  op,
  idx,
  onClick,
}: {
  op: Opportunity;
  idx: number;
  onClick: () => void;
}) => {
  const hasUrl = !!op.destination_url;
  const cta = op.cta_label || "Conferir";
  const house = getHouseName(op);
  const Tag: any = hasUrl ? "button" : "div";

  return (
    <Tag
      type={hasUrl ? "button" : undefined}
      onClick={hasUrl ? onClick : undefined}
      aria-disabled={!hasUrl}
      className={`group w-full text-left flex items-center gap-3 rounded-xl border bg-background/60 backdrop-blur px-3 py-2.5 min-w-0 ${
        hasUrl
          ? "border-border hover:border-accent/60 active:scale-[0.99] cursor-pointer"
          : "border-border/50 opacity-70 cursor-not-allowed"
      }`}
    >
      {op.odd_label && (
        <div className="shrink-0 flex flex-col items-center justify-center min-w-[3.25rem] rounded-lg border border-accent/40 bg-card px-2 py-1 leading-none">
          <span className="font-stadium text-lg font-black text-accent">{op.odd_label}</span>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground mt-0.5">Odd</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center rounded-full bg-accent/80 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent-foreground max-w-full truncate">
            {optionBadge(op, idx)}
          </span>
          {house && (
            <span className="inline-flex items-center rounded-full bg-primary/30 border border-border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground/90 max-w-full truncate">
              {house}
            </span>
          )}
        </div>
        <div className="text-[13px] font-bold text-foreground leading-tight mt-1 truncate">
          {op.market_name || op.title || "Mercado"}
        </div>
        {op.subtitle && (
          <div className="text-[11px] text-muted-foreground leading-snug truncate">{op.subtitle}</div>
        )}
      </div>

      <span
        className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider ${
          hasUrl ? "text-accent group-hover:translate-x-0.5 transition-transform" : "text-muted-foreground"
        }`}
      >
        {hasUrl ? cta : "Em breve"} {hasUrl && <ArrowRight className="w-3 h-3" />}
      </span>
    </Tag>
  );
};

// ---------- grouped event card (sports) ----------

const EventGroup = ({
  ops,
  onItemClick,
}: {
  ops: Opportunity[];
  onItemClick: (op: Opportunity) => void;
}) => {
  const head = ops[0];
  const m = getMeta(head);
  const ev = m.event || {};
  const home = ev.home_team || null;
  const away = ev.away_team || null;
  const homeLogo = ev.home_team_logo_url || null;
  const awayLogo = ev.away_team_logo_url || null;
  const eventTitle =
    (home && away ? `${home} × ${away}` : null) || ev.name || head.event_name || head.title || "Confronto";
  const time = formatTime(ev.starts_at || (head as any).starts_at);
  const fallback = getImage(head);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card/90 backdrop-blur shadow-[0_6px_24px_hsl(0_0%_0%/0.35)] min-w-0">
      {/* Header */}
      <div className="relative px-4 pt-4 pb-3 border-b border-border/60">
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-accent-foreground shadow-md">
            <Radio className="w-3 h-3" /> Destaque do jogo
          </span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          {homeLogo ? (
            <img
              src={homeLogo}
              alt={home || "Mandante"}
              loading="lazy"
              className="w-10 h-10 object-contain"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/30 border border-border" />
          )}

          <div className="text-center min-w-0">
            <div className="font-stadium text-base sm:text-lg uppercase text-foreground leading-tight break-words">
              {eventTitle}
            </div>
            {time && (
              <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                <Clock className="w-3 h-3 text-accent" /> {time}
              </div>
            )}
          </div>

          {awayLogo ? (
            <img
              src={awayLogo}
              alt={away || "Visitante"}
              loading="lazy"
              className="w-10 h-10 object-contain"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/30 border border-border" />
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-2">
          Oportunidades selecionadas pela PlayBet
        </p>

        {!homeLogo && !awayLogo && fallback && (
          <img
            src={fallback}
            alt={getImageAlt(head)}
            loading="lazy"
            aria-hidden
            className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-10"
          />
        )}
      </div>

      {/* Options */}
      <div className="p-3 space-y-2">
        {ops.slice(0, 3).map((op, i) => (
          <OptionRow key={op.id} op={op} idx={i} onClick={() => onItemClick(op)} />
        ))}
      </div>

      <div className="px-4 pb-3 -mt-1">
        <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="w-3 h-3 text-accent" /> Confira na casa antes de apostar
        </div>
      </div>
    </div>
  );
};

// ---------- main section ----------

interface Props {
  limit?: number;
}

const OpportunitiesSection = ({ limit = 6 }: Props) => {
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

  const items = (data ?? []).slice(0, limit);

  // Group sports items by event; keep others standalone. Preserve order.
  type Block =
    | { kind: "group"; key: string; ops: Opportunity[] }
    | { kind: "single"; key: string; op: Opportunity };

  const blocks: Block[] = [];
  const groupIndex = new Map<string, number>();

  for (const op of items) {
    const cat = normalizeCategory(op.category);
    const ek = cat === "sports" ? eventKey(op) : null;
    if (ek) {
      const existing = groupIndex.get(ek);
      if (existing !== undefined) {
        const b = blocks[existing];
        if (b.kind === "group" && b.ops.length < 3) b.ops.push(op);
        continue;
      }
      groupIndex.set(ek, blocks.length);
      blocks.push({ kind: "group", key: `g-${ek}`, ops: [op] });
    } else {
      blocks.push({ kind: "single", key: `s-${op.id}`, op });
    }
  }

  // Cap to 3 visual blocks max
  const visibleBlocks = blocks.slice(0, 3);

  // Convert single-op groups back to single cards for cleaner UI
  const finalBlocks: Block[] = visibleBlocks.map((b) =>
    b.kind === "group" && b.ops.length === 1 ? { kind: "single", key: b.key, op: b.ops[0] } : b,
  );

  const dominantCat = normalizeCategory(items[0]?.category);
  const section = SECTION_TITLES[dominantCat];
  const hasMixedCategories =
    new Set(items.map((o) => normalizeCategory(o.category))).size > 1;

  return (
    <motion.section
      className="w-full max-w-lg mx-auto mb-10 md:mb-14 min-w-0"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-3 min-w-0">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 mb-2">
          <Sparkles className="w-3 h-3 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">
            {section.eyebrow}
          </span>
        </div>
        <h2 className="font-stadium text-3xl md:text-4xl uppercase text-foreground leading-none break-words">
          {section.title} <span className="text-accent">{section.highlight}</span>
        </h2>
        <p className="text-muted-foreground text-xs mt-2 max-w-sm">
          Curadoria da PlayBet. Confira tudo na casa parceira antes de decidir.
        </p>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {finalBlocks.map((b) =>
            b.kind === "group" ? (
              <EventGroup key={b.key} ops={b.ops} onItemClick={handleClick} />
            ) : (
              <SingleCard
                key={b.key}
                op={b.op}
                onClick={() => handleClick(b.op)}
                showTag={hasMixedCategories}
              />
            ),
          )}
        </div>
      )}

      <p className="text-[10px] leading-relaxed text-muted-foreground/80 mt-3 text-center px-2">
        {section.disclaimer}
      </p>
    </motion.section>
  );
};

export default OpportunitiesSection;
