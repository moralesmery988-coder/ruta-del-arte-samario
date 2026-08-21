import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { formatoCOP } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Carrito | Ruta del Arte Samario" },
      { name: "description", content: "Revisa tus artesanías seleccionadas y confirma tu pedido." },
      { property: "og:title", content: "Carrito de compras" },
      { property: "og:description", content: "Confirma tu pedido de artesanías samarias." },
    ],
  }),
  component: Carrito,
});

function Carrito() {
  const { carrito, productos, cambiarCantidad, quitarDelCarrito, confirmarPedido } = useApp();
  const navigate = useNavigate();

  const items = carrito.flatMap((i) => {
    const p = productos.find((x) => x.id === i.productoId);
    return p ? [{ ...i, producto: p }] : [];
  });
  const subtotal = items.reduce((a, b) => a + b.producto.precio * b.cantidad, 0);
  const envio = subtotal > 0 ? 15000 : 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Todavía no has agregado artesanías.</p>
            <Link
              to="/explorar"
              className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Explorar artesanías
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-5 space-y-3">
              {items.map((i) => (
                <div key={i.productoId} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                  <img
                    src={i.producto.imagen}
                    alt={i.producto.nombre}
                    loading="lazy"
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-sm font-semibold leading-snug">{i.producto.nombre}</p>
                    <p className="text-sm text-primary">{formatoCOP(i.producto.precio)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => cambiarCantidad(i.productoId, i.cantidad - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-input"
                        aria-label="Restar"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm">{i.cantidad}</span>
                      <button
                        onClick={() => cambiarCantidad(i.productoId, i.cantidad + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-input"
                        aria-label="Sumar"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => quitarDelCarrito(i.productoId)}
                        className="ml-auto text-muted-foreground"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-border bg-sand p-5">
              <h2 className="font-display text-lg font-bold">Resumen de compra</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatoCOP(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Envío</dt>
                  <dd>{formatoCOP(envio)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="text-primary">{formatoCOP(subtotal + envio)}</dd>
                </div>
              </dl>
              <button
                onClick={() => {
                  const pedido = confirmarPedido();
                  if (pedido) {
                    toast.success("Pedido confirmado", { description: `Número ${pedido.id}` });
                    navigate({ to: "/pedidos" });
                  }
                }}
                className="mt-5 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-accent-foreground"
              >
                Confirmar pedido
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
