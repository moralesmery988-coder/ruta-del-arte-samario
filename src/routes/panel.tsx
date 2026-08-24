import { createFileRoute, Link } from "@tanstack/react-router";
import { ImagePlus, Minus, Pencil, Plus, Send, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { categorias, formatoCOP, imagenes, ubicaciones, type Categoria } from "@/lib/data";
import { useApp, type Conversacion } from "@/lib/store";
...
const claves = Object.keys(imagenes);

/** Lee un archivo de imagen y la devuelve como data URL reducida (máx. 800px, JPEG). */
function leerImagen(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error("No se pudo leer la imagen"));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Archivo de imagen no válido"));
      img.onload = () => {
        const escala = Math.min(1, 800 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = String(lector.result);
    };
    lector.readAsDataURL(archivo);
  });
}

function Panel() {
  const { usuario, productos, agregarProducto, actualizarProducto, eliminarProducto, pedidos, conversaciones, enviarMensaje } = useApp();
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    categoria: categorias[0]!.nombre as Categoria,
    descripcion: "",
    imagen: claves[0]!,
    disponible: "1",
  });
  const [fotoSubida, setFotoSubida] = useState<string | null>(null);
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
                    <img src={p.imagen} alt={p.nombre} loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground">{formatoCOP(p.precio)}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <button
                          onClick={() => actualizarProducto(p.id, { disponible: Math.max(0, p.disponible - 1) })}
                          aria-label={`Reducir disponibilidad de ${p.nombre}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-input"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-12 text-center text-xs">
                          {p.disponible > 0 ? `${p.disponible} disp.` : "Agotado"}
                        </span>
                        <button
                          onClick={() => actualizarProducto(p.id, { disponible: p.disponible + 1 })}
                          aria-label={`Aumentar disponibilidad de ${p.nombre}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-input"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
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
                  <li key={p.id} className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card p-3 text-sm">
                    <span className="font-medium">{p.id}</span>
                    <span className="text-muted-foreground">{p.estado}</span>
                    <span>{formatoCOP(p.total)}</span>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="mt-8 font-display text-xl font-bold">Mensajes de compradores</h2>
            {conversaciones.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Sin mensajes por ahora. Cuando un comprador te escriba desde un producto, aparecerá aquí.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {conversaciones.map((c) => (
                  <ConversacionPanel key={c.id} conversacion={c} onResponder={(texto) => enviarMensaje(c.id, "artesano", texto)} />
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ConversacionPanel({
  conversacion,
  onResponder,
}: {
  conversacion: Conversacion;
  onResponder: (texto: string) => void;
}) {
  const [respuesta, setRespuesta] = useState("");
  const ultimos = conversacion.mensajes.slice(-3);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = respuesta.trim();
    if (!limpio) return;
    onResponder(limpio);
    setRespuesta("");
    toast.success("Respuesta enviada");
  };

  return (
    <li className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <p className="text-sm font-semibold">{conversacion.comprador}</p>
        {conversacion.productoNombre && (
          <p className="text-[11px] uppercase tracking-wide text-accent">{conversacion.productoNombre}</p>
        )}
      </div>
      {ultimos.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {ultimos.map((m, i) => (
            <li
              key={i}
              className={`rounded-xl px-3 py-2 text-xs leading-snug ${
                m.de === "artesano" ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground"
              }`}
            >
              <span className="font-semibold">{m.de === "artesano" ? "Tú" : conversacion.comprador}:</span> {m.texto}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={enviar} className="mt-3 flex gap-2">
        <input
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          placeholder="Responder al comprador…"
          aria-label={`Responder a ${conversacion.comprador}`}
          className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          aria-label="Enviar respuesta"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </li>
  );
}
