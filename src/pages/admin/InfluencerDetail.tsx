import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft, Copy, ExternalLink, MousePointerClick } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { buildPublicLandingUrl } from "@/lib/publicLandingUrl";

const InfluencerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: influencer } = useQuery({
    queryKey: ["influencer-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("influencers").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: stats } = useQuery({
    queryKey: ["influencer-stats", id],
    queryFn: async () => {
      const now = new Date();
      const todayStart = startOfDay(now).toISOString();
      const week = subDays(now, 7).toISOString();
      const month = subDays(now, 30).toISOString();

      const [todayRes, weekRes, monthRes, totalRes] = await Promise.all([
        supabase.from("clicks").select("id", { count: "exact", head: true }).eq("influencer_id", id!).gte("clicked_at", todayStart),
        supabase.from("clicks").select("id", { count: "exact", head: true }).eq("influencer_id", id!).gte("clicked_at", week),
        supabase.from("clicks").select("id", { count: "exact", head: true }).eq("influencer_id", id!).gte("clicked_at", month),
        supabase.from("clicks").select("id", { count: "exact", head: true }).eq("influencer_id", id!),
      ]);

      return {
        today: todayRes.count || 0,
        week: weekRes.count || 0,
        month: monthRes.count || 0,
        total: totalRes.count || 0,
      };
    },
    enabled: !!id,
  });

  const { data: chartData } = useQuery({
    queryKey: ["influencer-chart", id],
    queryFn: async () => {
      const since = subDays(new Date(), 14).toISOString();
      const { data } = await supabase
        .from("clicks")
        .select("clicked_at")
        .eq("influencer_id", id!)
        .gte("clicked_at", since);

      const grouped: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = format(subDays(new Date(), i), "dd/MM");
        grouped[d] = 0;
      }
      data?.forEach((c) => {
        const d = format(new Date(c.clicked_at), "dd/MM");
        if (grouped[d] !== undefined) grouped[d]++;
      });

      return Object.entries(grouped).map(([date, clicks]) => ({ date, clicks }));
    },
    enabled: !!id,
  });

  const copyLink = () => {
    if (!influencer) return;
    navigator.clipboard.writeText(buildPublicLandingUrl(influencer.slug));
    toast({ title: "Link copiado!" });
  };

  if (!influencer) return null;

  const metricCards = [
    { label: "Hoje", value: stats?.today || 0 },
    { label: "7 dias", value: stats?.week || 0 },
    { label: "30 dias", value: stats?.month || 0 },
    { label: "Total", value: stats?.total || 0 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/influencers")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{influencer.name}</h1>
            <p className="text-muted-foreground text-sm">?ref={influencer.slug}</p>
          </div>
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-2" /> Copiar link
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(buildPublicLandingUrl(influencer.slug), "_blank", "noopener,noreferrer")}>
            <ExternalLink className="w-4 h-4 mr-2" /> Ver página
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Link de afiliado</span>
              <span className="text-foreground truncate ml-4 max-w-[60%]">{influencer.affiliate_link}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={influencer.is_active ? "text-green-400" : "text-red-400"}>
                {influencer.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Criado em</span>
              <span className="text-foreground">{format(new Date(influencer.created_at), "dd/MM/yyyy")}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {metricCards.map((m) => (
            <Card key={m.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <MousePointerClick className="w-4 h-4" /> {m.label}
                </div>
                <p className="text-2xl font-bold text-foreground">{m.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cliques (14 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData || []}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="clicks" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfluencerDetail;
