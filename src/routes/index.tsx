import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import hero from "@/assets/hero-santa-marta.jpg";
import logo from "@/assets/logo.png.asset.json";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { artesanos, categorias } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ruta del Arte Samario | Artesanías de Santa Marta" },
      {
        name: "description",
        content:
          "Descubre y compra artesanías de Santa Marta y el Magdalena directamente a sus artesanos: mochilas, cerámica, madera y más.",
      },
      { property: "og:title", content: "Ruta del Arte Samario" },
      {
        property: "og:description",
        content: "Construyendo cultura, apoyando talento local: artesanías del Caribe colombiano.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { productos, usuario } = useApp();
  const destacados = productos.filter((p) => p.destacado).slice(0, 6);

  return (
    <AppShell>
      <section className="relative">
        <img
          src={hero}
          alt="Bahía de Santa Marta al atardecer"
          width={1600}
          height={1000}
          className="h-[76vh] max-h-[620px] w-full object-cover md:h-[68vh]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.05_250/0.92)] via-[oklch(0.2_0.05_250/0.45)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-10">
          <img src={logo.url} alt="Logo Ruta del Arte Samario" className="mb-4 h-20 w-20 rounded-full shadow-suave" />
          <h1 className="font-display text-4xl font-bold text-[oklch(0.985_0.01_85)] md:text-6xl">
            Ruta del Arte Samario
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[oklch(0.94_0.02_85/0.9)] md:text-base">
            Construyendo cultura, apoyando talento local. Artesanías hechas a mano en Santa Marta y el Magdalena,
            con la historia de quien las creó.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/explorar"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-suave"
            >
              Explorar artesanías <ArrowRight className="h-4 w-4" />
            </Link>
            {!usuario && (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-[oklch(1_0_0/0.5)] px-6 py-3 text-sm font-semibold text-[oklch(0.985_0.01_85)]"
              >
                Crear cuenta / Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="font-display text-2xl font-bold">Categorías</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categorias.map((c) => (
            <Link
              key={c.nombre}
              to="/explorar"
              search={{ categoria: c.nombre }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card transition-colors hover:bg-secondary"
            >
              <img src={c.img} alt={c.nombre} loading="lazy" className="h-12 w-12 rounded-xl object-cover" />
              <span className="text-sm font-medium leading-tight">{c.nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <Link
          to="/mapa"
          className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-card transition-colors hover:bg-secondary"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <MapPin className="h-7 w-7" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-bold">Mapa de la ruta artesanal</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              Ubica los talleres y mercados de Santa Marta y sigue el recorrido sugerido con indicaciones para llegar.
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-4 pt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">Artesanías destacadas</h2>
          <Link to="/explorar" className="text-sm font-medium text-primary">
            Ver todas
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {destacados.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-3xl bg-caribe p-6 text-[oklch(0.985_0.01_85)] md:p-10">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4" /> Historias que se tejen
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">Detrás de cada pieza hay una vida</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {artesanos.slice(0, 3).map((a) => (
              <Link
                key={a.id}
                to="/artesano/$id"
                params={{ id: a.id }}
                className="rounded-2xl bg-[oklch(1_0_0/0.12)] p-4 backdrop-blur transition-colors hover:bg-[oklch(1_0_0/0.2)]"
              >
                <img src={a.foto} alt={a.nombre} loading="lazy" className="h-14 w-14 rounded-full object-cover" />
                <p className="mt-3 font-display text-base font-semibold">{a.nombre}</p>
                <p className="text-xs opacity-80">{a.ubicacion}</p>
                <p className="mt-2 line-clamp-3 text-xs opacity-90">{a.historia}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
