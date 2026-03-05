import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LogOut, Users, MousePointerClick, TrendingUp, ExternalLink } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: clickStats } = useQuery({
    queryKey: ["click-stats"],
    queryFn: async () => {
      const now = new Date();
      const todayStart = startOfDay(now).toISOString();
      const week = subDays(now, 7).toISOString();
      const month = subDays(now, 30).toISOString();

      const [todayRes, weekRes, monthRes, totalRes] = await Promise.all([
        supabase.from("clicks").select("id", { count: "exact", head: true }).gte("clicked_at", todayStart),
        supabase.from("clicks").select("id", { count: "exact", head: true }).gte("clicked_at", week),
        supabase.from("clicks").select("id", { count: "exact", head: true }).gte("clicked_at", month),
        supabase.from("clicks").select("id", { count: "exact", head: true }),
      ]);

      return {
        today: todayRes.count || 0,
        week: weekRes.count || 0,
        month: monthRes.count || 0,
        total: totalRes.count || 0,
      };
    },
  });

  const { data: chartData } = useQuery({
    queryKey: ["clicks-chart"],
    queryFn: async () => {
      const since = subDays(new Date(), 14).toISOString();
      const { data } = await supabase
        .from("clicks")
        .select("clicked_at")
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
  });

  const { data: topInfluencers } = useQuery({
    queryKey: ["top-influencers"],
    queryFn: async () => {
      const { data: influencers } = await supabase.from("influencers").select("id, name, slug, is_active");
      if (!influencers) return [];

      const results = await Promise.all(
        influencers.map(async (inf) => {
          const { count } = await supabase
            .from("clicks")
            .select("id", { count: "exact", head: true })
            .eq("influencer_id", inf.id);
          return { ...inf, clicks: count || 0 };
        })
      );

      return results.sort((a, b) => b.clicks - a.clicks);
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const stats = [
    { label: "Hoje", value: clickStats?.today || 0, icon: MousePointerClick },
    { label: "7 dias", value: clickStats?.week || 0, icon: TrendingUp },
    { label: "30 dias", value: clickStats?.month || 0, icon: TrendingUp },
    { label: "Total", value: clickStats?.total || 0, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/influencers")}>
              <Users className="w-4 h-4 mr-2" /> Influenciadores
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <s.icon className="w-4 h-4" /> {s.label}
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Cliques (últimos 14 dias)</CardTitle>
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

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Influenciadores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Cliques</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {topInfluencers?.map((inf) => (
                  <TableRow key={inf.id} className="cursor-pointer" onClick={() => navigate(`/admin/influencers/${inf.id}`)}>
                    <TableCell className="font-medium">{inf.name}</TableCell>
                    <TableCell className="text-muted-foreground">/i/{inf.slug}</TableCell>
                    <TableCell className="text-right font-bold">{inf.clicks}</TableCell>
                    <TableCell className="text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${inf.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {inf.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
                {(!topInfluencers || topInfluencers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhum influenciador cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
