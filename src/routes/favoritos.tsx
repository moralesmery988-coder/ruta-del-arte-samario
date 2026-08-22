import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Mis favoritos | Ruta del Arte Samario" },
      { name: "description", content: "Tus artesanías guardadas para consultarlas o comprarlas después." },
      { property: "og:title", content: "Mis favoritos" },
      { property: "og:description", content: "Guarda las artesanías que más te gustan." },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const { favoritos, productos } = useApp();
  const guardados = productos.filter((p) => favoritos.includes(p.id));

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Mis favoritos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Guarda las piezas que te enamoran para comprarlas cuando quieras.
        </p>

        {guardados.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Aún no tienes favoritos. Toca el corazón de cualquier producto para guardarlo aquí.
            </p>
            <Link
              to="/explorar"
              className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Explorar artesanías
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {guardados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
