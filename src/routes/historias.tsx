import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { categorias, type Categoria } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/historias")({
  head: () => ({
    meta: [
      { title: "Historias que se tejen | Ruta del Arte Samario" },
      { name: "description", content: "Técnicas tradicionales, materiales y significado cultural de la artesanía de Santa Marta y el Magdalena." },
      { property: "og:title", content: "Historias que se tejen" },
      { property: "og:description", content: "Conoce a quienes crean, sus técnicas y las tradiciones detrás de cada pieza." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Historias,
});

const significados: Partial<Record<Categoria, string>> = {
  "Tejidos y mochilas": "En la mochila wayuu cada kanasü (figura geométrica) es un lenguaje: caminos, animales y astros que guían la vida en La Guajira.",
  "Cerámica": "La arcilla del Caribe guarda la memoria tayrona: vasijas, figuras y motivos que unían lo cotidiano con lo sagrado.",
  "Madera": "Las maderas recuperadas se convierten en utensilios y esculturas que celebran la fauna y la vida costera.",
  "Accesorios": "Semillas, chaquiras y fibras de la Sierra Nevada se combinan en piezas que hablan de protección y territorio.",
  "Sandalias y calzado": "El cuero y el tejido se unen en calzado hecho a mano para caminar el calor del Caribe.",
  "Decoración": "Fique, iraca y macramé: fibras del Magdalena trenzadas en hamacas y piezas para el hogar.",
};

function Historias() {
  const { artesanos, productos } = useApp();
  const [tradicion, setTradicion] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const tradiciones = [...new Set(artesanos.map((a) => a.tradicion).filter(Boolean))];
  const conHistoria = artesanos.filter((a) => a.historia && (!tradicion || a.tradicion === tradicion));
  const piezas = productos.filter((p) => {
    const a = artesanos.find((x) => x.id === p.artesanoId);
    return (!categoria || p.categoria === categoria) && (!tradicion || a?.tradicion === tradicion);
  });
  const chip = (activo: boolean) => `shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium ${activo ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card"}`;

  return (
    <AppShell>
      <div className="bg-caribe px-5 py-10 text-[oklch(0.985_0.01_85)]">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.25em] opacity-80">Experiencia cultural</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Historias que se tejen</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-90">
            Detrás de cada pieza hay una técnica heredada, un material de la región y un significado. Descúbrelos por tradición cultural o tipo de artesanía.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <p className="text-sm font-semibold">Tradición cultural</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setTradicion(null)} className={chip(!tradicion)}>Todas</button>
          {tradiciones.map((t) => <button key={t} onClick={() => setTradicion(t)} className={chip(tradicion === t)}>{t}</button>)}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {conHistoria.map((a) => (
            <article key={a.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              <div className="flex items-center gap-3 p-5 pb-0">
                <img src={a.foto} alt={a.nombre} loading="lazy" className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <h2 className="font-display text-lg font-bold">{a.nombre}</h2>
                  <p className="text-xs text-muted-foreground">{a.taller} · {a.ubicacion}</p>
                </div>
              </div>
              <div className="space-y-3 p-5 text-sm leading-relaxed">
                <p className="italic">“{a.historia.slice(0, 260)}{a.historia.length > 260 ? "…" : ""}”</p>
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  {a.tecnica && <div className="rounded-xl bg-sand p-2.5"><dt className="font-semibold">Técnica</dt><dd className="text-muted-foreground">{a.tecnica}</dd></div>}
                  {a.tradicion && <div className="rounded-xl bg-sand p-2.5"><dt className="font-semibold">Tradición</dt><dd className="text-muted-foreground">{a.tradicion}</dd></div>}
                </dl>
                {a.proceso && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Materiales y proceso: </span>{a.proceso}</p>}
                <Link to="/artesano/$id" params={{ id: a.id }} className="inline-block text-sm font-semibold text-primary">Conocer su tienda →</Link>
              </div>
            </article>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold">Descubre por tipo de artesanía</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCategoria(null)} className={chip(!categoria)}>Todas</button>
          {categorias.map((c) => <button key={c.nombre} onClick={() => setCategoria(c.nombre)} className={chip(categoria === c.nombre)}>{c.icono} {c.nombre}</button>)}
        </div>
        {categoria && significados[categoria] && (
          <p className="mt-4 rounded-2xl bg-sand p-4 text-sm leading-relaxed">{significados[categoria]}</p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {piezas.slice(0, 12).map((p) => <ProductCard key={p.id} producto={p} />)}
        </div>
        {piezas.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No hay piezas con este filtro todavía.</p>}
      </div>
    </AppShell>
  );
}
