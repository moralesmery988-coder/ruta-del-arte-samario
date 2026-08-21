import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { artesanos } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/artesano/$id")({
  head: () => ({
    meta: [
      { title: "Perfil del artesano | Ruta del Arte Samario" },
      { name: "description", content: "Conoce la historia, el taller y los productos de los artesanos samarios." },
      { property: "og:title", content: "Perfil del artesano" },
      { property: "og:description", content: "Historias y oficios artesanales de Santa Marta y el Magdalena." },
    ],
  }),
  component: PerfilArtesano,
});

function PerfilArtesano() {
  const { id } = Route.useParams();
  const { productos } = useApp();
  const artesano = artesanos.find((a) => a.id === id);

  if (!artesano) {
    return (
      <AppShell>
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Artesano no encontrado</h1>
          <Link to="/explorar" className="mt-4 inline-block text-primary">
            Explorar artesanías
          </Link>
        </div>
      </AppShell>
    );
  }

  const suyos = productos.filter((p) => p.artesanoId === artesano.id);

  return (
    <AppShell>
      <div className="bg-caribe px-5 py-10 text-[oklch(0.985_0.01_85)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={artesano.foto}
            alt={artesano.nombre}
            loading="lazy"
            className="h-24 w-24 rounded-full border-4 border-[oklch(1_0_0/0.4)] object-cover"
          />
          <div>
            <h1 className="font-display text-3xl font-bold">{artesano.nombre}</h1>
            <p className="text-sm opacity-90">{artesano.taller}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm opacity-90">
              <MapPin className="h-4 w-4" /> {artesano.ubicacion}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <p className="text-sm leading-relaxed text-muted-foreground">{artesano.descripcion}</p>

        <section className="mt-6 rounded-3xl border border-border bg-sand p-6">
          <h2 className="font-display text-xl font-bold">Su historia</h2>
          <p className="mt-3 text-[15px] leading-relaxed">{artesano.historia}</p>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href={`tel:${artesano.telefono}`}
            className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm"
          >
            <Phone className="h-4 w-4 text-accent" /> {artesano.telefono}
          </a>
          <a
            href={`mailto:${artesano.correo}`}
            className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm"
          >
            <Mail className="h-4 w-4 text-accent" /> {artesano.correo}
          </a>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Productos publicados</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {suyos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>

        <Link
          to="/mapa"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          <MapPin className="h-4 w-4" /> Ver en el mapa artesanal
        </Link>
      </div>
    </AppShell>
  );
}
