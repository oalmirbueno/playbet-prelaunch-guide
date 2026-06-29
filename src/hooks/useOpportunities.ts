import { useQuery } from "@tanstack/react-query";
import { centralSupabase } from "@/lib/centralClient";

export type OpportunityCategory = "sports" | "casino" | "offer" | "guide" | string;

export interface Opportunity {
  id: string;
  category: OpportunityCategory | null;
  badge: string | null;
  title: string | null;
  subtitle: string | null;
  event_name: string | null;
  market_name: string | null;
  odd_label: string | null;
  cta_label: string | null;
  destination_url: string | null;
  sort_order: number | null;
  created_at: string;
}

const getDomain = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host.includes("lovable.app") || host.includes("lovableproject.com")) {
    return "https://oportunidades.playbet.app.br";
  }
  return window.location.origin;
};

export const useOpportunities = (limit = 6) => {
  return useQuery({
    queryKey: ["lp-opportunities", getDomain(), limit],
    queryFn: async (): Promise<Opportunity[]> => {
      const domain = getDomain();
      const nowIso = new Date().toISOString();

      // Try to resolve landing_page for this domain (optional)
      let landingPageId: string | null = null;
      try {
        const { data: lp } = await centralSupabase
          .from("landing_pages")
          .select("id")
          .eq("domain", domain)
          .eq("is_active", true)
          .maybeSingle();
        landingPageId = lp?.id ?? null;
      } catch {
        landingPageId = null;
      }

      let query = centralSupabase
        .from("lp_opportunities")
        .select(
          "id, badge, title, subtitle, event_name, market_name, odd_label, cta_label, destination_url, sort_order, created_at"
        )
        .eq("is_active", true)
        .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
        .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(limit);

      if (landingPageId) {
        query = query.or(`landing_page_id.is.null,landing_page_id.eq.${landingPageId}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as Opportunity[]) ?? [];
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  });
};

export const trackOpportunityClick = async (op: Opportunity, ref: string | null) => {
  try {
    await centralSupabase.from("tracking_events").insert({
      raw_event_name: "click",
      canonical_event_name: "click",
      source_type: "landing_page",
      raw_payload: {
        opportunity_id: op.id,
        title: op.title,
        ref,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        destination_url: op.destination_url,
        pathname: window.location.pathname,
      },
    });
  } catch {
    // swallow — never block redirect
  }
};
