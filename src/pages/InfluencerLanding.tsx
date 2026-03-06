import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { centralSupabase } from "@/lib/centralClient";
import LandingPage from "@/components/LandingPage";
import NotFound from "./NotFound";

const CURRENT_DOMAIN = () => {
  const host = window.location.hostname;
  // In dev/preview, fallback to production domain
  if (host === "localhost" || host.includes("lovable.app")) {
    return "oportunidades.playbet.app.br";
  }
  return host;
};

const InfluencerLanding = () => {
  const { slug } = useParams<{ slug: string }>();

  // Step 1: Find landing_page by domain
  const { data: landingPage, isLoading: lpLoading } = useQuery({
    queryKey: ["central-landing-page", CURRENT_DOMAIN()],
    queryFn: async () => {
      const { data, error } = await centralSupabase
        .from("landing_pages")
        .select("id")
        .eq("domain", CURRENT_DOMAIN())
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Step 2: Find instance by slug + landing_page_id
  const { data: instance, isLoading: instLoading } = useQuery({
    queryKey: ["central-instance", landingPage?.id, slug],
    queryFn: async () => {
      const { data, error } = await centralSupabase
        .from("landing_page_instances")
        .select("id, affiliate_link, influencer_id, is_active")
        .eq("landing_page_id", landingPage!.id)
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!landingPage?.id && !!slug,
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
        route: `/i/${slug}`,
        source: "lp_instance",
      });
    } catch {
      // silently fail — don't block redirect
    }
  };

  const isLoading = lpLoading || instLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback: no landing page for this domain, no instance found, or instance inactive
  if (!landingPage || !instance || !instance.is_active) {
    return <NotFound />;
  }

  return <LandingPage affiliateLink={instance.affiliate_link} onCtaClick={trackClick} />;
};

export default InfluencerLanding;
