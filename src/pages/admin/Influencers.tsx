import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Copy, Pencil, Trash2 } from "lucide-react";
import { buildPublicLandingUrl, getPublicLandingBaseUrl } from "@/lib/publicLandingUrl";

const Influencers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", affiliate_link: "", is_active: true });

  const { data: influencers } = useQuery({
    queryKey: ["influencers-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("influencers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const slug = form.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      if (editId) {
        const { error } = await supabase.from("influencers").update({ ...form, slug }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("influencers").insert({ ...form, slug });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["influencers-list"] });
      setDialogOpen(false);
      resetForm();
      toast({ title: editId ? "Atualizado!" : "Criado!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("influencers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["influencers-list"] });
      toast({ title: "Removido!" });
    },
  });

  const resetForm = () => {
    setForm({ name: "", slug: "", affiliate_link: "", is_active: true });
    setEditId(null);
  };

  const openEdit = (inf: typeof influencers extends (infer T)[] | undefined ? T : never) => {
    if (!inf) return;
    setForm({ name: inf.name, slug: inf.slug, affiliate_link: inf.affiliate_link, is_active: inf.is_active });
    setEditId(inf.id);
    setDialogOpen(true);
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(buildPublicLandingUrl(slug));
    toast({ title: "Link copiado!" });
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Influenciadores</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Novo</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>{editId ? "Editar" : "Novo"} Influenciador</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
                className="space-y-4"
              >
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((f) => ({ ...f, name, slug: editId ? f.slug : autoSlug(name) }));
                    }}
                    required
                  />
                </div>
                <div>
                  <Label>Slug (URL)</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    required
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    URL: {form.slug ? buildPublicLandingUrl(form.slug) : `${getPublicLandingBaseUrl()}/?ref=...`}
                  </p>
                </div>
                <div>
                  <Label>Link de Afiliado</Label>
                  <Input
                    value={form.affiliate_link}
                    onChange={(e) => setForm((f) => ({ ...f, affiliate_link: e.target.value }))}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
                  <Label>Ativo</Label>
                </div>
                <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Todos os influenciadores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {influencers?.map((inf) => (
                  <TableRow key={inf.id}>
                    <TableCell className="font-medium">{inf.name}</TableCell>
                    <TableCell className="text-muted-foreground">?ref={inf.slug}</TableCell>
                    <TableCell className="text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${inf.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {inf.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => copyLink(inf.slug)} title="Copiar link">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/influencers/${inf.id}`)} title="Detalhes">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { if (confirm("Remover este influenciador?")) deleteMutation.mutate(inf.id); }}
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!influencers || influencers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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

export default Influencers;
