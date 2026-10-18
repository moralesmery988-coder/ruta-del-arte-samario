import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { categorias, ubicaciones } from "@/lib/data";
import { useApp } from "@/lib/store";

type Busqueda = { categoria?: string | undefined; q?: string | undefined };

export const Route = createFileRoute("/explorar")({
  validateSearch: (search: Record<string, unknown>): Busqueda => ({
    categoria: typeof search['categoria'] === "string" ? (search['categoria'] as string) : undefined,
    q: typeof search['q'] === "string" ? (search['q'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explorar artesanías | Ruta del Arte Samario" },
      { name: "description", content: "Filtra artesanías por categoría, precio, ubicación y artesano." },
      { property: "og:title", content: "Explorar artesanías" },
      { property: "og:description", content: "Mochilas, cerámica, madera y más, hechas en el Magdalena." },
    ],
  }),
  component: Explorar,
});

function Explorar() {
  const { productos, artesanos } = useApp();
  const { categoria, q } = Route.useSearch();
  const navigate = useNavigate();
  const [precioMax, setPrecioMax] = useState(350000);
  const [ubicacion, setUbicacion] = useState("todas");
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [filtros, setFiltros] = useState(false);

  const texto = (q ?? "").toLowerCase();
  const resultados = productos.filter((p) => {
    const a = artesanos.find((x) => x.id === p.artesanoId);
    const coincideTexto =
      !texto || p.nombre.toLowerCase().includes(texto) || (a?.nombre.toLowerCase().includes(texto) ?? false);
    const coincideCategoria = !categoria || p.categoria === categoria;
    const coincideUbicacion = ubicacion === "todas" || a?.ubicacion === ubicacion;
    const coincideDisponibilidad = !soloDisponibles || p.disponible > 0;
    return coincideTexto && coincideCategoria && p.precio <= precioMax && coincideUbicacion && coincideDisponibilidad;
  });

  const artesanosCoincidentes = texto
    ? artesanos.filter((a) => a.nombre.toLowerCase().includes(texto) || a.taller.toLowerCase().includes(texto))
    : [];

  const setSearch = (next: Busqueda) =>
    navigate({ to: "/explorar", search: (prev) => ({ ...prev, ...next }) });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Explorar artesanías</h1>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q ?? ""}
              onChange={(e) => setSearch({ q: e.target.value })}
              placeholder="Buscar productos o artesanos"
              className="w-full rounded-full border border-input bg-card py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={() => setFiltros((f) => !f)}
            className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-4 text-sm font-medium"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSearch({ categoria: undefined })}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
              !categoria ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            Todas
          </button>
          {categorias.map((c) => (
            <button
              key={c.nombre}
              onClick={() => setSearch({ categoria: c.nombre })}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                categoria === c.nombre
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {c.icono} {c.nombre}
            </button>
          ))}
        </div>

        {filtros && (
          <div className="mt-4 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-sm font-medium sm:col-span-2">
              <input
                type="checkbox"
                checked={soloDisponibles}
                onChange={(e) => setSoloDisponibles(e.target.checked)}
                className="h-5 w-5 accent-[oklch(0.62_0.15_45)]"
              />
              Mostrar solo productos disponibles
            </label>
            <label className="text-sm">
              Precio máximo: <span className="font-semibold">${precioMax.toLocaleString("es-CO")}</span>
              <input
                type="range"
                min={40000}
                max={350000}
                step={5000}
                value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
                className="mt-2 w-full accent-[oklch(0.62_0.15_45)]"
              />
            </label>
            <label className="text-sm">
              Ubicación
              <select
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="mt-2 w-full rounded-xl border border-input bg-background p-2.5 text-sm"
              >
                <option value="todas">Todas las ubicaciones</option>
                {ubicaciones.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {artesanosCoincidentes.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold">Artesanos</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {artesanosCoincidentes.map((a) => (
                <Link
                  key={a.id}
                  to="/artesano/$id"
                  params={{ id: a.id }}
                  className="flex min-w-56 items-center gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  <img src={a.foto} alt={a.nombre} loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                  <span className="text-sm font-medium">{a.nombre}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-muted-foreground">{resultados.length} productos encontrados</p>
        <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {resultados.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
        {resultados.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No encontramos artesanías con esos filtros. Prueba ampliando el precio o la categoría.
          </p>
        )}
      </div>
    </AppShell>
  );
}
