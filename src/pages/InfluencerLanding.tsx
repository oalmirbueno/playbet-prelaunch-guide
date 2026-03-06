import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { centralSupabase } from "@/lib/centralClient";
import LandingPage from "@/components/LandingPage";
import { Button } from "@/components/ui/button";

const CURRENT_DOMAIN = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host.includes("lovable.app") || host.includes("lovableproject.com")) {
    return "https://oportunidades.playbet.app.br";
  }
  // In production, the DB stores domain with protocol
  return window.location.origin;
};

const InfluencerLanding = () => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();

  const queryRef = searchParams.get("ref") || searchParams.get("slug");
  const resolvedSlug = (queryRef || routeSlug || "").trim();
  const hasRef = resolvedSlug.length > 0;

  const { data: landingPage, isLoading: lpLoading } = useQuery({
    queryKey: ["central-landing-page", CURRENT_DOMAIN(), resolvedSlug],
    queryFn: async () => {
      const domain = CURRENT_DOMAIN();
      const { data, error } = await centralSupabase
        .from("landing_pages")
        .select("id")
        .eq("domain", domain)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: hasRef,
  });

  const { data: instance, isLoading: instLoading } = useQuery({
    queryKey: ["central-instance", landingPage?.id, resolvedSlug],
    queryFn: async () => {
      console.log("[LP DEBUG] fetching instance with landing_page_id:", landingPage!.id, "slug:", resolvedSlug);
      const { data, error } = await centralSupabase
        .from("landing_page_instances")
        .select("id, affiliate_link, influencer_id, is_active")
        .eq("landing_page_id", landingPage!.id)
        .eq("slug", resolvedSlug)
        .maybeSingle();
      console.log("[LP DEBUG] instance result:", data, "error:", error);
      if (error) throw error;
      if (!data) return null;

      // If instance has no affiliate_link, fetch from influencers table
      let finalLink = data.affiliate_link;
      if (!finalLink && data.influencer_id) {
        const { data: inf } = await centralSupabase
          .from("influencers")
          .select("affiliate_link")
          .eq("id", data.influencer_id)
          .maybeSingle();
        finalLink = inf?.affiliate_link || null;
      }
      return { ...data, affiliate_link: finalLink };
    },
    enabled: hasRef && !!landingPage?.id,
  });

  const trackClick = async () => {
    if (!instance || !landingPage) return;
    try {
      await centralSupabase.from("clicks").insert({
        influencer_id: instance.influencer_id,
        landing_page_id: landingPage.id,
        template_id: null,
        utm_id: null,
        ip_address: null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        route: `${window.location.pathname}${window.location.search}`,
        source: "lp_instance",
      });
    } catch {
      // silently fail — don't block redirect
    }
  };

  if (!hasRef) {
    return <LandingPage />;
  }

  const isLoading = lpLoading || instLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!landingPage || !instance || !instance.is_active) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 md:p-8 text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Referência não encontrada</h1>
          <p className="text-muted-foreground">
            Essa referência está inválida ou inativa. Você pode continuar para a página padrão.
          </p>
          <Button variant="cta" size="xl" className="w-full" onClick={() => window.location.assign("/")}>
            Ir para página padrão
          </Button>
        </div>
      </div>
    );
  }

  return <LandingPage affiliateLink={instance.affiliate_link} onCtaClick={trackClick} />;
};

export default InfluencerLanding;
