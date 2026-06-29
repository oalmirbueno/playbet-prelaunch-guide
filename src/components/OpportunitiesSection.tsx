import { motion } from "framer-motion";
import { ArrowRight, Flame, ShieldCheck } from "lucide-react";
import { useOpportunities, trackOpportunityClick, type Opportunity } from "@/hooks/useOpportunities";

const Skeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-36 rounded-2xl border border-border bg-card/60 animate-pulse"
      />
    ))}
  </div>
);

const Card = ({ op, onClick }: { op: Opportunity; onClick: () => void }) => {
  const cta = op.cta_label || "Conferir oportunidade";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative text-left overflow-hidden rounded-2xl border border-border bg-card/85 backdrop-blur p-4 hover:border-accent/60 transition-colors shadow-[0_4px_20px_hsl(0_0%_0%/0.25)]"
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-[#FFDF00]" />
      <div className="flex items-start justify-between gap-3 mb-2">
        {op.badge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 border border-accent/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-accent">
            <Flame className="w-3 h-3" /> {op.badge}
          </span>
        )}
        {op.odd_label && (
          <span className="font-stadium text-lg font-black text-accent leading-none">
            {op.odd_label}
          </span>
        )}
      </div>

      {op.title && (
        <h3 className="font-stadium text-lg md:text-xl uppercase text-foreground leading-tight mb-0.5">
          {op.title}
        </h3>
      )}
      {op.subtitle && (
        <p className="text-muted-foreground text-xs md:text-sm mb-2 leading-snug">
          {op.subtitle}
        </p>
      )}

      {(op.event_name || op.market_name) && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] text-foreground/80">
          {op.event_name && (
            <span className="rounded-md bg-primary/30 border border-border px-2 py-0.5">
              {op.event_name}
            </span>
          )}
          {op.market_name && (
            <span className="rounded-md bg-background/60 border border-border px-2 py-0.5">
              Mercado: {op.market_name}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="w-3 h-3 text-accent" /> Selecionado pela PlayBet
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform">
          {cta} <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
};

interface Props {
  limit?: number;
}

const OpportunitiesSection = ({ limit = 6 }: Props) => {
  const { data, isLoading, isError } = useOpportunities(limit);

  // Fallback: hide section entirely so the page's evergreen blocks carry the trust message
  if (isError) return null;
  if (!isLoading && (!data || data.length === 0)) return null;

  const handleClick = async (op: Opportunity) => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    await trackOpportunityClick(op, ref);
    if (op.destination_url) {
      window.open(op.destination_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.section
      className="w-full max-w-lg mx-auto mb-10 md:mb-14"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="font-stadium text-2xl md:text-3xl uppercase text-foreground leading-none">
            Destaques de <span className="text-accent">hoje</span>
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Oportunidades selecionadas pela PlayBet. +18
          </p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data!.map((op) => (
            <Card key={op.id} op={op} onClick={() => handleClick(op)} />
          ))}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground/70 mt-3 text-center">
        Confira a odd antes de apostar · Jogue com responsabilidade · +18
      </p>
    </motion.section>
  );
};

export default OpportunitiesSection;
