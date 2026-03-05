import { motion } from "framer-motion";
import { Zap, Shield, TrendingDown, Star, Clock, ArrowRight, CheckCircle2, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import playBetLogo from "@/assets/playbet-logo.png";

const GAME_URL = "https://playbet.com";

const tips = [
  {
    icon: TrendingDown,
    title: "Comece com valores baixos",
    desc: "Aposte pouco no início e aumente conforme se sentir confortável.",
  },
  {
    icon: Zap,
    title: "Jogos são entretenimento",
    desc: "Jogue por diversão, nunca como fonte de renda.",
  },
  {
    icon: Shield,
    title: "Use plataformas verificadas",
    desc: "Sempre jogue em sites regulamentados e seguros.",
  },
];

const stats = [
  { icon: Users, value: "50K+", label: "Jogadores ativos" },
  { icon: Trophy, value: "R$2M+", label: "Em prêmios" },
  { icon: Star, value: "4.8", label: "Avaliação média" },
];

const benefits = [
  "Saques rápidos e seguros",
  "Suporte 24/7 em português",
  "Bônus exclusivos para novos jogadores",
  "Intermediadora 100% confiável e verificada",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 md:py-16 overflow-hidden">
      {/* Logo */}
      <motion.img
        src={playBetLogo}
        alt="PlayBet"
        className="h-24 md:h-36 mb-10 md:mb-14"
        initial={{ opacity: 0, scale: 0.8 }}
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
          className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight mb-4"
          variants={fadeUp}
          custom={0}
        >
          Antes de começar,{" "}
          <span className="text-accent">veja isso</span>
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-base md:text-lg mb-8"
          variants={fadeUp}
          custom={1}
        >
          Algumas dicas rápidas para jogar melhor e evitar erros comuns.
        </motion.p>
        <motion.div variants={fadeUp} custom={2}>
          <Button
            variant="cta"
            size="xl"
            className="w-full sm:w-auto"
            onClick={() => window.open(GAME_URL, "_blank")}
          >
            Continuar para o jogo <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </motion.section>

      {/* Stats */}
      <motion.section
        className="w-full max-w-lg mx-auto grid grid-cols-3 gap-3 mb-10 md:mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-card rounded-xl p-4 text-center border border-border"
            variants={fadeUp}
            custom={i}
          >
            <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-xl md:text-2xl font-black text-foreground">{stat.value}</p>
            <p className="text-muted-foreground text-[10px] md:text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Tips */}
      <section className="w-full max-w-lg mx-auto space-y-4 mb-10 md:mb-16">
        <motion.h2
          className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Clock className="w-5 h-5 text-accent" />
          Dicas rápidas antes de jogar
        </motion.h2>
        {tips.map((tip, i) => (
          <motion.div
            key={tip.title}
            className="gradient-border rounded-xl bg-card p-5 flex gap-4 items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            custom={i}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <tip.icon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm md:text-base mb-1">
                {tip.title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {tip.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Benefits */}
      <motion.section
        className="w-full max-w-lg mx-auto mb-10 md:mb-16 bg-card rounded-2xl p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-5 flex items-center gap-2">
          <Star className="w-5 h-5 text-accent" />
          Por que escolher a PlayBet?
        </h2>
        <ul className="space-y-3">
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
              {b}
            </motion.li>
          ))}
        </ul>
      </motion.section>

      {/* Final CTA */}
      <motion.div
        className="w-full max-w-lg mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="cta"
          size="xl"
          className="w-full sm:w-auto"
          onClick={() => window.open(GAME_URL, "_blank")}
        >
          Entrar no jogo agora <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <p className="text-muted-foreground text-xs mt-4">
          +18 · Jogue com responsabilidade
        </p>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="w-full max-w-lg mx-auto mt-14 md:mt-20 pt-6 border-t border-border text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <img src={playBetLogo} alt="PlayBet" className="h-14 mx-auto mb-3 opacity-60" />
        <p className="text-muted-foreground text-[10px] md:text-xs leading-relaxed">
          © 2026 PlayBet · Todos os direitos reservados
          <br />
          Jogo responsável · Proibido para menores de 18 anos · Intermediadora de jogos online
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
