import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { artesanos, formatoCOP } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/producto/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de artesanía | Ruta del Arte Samario" },
      { name: "description", content: "Conoce la pieza, su precio, disponibilidad y el artesano que la elaboró." },
      { property: "og:title", content: "Detalle de artesanía" },
      { property: "og:description", content: "Artesanías hechas a mano en Santa Marta y el Magdalena." },
    ],
  }),
  component: DetalleProducto,
});

function DetalleProducto() {
  const { id } = Route.useParams();
  const { productos, agregarAlCarrito } = useApp();
  const navigate = useNavigate();
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return (
      <AppShell>
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Producto no encontrado</h1>
          <Link to="/explorar" className="mt-4 inline-block text-primary">
            Volver a explorar
          </Link>
        </div>
      </AppShell>
    );
  }

  const artesano = artesanos.find((a) => a.id === producto.artesanoId);
  const relacionados = productos.filter((p) => p.categoria === producto.categoria && p.id !== producto.id).slice(0, 4);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-6">
        <button onClick={() => navigate({ to: "/explorar" })} className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              loading="lazy"
              className="aspect-square w-full rounded-3xl object-cover shadow-card"
            />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <img
                  key={i}
                  src={producto.imagen}
                  alt={`${producto.nombre} vista ${i + 1}`}
                  loading="lazy"
                  className="aspect-square w-full rounded-xl object-cover opacity-80"
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">{producto.categoria}</p>
            <h1 className="mt-2 font-display text-3xl font-bold">{producto.nombre}</h1>
            <p className="mt-3 text-2xl font-semibold text-primary">{formatoCOP(producto.precio)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {producto.disponible > 0 ? `Disponible: ${producto.disponible} unidades` : "Agotado por ahora"}
            </p>
            <p className="mt-5 text-sm leading-relaxed">{producto.descripcion}</p>

            {artesano && (
              <Link
                to="/artesano/$id"
                params={{ id: artesano.id }}
                className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <img src={artesano.foto} alt={artesano.nombre} loading="lazy" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-display font-semibold">{artesano.nombre}</p>
                  <p className="text-xs text-muted-foreground">{artesano.ubicacion}</p>
                </div>
              </Link>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  agregarAlCarrito(producto.id);
                  toast.success("Agregado al carrito", { description: producto.nombre });
                }}
                disabled={producto.disponible === 0}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" /> Agregar al carrito
              </button>
              {artesano && (
                <a
                  href={`mailto:${artesano.correo}?subject=${encodeURIComponent(producto.nombre)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-input px-6 py-3 text-sm font-semibold"
                >
                  <MessageCircle className="h-4 w-4" /> Contactar artesano
                </a>
              )}
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">También te puede gustar</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {relacionados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
