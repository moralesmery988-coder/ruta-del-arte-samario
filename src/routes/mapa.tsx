import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, MapPin, Navigation, Route as RouteIcon } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { puntosInteres } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa artesanal | Ruta del Arte Samario" },
      { name: "description", content: "Ubica artesanos y puntos de interés artesanal en Santa Marta y el Magdalena, con indicaciones para llegar." },
      { property: "og:title", content: "Mapa y ruta artesanal" },
      { property: "og:description", content: "Recorre Santa Marta descubriendo talleres y mercados artesanales, con indicaciones paso a paso." },
    ],
  }),
  component: Mapa,
});

const comoLlegar = (destino: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${destino}, Santa Marta, Colombia`)}`;

function Mapa() {
  const { artesanos } = useApp();
  const [seleccion, setSeleccion] = useState("a1");
  const activo = artesanos.find((a) => a.id === seleccion) ?? artesanos[0];
  if (!activo) {
    return (
      <AppShell>
        <p className="py-16 text-center text-sm text-muted-foreground">Cargando la ruta artesanal…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Ruta artesanal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Talleres, mercados y puntos de interés de la artesanía samaria. Toca un punto para ver el artesano y sigue
          la ruta sugerida para no perderte ninguno.
        </p>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border bg-[oklch(0.88_0.06_205)] shadow-card">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-[oklch(0.82_0.09_200)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 rounded-t-[40%] bg-[oklch(0.9_0.05_120)]" />
            <div className="absolute bottom-0 right-0 h-1/2 w-2/3 rounded-tl-[60%] bg-[oklch(0.78_0.09_150)]" />
            <p className="absolute left-4 top-3 text-xs font-medium uppercase tracking-[0.2em] text-[oklch(0.35_0.06_240)]">
              Bahía de Santa Marta
            </p>

            {puntosInteres.map((p) => (
              <span
                key={p.nombre}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(1_0_0/0.85)] px-2 py-1 text-[10px] font-medium shadow-card"
              >
                ★ {p.nombre}
              </span>
            ))}

            {artesanos.map((a, i) => (
              <button
                key={a.id}
                onClick={() => setSeleccion(a.id)}
                style={{ left: `${a.coords.x}%`, top: `${a.coords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-full transition-transform ${
                  seleccion === a.id ? "scale-125" : "hover:scale-110"
                }`}
                aria-label={a.nombre}
              >
                <MapPin
                  className={`h-7 w-7 drop-shadow ${seleccion === a.id ? "text-accent" : "text-primary"}`}
                  fill="currentColor"
                />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-card text-[9px] font-bold text-foreground shadow">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>

          <div>
            <article className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <img src={activo.foto} alt={activo.nombre} loading="lazy" className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <h2 className="font-display text-lg font-bold">{activo.nombre}</h2>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Navigation className="h-3.5 w-3.5" /> {activo.ubicacion}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{activo.descripcion}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/artesano/$id"
                  params={{ id: activo.id }}
                  className="inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Ver perfil completo
                </Link>
                <a
                  href={comoLlegar(activo.taller)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
                >
                  Cómo llegar <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>

            <ul className="mt-4 space-y-2">
              {artesanos.map((a, i) => (
                <li key={a.id}>
                  <button
                    onClick={() => setSeleccion(a.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm ${
                      seleccion === a.id ? "border-accent bg-secondary" : "border-border bg-card"
                    }`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{a.taller}</span>
                      <span className="block truncate text-xs text-muted-foreground">{a.ubicacion}</span>
                    </span>
                    <MapPin className="h-4 w-4 shrink-0 text-accent" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-card md:p-7">
          <h2 className="inline-flex items-center gap-2 font-display text-xl font-bold">
            <RouteIcon className="h-5 w-5 text-accent" /> Recorrido sugerido
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sigue este orden para recorrer la ruta completa a pie o en transporte local. Cada parada abre las
            indicaciones en tu aplicación de mapas.
          </p>
          <ol className="mt-5 space-y-3">
            {[...puntosInteres, ...artesanos.map((a) => ({ nombre: a.taller, tipo: "Taller artesanal", x: 0, y: 0 }))].map(
              (p, i) => (
                <li key={p.nombre} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.nombre}</span>
                    <span className="text-xs text-muted-foreground">{p.tipo}</span>
                  </span>
                  <a
                    href={comoLlegar(p.nombre)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
                  >
                    Cómo llegar <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ),
            )}
          </ol>
        </section>
      </div>
    </AppShell>
  );
}
