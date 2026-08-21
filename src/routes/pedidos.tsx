import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Package } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { formatoCOP } from "@/lib/data";
import { estadosPedido, useApp } from "@/lib/store";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Mis pedidos | Ruta del Arte Samario" },
      { name: "description", content: "Consulta el estado de tus pedidos: recibido, en preparación, enviado o entregado." },
      { property: "og:title", content: "Seguimiento de pedidos" },
      { property: "og:description", content: "Sigue tu compra de artesanías paso a paso." },
    ],
  }),
  component: Pedidos,
});

function Pedidos() {
  const { pedidos, avanzarPedido } = useApp();

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Mis pedidos</h1>

        {pedidos.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Aún no tienes pedidos.</p>
            <Link
              to="/explorar"
              className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Explorar artesanías
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {pedidos.map((pedido) => {
              const indice = estadosPedido.indexOf(pedido.estado);
              return (
                <article key={pedido.id} className="rounded-3xl border border-border bg-card p-5 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-display text-lg font-bold">{pedido.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(pedido.fecha).toLocaleDateString("es-CO", { dateStyle: "long" })}
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{pedido.estado}</span>
                  </div>

                  <ol className="mt-5 grid grid-cols-4 gap-1">
                    {estadosPedido.map((e, i) => (
                      <li key={e} className="text-center">
                        <div
                          className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                            i <= indice ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i <= indice ? <Check className="h-4 w-4" /> : i + 1}
                        </div>
                        <p className="mt-1.5 text-[10px] leading-tight text-muted-foreground">{e}</p>
                      </li>
                    ))}
                  </ol>

                  <ul className="mt-5 space-y-2">
                    {pedido.items.map((i) => (
                      <li key={i.productoId} className="flex items-center gap-3 text-sm">
                        <img src={i.imagen} alt={i.nombre} loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
                        <span className="flex-1">
                          {i.nombre} <span className="text-muted-foreground">x{i.cantidad}</span>
                        </span>
                        <span>{formatoCOP(i.precio * i.cantidad)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-semibold">Total {formatoCOP(pedido.total)}</span>
                    {pedido.estado !== "Entregado" && (
                      <button
                        onClick={() => avanzarPedido(pedido.id)}
                        className="rounded-full border border-input px-4 py-2 text-xs font-medium"
                      >
                        Actualizar estado
                      </button>
                    )}
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
