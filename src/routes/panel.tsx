import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { categorias, formatoCOP, imagenes, ubicaciones, type Categoria } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: "Panel de artesano | Ruta del Arte Samario" },
      { name: "description", content: "Publica productos, edita precios, revisa pedidos y consulta tus ventas." },
      { property: "og:title", content: "Panel de artesano" },
      { property: "og:description", content: "Herramientas para vender tus artesanías en línea." },
    ],
  }),
  component: Panel,
});

const claves = Object.keys(imagenes);

function Panel() {
  const { usuario, productos, agregarProducto, actualizarProducto, eliminarProducto, pedidos } = useApp();
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    categoria: categorias[0]!.nombre as Categoria,
    descripcion: "",
    imagen: claves[0]!,
    disponible: "1",
  });
  const [editando, setEditando] = useState<string | null>(null);

  if (!usuario || usuario.tipo !== "artesano") {
    return (
      <AppShell>
        <div className="mx-auto max-w-md px-5 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Panel exclusivo para artesanos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea una cuenta de tipo artesano para publicar productos y gestionar tus ventas.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
          >
            Registrarme como artesano
          </Link>
        </div>
      </AppShell>
    );
  }

  const mios = productos.filter((p) => p.artesanoId === usuario.correo);
  const ventas = pedidos.reduce((a, p) => a + p.total, 0);
  const campo = "mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring";

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    const datos = {
      nombre: form.nombre,
      precio: Number(form.precio),
      categoria: form.categoria,
      descripcion: form.descripcion,
      imagen: imagenes[form.imagen]!,
      disponible: Number(form.disponible),
      artesanoId: usuario.correo,
    };
    if (editando) {
      actualizarProducto(editando, datos);
      toast.success("Producto actualizado");
      setEditando(null);
    } else {
      agregarProducto(datos);
      toast.success("Producto publicado");
    }
    setForm({ ...form, nombre: "", precio: "", descripcion: "", disponible: "1" });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Panel de artesano</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {usuario.nombre} · {usuario.ubicacion ?? ubicaciones[0]}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { t: "Productos", v: String(mios.length) },
            { t: "Pedidos", v: String(pedidos.length) },
            { t: "Ventas", v: formatoCOP(ventas) },
          ].map((k) => (
            <div key={k.t} className="rounded-2xl border border-border bg-sand p-4">
              <p className="text-xs text-muted-foreground">{k.t}</p>
              <p className="mt-1 font-display text-lg font-bold">{k.v}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <form onSubmit={guardar} className="rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display text-xl font-bold">
              {editando ? "Editar producto" : "Publicar producto"}
            </h2>
            <label className="mt-4 block text-sm font-medium">
              Nombre
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={campo} />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                Precio (COP)
                <input
                  required
                  type="number"
                  min={1000}
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className={campo}
                />
              </label>
              <label className="block text-sm font-medium">
                Disponibles
                <input
                  required
                  type="number"
                  min={0}
                  value={form.disponible}
                  onChange={(e) => setForm({ ...form, disponible: e.target.value })}
                  className={campo}
                />
              </label>
            </div>
            <label className="mt-3 block text-sm font-medium">
              Categoría
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}
                className={campo}
              >
                {categorias.map((c) => (
                  <option key={c.nombre} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-sm font-medium">
              Descripción
              <textarea
                required
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className={campo}
              />
            </label>
            <p className="mt-3 text-sm font-medium">Fotografía</p>
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {claves.map((k) => (
                <button
                  type="button"
                  key={k}
                  onClick={() => setForm({ ...form, imagen: k })}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                    form.imagen === k ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={imagenes[k]} alt={k} loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground">
              <Plus className="h-4 w-4" /> {editando ? "Guardar cambios" : "Publicar producto"}
            </button>
          </form>

          <div>
            <h2 className="font-display text-xl font-bold">Mis productos</h2>
            {mios.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Todavía no has publicado productos.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {mios.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                    <img src={p.imagen} alt={p.nombre} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatoCOP(p.precio)} · {p.disponible} disp.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditando(p.id);
                        setForm({
                          nombre: p.nombre,
                          precio: String(p.precio),
                          categoria: p.categoria,
                          descripcion: p.descripcion,
                          imagen: claves.find((k) => imagenes[k] === p.imagen) ?? claves[0]!,
                          disponible: String(p.disponible),
                        });
                      }}
                      aria-label="Editar"
                      className="text-muted-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        eliminarProducto(p.id);
                        toast.success("Producto eliminado");
                      }}
                      aria-label="Eliminar"
                      className="text-muted-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="mt-8 font-display text-xl font-bold">Pedidos recibidos</h2>
            {pedidos.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Sin pedidos por ahora.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pedidos.map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 text-sm">
                    <span className="font-medium">{p.id}</span>
                    <span className="text-muted-foreground">{p.estado}</span>
                    <span>{formatoCOP(p.total)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
