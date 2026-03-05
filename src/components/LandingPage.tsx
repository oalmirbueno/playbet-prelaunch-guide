import { motion } from "framer-motion";
import { Zap, Shield, Target, Star, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import playBetLogo from "@/assets/playbet-logo.png";

const DEFAULT_URL = "https://playbet.com";

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
  const targetUrl = affiliateLink || DEFAULT_URL;

  const handleCta = () => {
    if (onCtaClick) onCtaClick();
    window.open(targetUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-5 py-6 md:py-16 overflow-hidden">
      <motion.img
        src={playBetLogo}
        alt="PlayBet"
        className="h-24 md:h-36 mb-10 md:mb-14"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

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
          Descubra como aproveitar as melhores oportunidades com segurança.
        </motion.p>
        <motion.div variants={fadeUp} custom={2}>
          <Button variant="cta" size="xl" className="w-full" onClick={handleCta}>
            Acessar oportunidades <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </motion.section>

      <section className="w-full max-w-lg mx-auto space-y-4 mb-10 md:mb-16">
        <motion.h2
          className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Clock className="w-5 h-5 text-accent" />
          Dicas rápidas antes de começar
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
              <h3 className="font-bold text-foreground text-sm md:text-base mb-1">{tip.title}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{tip.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

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

      <motion.div
        className="w-full max-w-lg mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="cta" size="xl" className="w-full" onClick={handleCta}>
          Começar agora <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <p className="text-muted-foreground text-xs mt-4">+18 · Use com responsabilidade</p>
      </motion.div>

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
          Uso responsável · +18 · Rede de afiliados
        </p>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
