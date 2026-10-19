import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Package } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { formatoCOP } from "@/lib/data";
import { estadosPedido, etiquetaEstado, useApp } from "@/lib/store";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Mis pedidos | Ruta del Arte Samario" },
      { name: "description", content: "Consulta el estado de tus pedidos: pendiente, confirmado, en preparación, enviado o entregado." },
      { property: "og:title", content: "Seguimiento de pedidos" },
      { property: "og:description", content: "Sigue tu compra de artesanías paso a paso." },
    ],
  }),
  component: Pedidos,
});

const fechaCorta = (f: string) => new Date(f).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });

function Pedidos() {
  const { pedidos, usuario, artesanos } = useApp();
  const mios = pedidos.filter((p) => p.compradorId === usuario?.id);

  if (!usuario) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md px-5 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Inicia sesión para ver tus pedidos</h1>
          <Link to="/auth" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground">Iniciar sesión</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Mis pedidos</h1>
        {mios.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Aún no tienes pedidos.</p>
            <Link to="/explorar" className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground">Explorar artesanías</Link>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {mios.map((pedido) => {
              const indice = estadosPedido.indexOf(pedido.estado);
              const artesano = artesanos.find((a) => a.id === pedido.artesanoId);
              return (
                <article key={pedido.id} className="rounded-3xl border border-border bg-card p-5 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-display text-lg font-bold">{pedido.codigo}</p>
                      <p className="text-xs text-muted-foreground">{fechaCorta(pedido.fecha)} · {artesano?.nombre ?? "Artesano"}</p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{etiquetaEstado[pedido.estado]}</span>
                  </div>

                  {pedido.estado !== "cancelado" && (
                    <ol className="mt-5 grid grid-cols-5 gap-1">
                      {estadosPedido.map((e, i) => {
                        const h = pedido.historial.find((x) => x.estado === e);
                        return (
                          <li key={e} className="text-center">
                            <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs ${i <= indice ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                              {i <= indice ? <Check className="h-4 w-4" /> : i + 1}
                            </div>
                            <p className="mt-1.5 text-[10px] leading-tight text-muted-foreground">{etiquetaEstado[e]}</p>
                            {h && <p className="text-[9px] text-muted-foreground/70">{new Date(h.fecha).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}</p>}
                          </li>
                        );
                      })}
                    </ol>
                  )}

                  <ul className="mt-5 space-y-2">
                    {pedido.items.map((i, k) => (
                      <li key={k} className="flex items-center gap-3 text-sm">
                        <img src={i.imagen} alt={i.nombre} loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
                        <span className="flex-1">{i.nombre} <span className="text-muted-foreground">x{i.cantidad}</span></span>
                        <span>{formatoCOP(i.precio * i.cantidad)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t border-border pt-3 text-sm">
                    <p className="font-semibold">Total {formatoCOP(pedido.total)}</p>
                    <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      {pedido.historial.map((h, k) => <li key={k}>{fechaCorta(h.fecha)} — {etiquetaEstado[h.estado]}</li>)}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
