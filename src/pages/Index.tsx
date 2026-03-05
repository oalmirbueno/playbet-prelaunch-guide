import { motion } from "framer-motion";
import { Zap, Shield, TrendingDown } from "lucide-react";
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 md:py-16">
      {/* Logo */}
      <motion.img
        src={playBetLogo}
        alt="PlayBet"
        className="h-10 md:h-14 mb-12 md:mb-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Hero */}
      <motion.section
        className="text-center max-w-lg mx-auto mb-14 md:mb-20"
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
            Continuar para o jogo
          </Button>
        </motion.div>
      </motion.section>

      {/* Tips */}
      <section className="w-full max-w-lg mx-auto space-y-4 mb-14 md:mb-20">
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
          Entrar no jogo agora
        </Button>
        <p className="text-muted-foreground text-xs mt-4">
          +18 · Jogue com responsabilidade
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
