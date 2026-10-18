import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Hammer, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { QrTarjeta } from "@/components/QrTarjeta";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/artesano/$id")({
  head: () => ({
    meta: [
      { title: "Perfil del artesano | Ruta del Arte Samario" },
      { name: "description", content: "Conoce la historia, el proceso de elaboración y los productos de los artesanos samarios." },
      { property: "og:title", content: "Perfil del artesano" },
      { property: "og:description", content: "Historias y oficios artesanales de Santa Marta y el Magdalena." },
    ],
  }),
  component: PerfilArtesano,
});

function PerfilArtesano() {
  const { id } = Route.useParams();
  const { productos, iniciarConversacion, artesanos, publicaciones, usuario, cargando } = useApp();
  const navigate = useNavigate();
  const artesano = artesanos.find((a) => a.id === id);

  if (!artesano && cargando) {
    return (
      <AppShell>
        <p className="py-16 text-center text-sm text-muted-foreground">Cargando…</p>
      </AppShell>
    );
  }

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

  const posts = publicaciones.filter((p) => p.artesanoId === artesano.id && !p.oculta).slice(0, 6);
  const esMio = !!artesano.userId && artesano.userId === usuario?.id;

  const escribir = async () => {
    if (!usuario) {
      toast("Inicia sesión para escribir al artesano");
      navigate({ to: "/auth" });
      return;
    }
    const conId = await iniciarConversacion(artesano.id);
    if (!conId) return void toast.error("No se pudo abrir la conversación");
    navigate({ to: "/mensajes", search: { con: conId } });
  };

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
          <div className="min-w-0">
            <h1 className="flex flex-wrap items-center gap-2 font-display text-3xl font-bold">
              {artesano.nombre}
              {artesano.verificado && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(1_0_0/0.2)] px-2.5 py-1 text-[11px] font-semibold">
                  <BadgeCheck className="h-3.5 w-3.5" /> Artesano verificado
                </span>
              )}
            </h1>
            <p className="text-sm opacity-90">{artesano.taller}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm opacity-90">
              <MapPin className="h-4 w-4" /> {artesano.ubicacion}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <p className="text-sm leading-relaxed text-muted-foreground">{artesano.descripcion}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          {!esMio && <button
            onClick={escribir}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground"
          >
            <MessageCircle className="h-4 w-4" /> Escribir al artesano
          </button>}
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-5 py-3 text-sm font-semibold"
          >
            <MapPin className="h-4 w-4" /> Ver en el mapa artesanal
          </Link>
          <QrTarjeta ruta={`/artesano/${artesano.id}`} titulo={artesano.nombre} subtitulo={artesano.taller || artesano.ubicacion} nombreArchivo={`qr-artesano-${artesano.id}`} />
        </div>

        {artesano.contactoPublico && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5 text-sm">
            <Phone className="h-4 w-4 text-accent" /> Contacto autorizado: {artesano.contactoPublico}
          </p>
        )}

        {(artesano.tecnica || artesano.tradicion) && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {artesano.tecnica && <span className="rounded-full border border-border bg-card px-3 py-1.5">Técnica: {artesano.tecnica}</span>}
            {artesano.tradicion && <span className="rounded-full border border-border bg-card px-3 py-1.5">Tradición: {artesano.tradicion}</span>}
          </div>
        )}

        <section className="mt-6 rounded-3xl border border-border bg-sand p-6">
          <h2 className="font-display text-xl font-bold">Su historia</h2>
          <p className="mt-3 text-[15px] leading-relaxed">{artesano.historia || "Pronto conocerás la historia de este taller."}</p>
        </section>

        <section className="mt-6 rounded-3xl border border-border bg-card p-6">
          <h2 className="inline-flex items-center gap-2 font-display text-xl font-bold">
            <Hammer className="h-5 w-5 text-accent" /> Su proceso de elaboración
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{artesano.proceso || "Aún no ha descrito su proceso."}</p>
        </section>

        {posts.length > 0 && (
          <section className="mt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-bold">Desde su taller</h2>
              <Link to="/taller" className="text-sm text-primary">Ver Mi taller</Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {posts.map((p) => (
                <figure key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  {p.tipo === "video" ? (
                    <video src={p.mediaUrl} controls playsInline className="aspect-square w-full object-cover" />
                  ) : (
                    <img src={p.mediaUrl} alt={p.texto || "Publicación del taller"} loading="lazy" className="aspect-square w-full object-cover" />
                  )}
                  {p.texto && <figcaption className="p-2.5 text-xs text-muted-foreground">{p.texto}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Productos publicados ({suyos.length})</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {suyos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
          {suyos.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">Este artesano aún no tiene productos publicados.</p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
