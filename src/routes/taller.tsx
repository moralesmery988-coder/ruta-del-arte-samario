import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/taller")({
  head: () => ({
    meta: [
      { title: "Mi taller: procesos y creaciones | Ruta del Arte Samario" },
      { name: "description", content: "Fotos y videos de los talleres artesanales de Santa Marta: procesos, nuevas creaciones y el día a día." },
      { property: "og:title", content: "Mi taller — Ruta del Arte Samario" },
      { property: "og:description", content: "Mira cómo nacen las artesanías samarias, directo desde los talleres." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TallerPublico,
});

function TallerPublico() {
  const { publicaciones, artesanos, usuario, reportarPublicacion, cargando } = useApp();
  const visibles = publicaciones.filter((p) => !p.oculta);

  const reportar = async (id: string) => {
    if (!usuario) return void toast("Inicia sesión para reportar");
    const motivo = prompt("¿Por qué reportas esta publicación?") ?? "";
    if (!motivo.trim()) return;
    const r = await reportarPublicacion(id, motivo.trim());
    if (r.ok) toast.success("Gracias, revisaremos la publicación"); else toast.error(r.error);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Desde los talleres</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Mi taller</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Los artesanos comparten sus procesos, materiales y nuevas creaciones. Toca el nombre para conocer su tienda.
        </p>
        {cargando ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">Cargando…</p>
        ) : visibles.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aún no hay publicaciones. Los artesanos pueden compartir desde su Panel → Mi taller.
          </div>
        ) : (
          <div className="mt-6 columns-2 gap-4 sm:columns-3">
            {visibles.map((p) => {
              const a = artesanos.find((x) => x.id === p.artesanoId);
              return (
                <figure key={p.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                  {p.tipo === "video" ? <video src={p.mediaUrl} controls playsInline className="w-full" />
                    : <img src={p.mediaUrl} alt={p.texto || `Publicación de ${a?.nombre ?? "artesano"}`} loading="lazy" className="w-full" />}
                  <figcaption className="p-3">
                    {a && (
                      <Link to="/artesano/$id" params={{ id: a.id }} className="flex items-center gap-2">
                        <img src={a.foto} alt="" className="h-7 w-7 rounded-full object-cover" />
                        <span className="text-sm font-semibold">{a.nombre}</span>
                      </Link>
                    )}
                    {p.texto && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.texto}</p>}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{new Date(p.fecha).toLocaleDateString("es-CO", { dateStyle: "medium" })}</span>
                      {a && a.userId !== usuario?.id && (
                        <button onClick={() => reportar(p.id)} className="inline-flex items-center gap-1" aria-label="Reportar publicación">
                          <Flag className="h-3 w-3" /> Reportar
                        </button>
                      )}
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
