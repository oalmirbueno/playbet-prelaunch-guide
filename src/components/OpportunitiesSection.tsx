import { motion } from "framer-motion";
import { ArrowRight, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { useOpportunities, trackOpportunityClick, type Opportunity } from "@/hooks/useOpportunities";

const Skeleton = () => (
  <div className="grid grid-cols-1 gap-3">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-32 rounded-2xl border border-border bg-card/60 animate-pulse"
      />
    ))}
  </div>
);

const Card = ({ op, onClick }: { op: Opportunity; onClick: () => void }) => {
  const hasUrl = !!op.destination_url;
  const cta = op.cta_label || "Confira na casa";
  const badgeLabel = op.badge || "Campanha oficial";

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
        {op.odd_label && (
          <div className="flex flex-col items-end leading-none">
            <span className="font-stadium text-2xl font-black text-accent">
              {op.odd_label}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">
              Odd em destaque
            </span>
          </div>
        )}
      </div>

      {op.title && (
        <h3 className="font-stadium text-xl uppercase text-foreground leading-tight mb-1">
          {op.title}
        </h3>
      )}
      {op.subtitle && (
        <p className="text-muted-foreground text-xs mb-2 leading-snug line-clamp-2">
          {op.subtitle}
        </p>
      )}

      {(op.event_name || op.market_name) && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
          {op.event_name && (
            <span className="rounded-md bg-primary/30 border border-border px-2 py-0.5 text-foreground/90">
              {op.event_name}
            </span>
          )}
          <span className="rounded-md bg-background/60 border border-border px-2 py-0.5 text-foreground/80">
            {op.market_name ? `Mercado: ${op.market_name}` : "Mercado simples"}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-border/60 mt-2">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="w-3 h-3 text-accent" /> Selecionado pela PlayBet
        </span>
        <span className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider ${hasUrl ? "text-accent group-hover:translate-x-0.5 transition-transform" : "text-muted-foreground"}`}>
          {hasUrl ? cta : "Em breve"} {hasUrl && <ArrowRight className="w-3.5 h-3.5" />}
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
              Ao vivo agora
            </span>
          </div>
          <h2 className="font-stadium text-3xl md:text-4xl uppercase text-foreground leading-none">
            Destaques de <span className="text-accent">hoje</span>
          </h2>
        </div>
      </div>

      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((op) => (
            <Card key={op.id} op={op} onClick={() => handleClick(op)} />
          ))}
        </div>
      )}

      <p className="text-[10px] leading-relaxed text-muted-foreground/80 mt-3 text-center px-2">
        Odds podem mudar. Confira as informações na casa antes de apostar. +18. Jogue com responsabilidade.
      </p>
    </motion.section>
  );
};

export default OpportunitiesSection;
