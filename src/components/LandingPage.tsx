import { motion } from "framer-motion";
import { Zap, Shield, Target, Star, Clock, ArrowRight, CheckCircle2, Trophy, Sparkles, Lock } from "lucide-react";
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
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 pitch-grid opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] stadium-spot" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] gold-spot" />

      <div className="relative flex flex-col items-center px-5 py-6 md:py-16">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-primary/30 px-4 py-1.5 backdrop-blur"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-accent">
            Edição Copa · Bônus Ativados
          </span>
        </motion.div>

        <motion.img
          src={playBetLogo}
          alt="PlayBet"
          className="h-20 md:h-32 mb-6 md:mb-10 drop-shadow-[0_0_24px_hsl(45_100%_50%/0.25)]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Hero */}
        <motion.section
          className="text-center max-w-lg mx-auto mb-10 md:mb-16"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-stadium text-[2.6rem] leading-[0.95] md:text-6xl font-black uppercase text-foreground mb-4"
            variants={fadeUp}
            custom={0}
          >
            Antes de começar,{" "}
            <span className="block text-accent drop-shadow-[0_2px_18px_hsl(45_100%_50%/0.45)]">
              veja isso
            </span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-base md:text-lg mb-7 max-w-md mx-auto"
            variants={fadeUp}
            custom={1}
          >
            Descubra como aproveitar as melhores oportunidades com segurança.
          </motion.p>

          {/* Trust strip */}
          <motion.div
            className="grid grid-cols-3 gap-2 mb-7 max-w-md mx-auto"
            variants={fadeUp}
            custom={2}
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

          <motion.div variants={fadeUp} custom={3}>
            <Button
              variant="cta"
              size="xl"
              className="w-full font-stadium text-xl uppercase"
              onClick={handleCta}
              disabled={!hasLink}
            >
              Acessar oportunidades <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            {!hasLink && (
              <p className="text-muted-foreground text-[11px] mt-3">
                Carregando sua oferta personalizada…
              </p>
            )}
          </motion.div>
        </motion.section>

        {/* Tips */}
        <section className="w-full max-w-lg mx-auto space-y-4 mb-10 md:mb-16">
          <motion.h2
            className="font-stadium text-2xl md:text-3xl uppercase text-foreground mb-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Clock className="w-5 h-5 text-accent" />
            Dicas rápidas antes de começar
          </motion.h2>

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
                {/* Side stripe */}
                <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-primary" />
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
          className="relative w-full max-w-lg mx-auto mb-10 md:mb-16 overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-primary/40 via-card to-card p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-accent" />
            <h2 className="font-stadium text-2xl md:text-3xl uppercase text-foreground">
              Por que escolher a <span className="text-accent">PlayBet</span>?
            </h2>
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

          {/* Mini medal row */}
          <div className="relative mt-6 grid grid-cols-3 gap-2">
            {[
              { icon: Star, label: "Promoções diárias" },
              { icon: Sparkles, label: "Bônus turbo" },
              { icon: Lock, label: "100% Seguro" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background/40 px-1.5 py-3"
              >
                <item.icon className="w-4 h-4 text-accent" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-foreground/90 text-center leading-tight">
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
          <div className="rounded-3xl border-2 border-accent/40 bg-card/70 backdrop-blur p-5 md:p-6 shadow-[0_10px_40px_hsl(45_100%_50%/0.12)]">
            <p className="font-stadium text-[11px] md:text-xs uppercase tracking-[0.25em] text-accent mb-2">
              Última jogada
            </p>
            <h3 className="font-stadium text-2xl md:text-3xl uppercase text-foreground mb-4 leading-none">
              Bora <span className="text-accent">para o jogo</span>
            </h3>
            <Button
              variant="cta"
              size="xl"
              className="w-full font-stadium text-xl uppercase"
              onClick={handleCta}
              disabled={!hasLink}
            >
              Começar agora <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground text-xs mt-4">+18 · Use com responsabilidade</p>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="w-full max-w-lg mx-auto mt-14 md:mt-20 pt-6 border-t border-border text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <img src={playBetLogo} alt="PlayBet" className="h-12 mx-auto mb-3 opacity-60" />
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
    </div>
  );
};

export default LandingPage;
