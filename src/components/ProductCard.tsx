import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { formatoCOP } from "@/lib/data";
import { useApp, type Producto } from "@/lib/store";

export function ProductCard({ producto }: { producto: Producto }) {
  const { favoritos, toggleFavorito, resenas, artesanos } = useApp();
  const artesano = artesanos.find((a) => a.id === producto.artesanoId);
  const esFavorito = favoritos.includes(producto.id);
  const alternarFavorito = async () => {
    const r = await toggleFavorito(producto.id);
    if (!r.ok) toast.error(r.error);
  };
  const resenasProducto = resenas.filter((r) => r.productoId === producto.id);
  const promedio =
    resenasProducto.length > 0
      ? resenasProducto.reduce((a, r) => a + r.estrellas, 0) / resenasProducto.length
      : 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1">
      <Link to="/producto/$id" params={{ id: producto.id }} className="block">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-1 p-3.5">
          <p className="text-[11px] uppercase tracking-wider text-accent">{producto.categoria}</p>
          <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug">{producto.nombre}</h3>
          <p className="text-xs text-muted-foreground">por {artesano?.nombre ?? "Artesano local"}</p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-base font-semibold text-primary">{formatoCOP(producto.precio)}</p>
            {promedio > 0 && (
              <p className="text-xs text-muted-foreground" aria-label={`Calificación ${promedio.toFixed(1)} de 5`}>
                ★ {promedio.toFixed(1)}
              </p>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleFavorito(producto.id)}
        aria-label={esFavorito ? `Quitar ${producto.nombre} de favoritos` : `Guardar ${producto.nombre} en favoritos`}
        aria-pressed={esFavorito}
        className="absolute right-2.5 top-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/85 shadow-card backdrop-blur"
      >
        <Heart className={`h-4.5 w-4.5 ${esFavorito ? "fill-accent text-accent" : "text-muted-foreground"}`} />
      </button>
    </div>
  );
}
