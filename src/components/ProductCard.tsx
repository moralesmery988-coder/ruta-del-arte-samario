import { Link } from "@tanstack/react-router";
import { artesanos, formatoCOP, type Producto } from "@/lib/data";

export function ProductCard({ producto }: { producto: Producto }) {
  const artesano = artesanos.find((a) => a.id === producto.artesanoId);
  return (
    <Link
      to="/producto/$id"
      params={{ id: producto.id }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1"
    >
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
        <p className="pt-1 text-base font-semibold text-primary">{formatoCOP(producto.precio)}</p>
      </div>
    </Link>
  );
}
