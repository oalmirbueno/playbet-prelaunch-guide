import { motion } from "framer-motion";
import { Zap, Shield, Target, Star, Clock, ArrowRight, CheckCircle2, Trophy, Sparkles, Lock, Users, Award, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import playBetLogo from "@/assets/playbet-logo.png";

const tips = [
  {
    icon: Target,
    title: "Conheça as melhores ofertas",
    desc: "A PlayBet seleciona as oportunidades mais vantajosas para você.",
  },
  {
    icon: Zap,
    title: "Aproveite bônus exclusivos",
    desc: "Acesse promoções e vantagens que só a nossa rede oferece.",
  },
  {
    icon: Shield,
    title: "Parceiros verificados",
    desc: "Trabalhamos apenas com marcas confiáveis e reconhecidas no mercado.",
  },
];

const benefits = [
  "Acesso às melhores ofertas do mercado",
  "Suporte 24/7 em português",
  "Bônus e promoções exclusivas",
  "Rede de parceiros 100% verificados",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Brazilian flag SVG component
const BrazilFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 28 20" className={className} aria-hidden>
    <rect width="28" height="20" rx="2" fill="#009C3B" />
    <polygon points="14,3 25,10 14,17 3,10" fill="#FFDF00" />
    <circle cx="14" cy="10" r="3.6" fill="#002776" />
    <path d="M10.6 10.4 Q14 9 17.4 10.4" stroke="#fff" strokeWidth="0.5" fill="none" />
  </svg>
);

interface LandingPageProps {
  affiliateLink?: string;
  onCtaClick?: () => void;
}

const LandingPage = ({ affiliateLink, onCtaClick }: LandingPageProps) => {
  const hasLink = !!affiliateLink;

  const handleCta = () => {
    if (!hasLink) return;
    if (onCtaClick) onCtaClick();
    window.open(affiliateLink, "_blank");
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Top Brazil flag stripe */}
      <div className="relative h-1.5 w-full flex">
        <div className="flex-1 bg-[#009C3B]" />
        <div className="flex-1 bg-[#FFDF00]" />
        <div className="flex-1 bg-[#002776]" />
      </div>

      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 pitch-grid opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] stadium-spot" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] gold-spot" />
      {/* Subtle Brazil green wash */}
      <div
        className="pointer-events-none absolute inset-x-0 top-40 h-[300px] opacity-[0.08]"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, #009C3B 0%, transparent 70%)" }}
      />

      <div className="relative flex flex-col items-center px-5 py-6 md:py-12">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-primary/40 px-4 py-1.5 backdrop-blur shadow-[0_0_24px_hsl(45_100%_50%/0.18)]"
        >
          <BrazilFlag className="w-4 h-3" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-accent">
            Edição Copa · Brasil
          </span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#009C3B] opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#009C3B]" />
          </span>
        </motion.div>

        <motion.img
          src={playBetLogo}
          alt="PlayBet"
          className="h-20 md:h-32 mb-5 md:mb-8 drop-shadow-[0_0_24px_hsl(45_100%_50%/0.3)]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Hero */}
        <motion.section
          className="text-center max-w-lg mx-auto mb-8 md:mb-14"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-stadium text-[2.6rem] leading-[0.95] md:text-6xl font-black uppercase text-foreground mb-4"
            variants={fadeUp}
            custom={0}
          >
            Antes de começar,{" "}
            <span className="block text-accent drop-shadow-[0_2px_18px_hsl(45_100%_50%/0.5)]">
              veja isso
            </span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-base md:text-lg mb-6 max-w-md mx-auto"
            variants={fadeUp}
            custom={1}
          >
            Descubra como aproveitar as melhores oportunidades com segurança.
          </motion.p>

          {/* Live social proof */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-5 text-xs md:text-sm"
            variants={fadeUp}
            custom={2}
          >
            <div className="flex -space-x-2">
              {["#009C3B", "#FFDF00", "#002776", "#FFC300"].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-black text-background"
                  style={{ backgroundColor: c }}
                >
                  {["JP", "AC", "MR", "+"][i]}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-foreground">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                ))}
                <span className="font-bold ml-1">4.9</span>
              </div>
              <div className="text-muted-foreground text-[10px] md:text-xs">
                +50.000 brasileiros já entraram hoje
              </div>
            </div>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            className="grid grid-cols-3 gap-2 mb-6 max-w-md mx-auto"
            variants={fadeUp}
            custom={3}
          >
            {[
              { icon: Trophy, label: "Promoções" },
              { icon: Sparkles, label: "Bônus" },
              { icon: Lock, label: "Segurança" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card/70 px-2 py-3 backdrop-blur"
              >
                <item.icon className="w-4 h-4 text-accent" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-foreground/90">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} custom={4}>
            <Button
              variant="cta"
              size="xl"
              className="w-full font-stadium text-xl uppercase"
              onClick={handleCta}
              disabled={!hasLink}
            >
              Acessar oportunidades <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-muted-foreground">
              <Lock className="w-3 h-3" />
              Conexão segura · Aprovado pela comunidade brasileira
            </div>
          </motion.div>
        </motion.section>

        {/* Tips */}
        <section className="w-full max-w-lg mx-auto space-y-4 mb-10 md:mb-14">
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Clock className="w-5 h-5 text-accent" />
            <h2 className="font-stadium text-2xl md:text-3xl uppercase text-foreground">
              Dicas rápidas antes de começar
            </h2>
          </motion.div>

          {tips.map((tip, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={tip.title}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 pl-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
              >
                {/* Side stripe — Brazil flag colors rotating */}
                <span
                  className="absolute left-0 top-0 h-full w-1"
                  style={{
                    background:
                      i === 0
                        ? "linear-gradient(180deg,#009C3B,#FFDF00)"
                        : i === 1
                        ? "linear-gradient(180deg,#FFDF00,#FFC300)"
                        : "linear-gradient(180deg,#002776,#FFC300)",
                  }}
                />
                {/* Big jersey number */}
                <span className="pointer-events-none absolute -right-2 -top-3 font-stadium text-7xl md:text-8xl font-black text-foreground/[0.06] select-none">
                  {num}
                </span>

                <div className="flex gap-4 items-start relative">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/30 border border-accent/30 flex items-center justify-center shadow-[0_0_18px_hsl(45_100%_50%/0.15)]">
                    <tip.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="font-stadium text-[10px] uppercase tracking-[0.2em] text-accent mb-1">
                      Dica {num}
                    </div>
                    <h3 className="font-bold text-foreground text-base md:text-lg mb-1 leading-tight">
                      {tip.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Why PlayBet */}
        <motion.section
          className="relative w-full max-w-lg mx-auto mb-10 md:mb-14 overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-primary/50 via-card to-card p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Brazilian diamond pattern accent */}
          <div className="pointer-events-none absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[#009C3B]/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-accent" />
            <h2 className="font-stadium text-2xl md:text-3xl uppercase text-foreground">
              Por que escolher a <span className="text-accent">PlayBet</span>?
            </h2>
            <BrazilFlag className="w-5 h-3.5 ml-auto" />
          </div>
          <ul className="space-y-3 relative">
            {benefits.map((b, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-3 text-sm md:text-base text-foreground"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="relative mt-6 grid grid-cols-3 gap-2">
            {[
              { icon: Users, top: "+50k", label: "Brasileiros" },
              { icon: Award, top: "100%", label: "Parceiros TOP" },
              { icon: BadgeCheck, top: "24/7", label: "Suporte BR" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-background/50 px-1.5 py-3"
              >
                <item.icon className="w-4 h-4 text-accent mb-0.5" />
                <span className="font-stadium text-base md:text-lg font-black text-foreground leading-none">
                  {item.top}
                </span>
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.div
          className="w-full max-w-lg mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-3xl border-2 border-accent/50 bg-card/80 backdrop-blur p-5 md:p-6 shadow-[0_10px_50px_hsl(45_100%_50%/0.18)] overflow-hidden">
            {/* Brazil flag stripe top */}
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <div className="flex-1 bg-[#009C3B]" />
              <div className="flex-1 bg-[#FFDF00]" />
              <div className="flex-1 bg-[#002776]" />
            </div>
            <p className="font-stadium text-[11px] md:text-xs uppercase tracking-[0.25em] text-accent mb-2 mt-1 flex items-center justify-center gap-2">
              <BrazilFlag className="w-4 h-3" /> Última jogada
            </p>
            <h3 className="font-stadium text-2xl md:text-3xl uppercase text-foreground mb-2 leading-none">
              Bora <span className="text-accent">para o jogo</span>
            </h3>
            <p className="text-muted-foreground text-xs md:text-sm mb-4">
              Junte-se à torcida que já garantiu seu lugar
            </p>
            <Button
              variant="cta"
              size="xl"
              className="w-full font-stadium text-xl uppercase"
              onClick={handleCta}
              disabled={!hasLink}
            >
              Começar agora <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Verificado</span>
              <span>•</span>
              <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> +18</span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs mt-4">Use com responsabilidade</p>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="w-full max-w-lg mx-auto mt-12 md:mt-16 pt-6 border-t border-border text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <img src={playBetLogo} alt="PlayBet" className="h-12 mx-auto mb-3 opacity-60" />
          <div className="flex items-center justify-center gap-2 mb-3">
            <BrazilFlag className="w-5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Feito para o Brasil
            </span>
          </div>
          <p className="text-muted-foreground text-[10px] md:text-xs leading-relaxed">
            © 2026 PlayBet · Todos os direitos reservados
            <br />
            Sem afiliação oficial com a FIFA ou eventos esportivos
            <br />
            Uso responsável · +18 ·{" "}
            <a
              href="/admin/login"
              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
            >
              Rede de afiliados
            </a>
          </p>
        </motion.footer>
      </div>

      {/* Bottom Brazil flag stripe */}
      <div className="relative h-1.5 w-full flex">
        <div className="flex-1 bg-[#009C3B]" />
        <div className="flex-1 bg-[#FFDF00]" />
        <div className="flex-1 bg-[#002776]" />
      </div>
    </div>
  );
};

export default LandingPage;
