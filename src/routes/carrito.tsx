import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { formatoCOP, metodosPago } from "@/lib/data";
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
  const { carrito, productos, cambiarCantidad, quitarDelCarrito, confirmarPedido, usuario } = useApp();
  const navigate = useNavigate();
  const [direccion, setDireccion] = useState("");
  const [enviando, setEnviando] = useState(false);

  const items = carrito.flatMap((i) => {
    const p = productos.find((x) => x.id === i.productoId);
    return p ? [{ ...i, producto: p }] : [];
  });
  const subtotal = items.reduce((a, b) => a + b.producto.precio * b.cantidad, 0);

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
                  <dd className="text-xs text-muted-foreground">Se acuerda con el artesano</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="text-primary">{formatoCOP(subtotal)}</dd>
                </div>
              </dl>
              {usuario ? (
                <>
                  <label className="mt-4 block text-sm font-medium">
                    Dirección de entrega
                    <input
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Ciudad, barrio, dirección"
                      className="mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                  <button
                    disabled={enviando}
                    onClick={async () => {
                      if (direccion.trim().length < 5) return void toast.error("Escribe la dirección de entrega");
                      setEnviando(true);
                      const r = await confirmarPedido(direccion.trim());
                      setEnviando(false);
                      if (!r.ok) return void toast.error("No se pudo registrar el pedido", { description: r.error });
                      toast.success("Pedido enviado al artesano", { description: `Número ${(r.codigos ?? []).join(", ")}` });
                      navigate({ to: "/pedidos" });
                    }}
                    className="mt-4 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
                  >
                    {enviando ? "Enviando…" : "Enviar pedido"}
                  </button>
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    El artesano confirma tu pedido y acuerda contigo el pago por el chat.
                  </p>
                </>
              ) : (
                <Link to="/auth" className="mt-5 block w-full rounded-full bg-accent py-3.5 text-center text-sm font-semibold text-accent-foreground">
                  Inicia sesión para hacer tu pedido
                </Link>
              )}
              <div className="mt-4 border-t border-border pt-4">
                <p className="inline-flex items-center gap-2 text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4 text-accent" /> Compra protegida
                </p>
                <p className="mt-1.5 inline-flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Devoluciones hasta 15 días después de la entrega.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {metodosPago.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
