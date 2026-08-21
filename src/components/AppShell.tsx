import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, MapPin, ShoppingBag, User, Store } from "lucide-react";
import type { ReactNode } from "react";
import logo from "@/assets/logo.png.asset.json";
import { useApp } from "@/lib/store";

const nav = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/mapa", label: "Mapa", icon: MapPin },
  { to: "/carrito", label: "Carrito", icon: ShoppingBag },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { carrito, usuario } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const total = carrito.reduce((a, b) => a + b.cantidad, 0);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo.url} alt="Logo Ruta del Arte Samario" className="h-11 w-11 rounded-full object-cover" />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-semibold">Ruta del Arte</span>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-accent">Samario</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const activo = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    activo ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
            {usuario?.tipo === "artesano" && (
              <Link
                to="/panel"
                className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground"
              >
                <Store className="h-4 w-4" /> Panel
              </Link>
            )}
          </nav>

          <div className="ml-auto md:ml-0">
            <Link
              to="/carrito"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
              aria-label="Carrito"
            >
              <ShoppingBag className="h-5 w-5" />
              {total > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
                  {total}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 hidden border-t border-border bg-sand md:block">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          Ruta del Arte Samario · Construyendo cultura, apoyando talento local · Santa Marta, Magdalena
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {nav.map((n) => {
            const Icon = n.icon;
            const activo = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  activo ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {n.to === "/carrito" && total > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground">
                      {total}
                    </span>
                  )}
                </span>
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
