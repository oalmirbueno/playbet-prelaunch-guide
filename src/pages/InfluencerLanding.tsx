import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LandingPage from "@/components/LandingPage";
import NotFound from "./NotFound";

const InfluencerLanding = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: influencer, isLoading, error } = useQuery({
    queryKey: ["influencer", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("influencers")
        .select("id, affiliate_link")
        .eq("slug", slug!)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const trackClick = async () => {
    if (!influencer) return;
    try {
      await supabase.from("clicks").insert({
        influencer_id: influencer.id,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });
    } catch {
      // silently fail — don't block redirect
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!influencer || error) return <NotFound />;

  return <LandingPage affiliateLink={influencer.affiliate_link} onCtaClick={trackClick} />;
};

export default InfluencerLanding;
