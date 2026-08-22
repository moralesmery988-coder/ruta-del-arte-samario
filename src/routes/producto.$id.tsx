import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  MessageCircle,
  Package,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { artesanos, formatoCOP, metodosPago } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/producto/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de artesanía | Ruta del Arte Samario" },
      { name: "description", content: "Conoce la pieza, sus materiales, precio, disponibilidad y el artesano que la elaboró." },
      { property: "og:title", content: "Detalle de artesanía" },
      { property: "og:description", content: "Artesanías hechas a mano en Santa Marta y el Magdalena." },
    ],
  }),
  component: DetalleProducto,
});

function Estrellas({ valor, grande = false }: { valor: number; grande?: boolean }) {
  const clase = grande ? "h-5 w-5" : "h-4 w-4";
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${clase} ${i <= Math.round(valor) ? "fill-sol text-sol" : "text-muted-foreground/40"}`}
        />
      ))}
    </span>
  );
}

function DetalleProducto() {
  const { id } = Route.useParams();
  const {
    productos,
    agregarAlCarrito,
    favoritos,
    toggleFavorito,
    resenas,
    agregarResena,
    iniciarConversacion,
    usuario,
  } = useApp();
  const navigate = useNavigate();
  const producto = productos.find((p) => p.id === id);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [estrellasNueva, setEstrellasNueva] = useState(5);
  const [comentarioNuevo, setComentarioNuevo] = useState("");

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
  const relacionados = productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);
  const esFavorito = favoritos.includes(producto.id);
  const resenasProducto = resenas.filter((r) => r.productoId === producto.id);
  const promedio =
    resenasProducto.length > 0
      ? resenasProducto.reduce((a, r) => a + r.estrellas, 0) / resenasProducto.length
      : 0;
  const yaReseno = resenasProducto.some((r) => r.autor === (usuario?.nombre ?? "Invitado"));

  const escribirAlArtesano = () => {
    if (!artesano) return;
    const conId = iniciarConversacion(artesano.id, artesano.nombre, {
      id: producto.id,
      nombre: producto.nombre,
    });
    navigate({ to: "/mensajes", search: { con: conId } });
  };

  const publicarResena = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = comentarioNuevo.trim();
    if (!limpio) return;
    agregarResena({
      productoId: producto.id,
      autor: usuario?.nombre ?? "Invitado",
      estrellas: estrellasNueva,
      comentario: limpio,
    });
    setComentarioNuevo("");
    setEstrellasNueva(5);
    toast.success("¡Gracias por tu reseña!");
  };

  const especificaciones = [
    producto.materiales ? { icono: Package, titulo: "Materiales", valor: producto.materiales } : null,
    producto.dimensiones ? { icono: Ruler, titulo: "Dimensiones", valor: producto.dimensiones } : null,
    producto.tiempoEntrega
      ? { icono: Truck, titulo: "Tiempo estimado de entrega", valor: producto.tiempoEntrega }
      : null,
    {
      icono: ShieldCheck,
      titulo: "Disponibilidad",
      valor: producto.disponible > 0 ? `${producto.disponible} unidades listas para envío` : "Agotado por ahora",
    },
  ].filter((e) => e !== null);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-6">
        <button
          onClick={() => navigate({ to: "/explorar" })}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
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
                <button
                  key={i}
                  onClick={() => setFotoActiva(i)}
                  aria-label={`Ver fotografía ${i + 1}`}
                  className={`overflow-hidden rounded-xl border-2 ${
                    fotoActiva === i ? "border-accent" : "border-transparent opacity-70"
                  }`}
                >
                  <img
                    src={producto.imagen}
                    alt={`${producto.nombre} vista ${i + 1}`}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">{producto.categoria}</p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-display text-3xl font-bold">{producto.nombre}</h1>
              <button
                onClick={() => {
                  toggleFavorito(producto.id);
                  toast.success(esFavorito ? "Quitado de favoritos" : "Guardado en favoritos");
                }}
                aria-label={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}
                aria-pressed={esFavorito}
                className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-input bg-card"
              >
                <Heart className={`h-5 w-5 ${esFavorito ? "fill-accent text-accent" : "text-muted-foreground"}`} />
              </button>
            </div>

            {resenasProducto.length > 0 && (
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Estrellas valor={promedio} />
                <span>
                  {promedio.toFixed(1)} · {resenasProducto.length}{" "}
                  {resenasProducto.length === 1 ? "reseña" : "reseñas"}
                </span>
              </p>
            )}

            <p className="mt-3 text-2xl font-semibold text-primary">{formatoCOP(producto.precio)}</p>
            <p className="mt-5 text-sm leading-relaxed">{producto.descripcion}</p>

            <dl className="mt-5 grid gap-2 sm:grid-cols-2">
              {especificaciones.map((e) => (
                <div key={e.titulo} className="flex gap-2.5 rounded-2xl border border-border bg-card p-3">
                  <e.icono className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs font-semibold">{e.titulo}</dt>
                    <dd className="text-xs leading-snug text-muted-foreground">{e.valor}</dd>
                  </div>
                </div>
              ))}
            </dl>

            {artesano && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={artesano.foto}
                    alt={artesano.nombre}
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="inline-flex items-center gap-1.5 font-display font-semibold">
                      {artesano.nombre}
                      {artesano.verificado && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-turquesa/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <BadgeCheck className="h-3 w-3" /> Verificado
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{artesano.ubicacion}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    to="/artesano/$id"
                    params={{ id: artesano.id }}
                    className="flex-1 rounded-full border border-input py-2.5 text-center text-xs font-semibold"
                  >
                    Ver perfil y productos
                  </Link>
                  <button
                    onClick={escribirAlArtesano}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-secondary py-2.5 text-xs font-semibold text-secondary-foreground"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Escribir al artesano
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  agregarAlCarrito(producto.id);
                  toast.success("Agregado al carrito", { description: producto.nombre });
                }}
                disabled={producto.disponible === 0}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-accent px-6 py-3.5 text-sm font-semibold text-accent disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" /> Agregar al carrito
              </button>
              <button
                onClick={() => {
                  agregarAlCarrito(producto.id);
                  navigate({ to: "/carrito" });
                }}
                disabled={producto.disponible === 0}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
              >
                Comprar ahora
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-sand p-4">
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
        </div>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold">
            Reseñas {resenasProducto.length > 0 && `(${resenasProducto.length})`}
          </h2>

          {!yaReseno && (
            <form onSubmit={publicarResena} className="mt-4 rounded-3xl border border-border bg-card p-5">
              <p className="text-sm font-semibold">Comparte tu experiencia</p>
              <div className="mt-2 flex items-center gap-1" role="radiogroup" aria-label="Calificación en estrellas">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setEstrellasNueva(i)}
                    aria-label={`${i} estrella${i > 1 ? "s" : ""}`}
                    aria-pressed={estrellasNueva === i}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${i <= estrellasNueva ? "fill-sol text-sol" : "text-muted-foreground/40"}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                required
                rows={3}
                value={comentarioNuevo}
                onChange={(e) => setComentarioNuevo(e.target.value)}
                placeholder="¿Qué te pareció la pieza, la atención y la entrega?"
                className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="mt-3 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
                Publicar reseña
              </button>
            </form>
          )}

          {resenasProducto.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Esta pieza aún no tiene reseñas. Sé la primera persona en compartir tu experiencia.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {resenasProducto.map((r) => (
                <li key={r.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{r.autor}</p>
                    <Estrellas valor={r.estrellas} />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.comentario}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground/70">
                    {new Date(r.fecha).toLocaleDateString("es-CO", { dateStyle: "long" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

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
