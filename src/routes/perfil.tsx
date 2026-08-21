import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Package, Store, UserRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil | Ruta del Arte Samario" },
      { name: "description", content: "Gestiona tu cuenta de comprador o artesano, pedidos y panel de ventas." },
      { property: "og:title", content: "Mi perfil" },
      { property: "og:description", content: "Tu cuenta en la plataforma de artesanías samarias." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { usuario, salir, pedidos } = useApp();
  const navigate = useNavigate();

  if (!usuario) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md px-5 py-16 text-center">
          <UserRound className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold">Aún no has iniciado sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea tu cuenta como comprador o artesano para comprar, publicar y hacer seguimiento a tus pedidos.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
          >
            Crear cuenta / Iniciar sesión
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-5 py-6">
        <div className="flex items-center gap-4 rounded-3xl bg-caribe p-6 text-[oklch(0.985_0.01_85)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(1_0_0/0.2)] font-display text-2xl">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{usuario.nombre}</h1>
            <p className="text-sm opacity-90">{usuario.correo}</p>
            <span className="mt-1 inline-block rounded-full bg-[oklch(1_0_0/0.2)] px-3 py-0.5 text-xs capitalize">
              {usuario.tipo}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Link to="/pedidos" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Package className="h-5 w-5 text-accent" />
            <span className="flex-1 text-sm font-medium">Mis pedidos</span>
            <span className="text-xs text-muted-foreground">{pedidos.length}</span>
          </Link>
          {usuario.tipo === "artesano" && (
            <Link to="/panel" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <Store className="h-5 w-5 text-accent" />
              <span className="flex-1 text-sm font-medium">Panel de artesano</span>
            </Link>
          )}
          <button
            onClick={() => {
              salir();
              navigate({ to: "/" });
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left"
          >
            <LogOut className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
