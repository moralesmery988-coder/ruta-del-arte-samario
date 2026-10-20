import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/restablecer")({
  head: () => ({
    meta: [
      { title: "Nueva contraseña | Ruta del Arte Samario" },
      { name: "description", content: "Crea una nueva contraseña para tu cuenta de Ruta del Arte Samario." },
      { property: "og:title", content: "Restablecer contraseña" },
      { property: "og:description", content: "Recupera el acceso a tu cuenta." },
    ],
  }),
  component: Restablecer,
});

function Restablecer() {
  const [clave, setClave] = useState("");
  const navigate = useNavigate();
  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clave.length < 8) { toast.error("Mínimo 8 caracteres"); return; }
    const { error } = await supabase.auth.updateUser({ password: clave });
    if (error) { toast.error("No se pudo cambiar", { description: error.message }); return; }
    toast.success("Contraseña actualizada");
    navigate({ to: "/perfil" });
  };
  return (
    <AppShell>
      <form onSubmit={guardar} className="mx-auto max-w-md space-y-4 px-5 py-12">
        <h1 className="font-display text-3xl font-bold">Nueva contraseña</h1>
        <label className="block text-sm font-medium">
          Contraseña nueva
          <input type="password" required value={clave} onChange={(e) => setClave(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <button className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-accent-foreground">Guardar</button>
      </form>
    </AppShell>
  );
}
