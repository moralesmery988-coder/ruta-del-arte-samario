import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Compass, Heart, Home, MapPin, MessageCircle, ShoppingBag, Store, User } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import logo from "@/assets/logo.png.asset.json";
import { metodosPago } from "@/lib/data";
import { useApp } from "@/lib/store";

const navDesktop = [
  { to: "/", label: "Inicio" },
  { to: "/explorar", label: "Explorar" },
  { to: "/mapa", label: "Mapa" },
  { to: "/favoritos", label: "Favoritos" },
  { to: "/mensajes", label: "Chats" },
  { to: "/pedidos", label: "Pedidos" },
] as const;

const navMovil = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
  { to: "/mensajes", label: "Chats", icon: MessageCircle },
  { to: "/carrito", label: "Carrito", icon: ShoppingBag },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

function CampanaNotificaciones() {
  const { notificaciones, marcarNotificacionesLeidas } = useApp();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sinLeer = notificaciones.filter((n) => !n.leida).length;

  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, [abierto]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          const siguiente = !abierto;
          setAbierto(siguiente);
          if (siguiente && sinLeer > 0) marcarNotificacionesLeidas();
        }}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        aria-label={`Notificaciones${sinLeer > 0 ? `, ${sinLeer} sin leer` : ""}`}
        aria-expanded={abierto}
      >
        <Bell className="h-5 w-5" />
        {sinLeer > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
            {sinLeer}
          </span>
        )}
      </button>
      {abierto && (
        <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-popover p-3 shadow-card">
          <p className="px-2 pb-2 font-display text-sm font-bold">Notificaciones</p>
          {notificaciones.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              Aquí verás avisos de pedidos, mensajes y novedades.
            </p>
          ) : (
            <ul className="max-h-72 space-y-1 overflow-y-auto">
              {notificaciones.slice(0, 8).map((n) => (
                <li key={n.id} className="rounded-xl bg-muted/60 px-3 py-2.5">
                  <p className="text-xs font-semibold">{n.titulo}</p>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{n.detalle}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    {new Date(n.fecha).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { carrito, usuario, favoritos, conversaciones } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const total = carrito.reduce((a, b) => a + b.cantidad, 0);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img src={logo.url} alt="Logo Ruta del Arte Samario" className="h-11 w-11 shrink-0 rounded-full object-cover" />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-semibold">Ruta del Arte</span>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-accent">Samario</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {navDesktop.map((n) => {
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

          <div className="ml-auto flex items-center gap-2 md:ml-2">
            <CampanaNotificaciones />
            <Link
              to="/carrito"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
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

      <footer className="mt-16 border-t border-border bg-sand">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 text-sm sm:grid-cols-3">
          <div>
            <p className="font-display font-bold text-foreground">Compra protegida</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Pagos seguros y devoluciones hasta 15 días después de la entrega. Tu dinero solo se libera al artesano
              cuando confirmas que recibiste tu pedido.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {metodosPago.map((m) => (
                <span key={m} className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-display font-bold text-foreground">Ayuda y contacto</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Escríbenos a hola@rutadelartesamario.co o al +57 300 555 0000. Resolvemos dudas sobre pedidos, envíos y
              devoluciones.
            </p>
          </div>
          <div>
            <p className="font-display font-bold text-foreground">Ruta del Arte Samario</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Construyendo cultura, apoyando talento local · Santa Marta, Magdalena, Colombia.
            </p>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-6">
          {navMovil.map((n) => {
            const Icon = n.icon;
            const activo = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            const badge =
              n.to === "/carrito" ? total : n.to === "/favoritos" ? favoritos.length : n.to === "/mensajes" ? conversaciones.length : 0;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
                  activo ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {badge > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground">
                      {badge}
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
