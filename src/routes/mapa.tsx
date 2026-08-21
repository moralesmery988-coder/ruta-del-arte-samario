import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { artesanos, puntosInteres } from "@/lib/data";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa artesanal | Ruta del Arte Samario" },
      { name: "description", content: "Ubica artesanos y puntos de interés artesanal en Santa Marta y el Magdalena." },
      { property: "og:title", content: "Mapa y ruta artesanal" },
      { property: "og:description", content: "Recorre Santa Marta descubriendo talleres y mercados artesanales." },
    ],
  }),
  component: Mapa,
});

function Mapa() {
  const [seleccion, setSeleccion] = useState(artesanos[0]!.id);
  const activo = artesanos.find((a) => a.id === seleccion)!;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Ruta artesanal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Talleres, mercados y puntos de interés de la artesanía samaria. Toca un punto para ver el artesano.
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

            {artesanos.map((a) => (
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
              <Link
                to="/artesano/$id"
                params={{ id: activo.id }}
                className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Ver perfil completo
              </Link>
            </article>

            <ul className="mt-4 space-y-2">
              {artesanos.map((a) => (
                <li key={a.id}>
                  <button
                    onClick={() => setSeleccion(a.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm ${
                      seleccion === a.id ? "border-accent bg-secondary" : "border-border bg-card"
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="flex-1 font-medium">{a.taller}</span>
                    <span className="text-xs text-muted-foreground">{a.ubicacion}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
