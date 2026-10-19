import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, ImagePlus, Minus, Pencil, Plus, Trash2, Video, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { QrTarjeta } from "@/components/QrTarjeta";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { categorias, formatoCOP, ubicaciones, type Categoria } from "@/lib/data";
import { etiquetaEstado, resolverImagen, siguienteEstado, useApp, type Producto } from "@/lib/store";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: "Panel de artesano | Ruta del Arte Samario" },
      { name: "description", content: "Administra tu tienda: productos con fotos y videos, precios, inventario, pedidos y Mi taller." },
      { property: "og:title", content: "Panel de artesano" },
      { property: "og:description", content: "Herramientas para vender tus artesanías en línea." },
    ],
  }),
  component: Panel,
});

const campo = "mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const vacio = {
  nombre: "", precio: "", categoria: categorias[0]!.nombre as Categoria, descripcion: "", materiales: "",
  dimensiones: "", tiempoEntrega: "", disponible: "1", agotado: false,
};

function Panel() {
  const app = useApp();
  const { usuario, miTienda, productos, pedidos, cargando } = app;
  const [pestana, setPestana] = useState<"productos" | "pedidos" | "tienda" | "taller">("productos");

  if (cargando) return <AppShell><p className="py-16 text-center text-sm text-muted-foreground">Cargando…</p></AppShell>;
  if (!usuario || !miTienda) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md px-5 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Panel exclusivo para artesanos</h1>
          <p className="mt-2 text-sm text-muted-foreground">Crea una cuenta de tipo artesano para publicar productos y gestionar tus ventas.</p>
          <Link to="/auth" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground">Registrarme como artesano</Link>
        </div>
      </AppShell>
    );
  }

  const mios = productos.filter((p) => p.artesanoId === miTienda.id);
  const recibidos = pedidos.filter((p) => p.artesanoId === miTienda.id);
  const ventas = recibidos.filter((p) => p.estado === "entregado").reduce((a, p) => a + p.total, 0);
  const pendientes = recibidos.filter((p) => p.estado === "pendiente").length;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Panel de artesano</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {miTienda.taller || miTienda.nombre} · {miTienda.ubicacion} ·{" "}
          <Link to="/artesano/$id" params={{ id: miTienda.id }} className="text-primary underline">Ver mi tienda pública</Link>
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[{ t: "Productos", v: String(mios.length) }, { t: "Pedidos por confirmar", v: String(pendientes) }, { t: "Ventas entregadas", v: formatoCOP(ventas) }].map((k) => (
            <div key={k.t} className="rounded-2xl border border-border bg-sand p-4">
              <p className="text-xs text-muted-foreground">{k.t}</p>
              <p className="mt-1 font-display text-lg font-bold">{k.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto rounded-full bg-secondary p-1 text-sm" role="tablist">
          {([["productos", "Productos"], ["pedidos", `Pedidos (${recibidos.length})`], ["tienda", "Mi tienda y QR"], ["taller", "Mi taller"]] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={pestana === k} onClick={() => setPestana(k)}
              className={`shrink-0 rounded-full px-4 py-2 font-medium ${pestana === k ? "bg-card shadow-card" : ""}`}>{l}</button>
          ))}
        </div>

        {pestana === "productos" && <Productos mios={mios} />}
        {pestana === "pedidos" && <PedidosRecibidos />}
        {pestana === "tienda" && <Tienda />}
        {pestana === "taller" && <Taller />}
      </div>
    </AppShell>
  );
}

function SubirMedios({ fotos, setFotos, videos, setVideos }: { fotos: string[]; setFotos: (f: string[]) => void; videos: string[]; setVideos: (v: string[]) => void }) {
  const { subirArchivo } = useApp();
  const [subiendo, setSubiendo] = useState(false);
  const subir = async (e: React.ChangeEvent<HTMLInputElement>, tipo: "foto" | "video") => {
    const archivos = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!archivos.length) return;
    setSubiendo(true);
    const nuevas: string[] = [];
    for (const a of archivos) {
      try { nuevas.push(await subirArchivo(a)); }
      catch (err) { toast.error(`No se pudo subir ${a.name}`, { description: err instanceof Error ? err.message : "" }); }
    }
    setSubiendo(false);
    if (tipo === "foto") setFotos([...fotos, ...nuevas]); else setVideos([...videos, ...nuevas]);
  };
  return (
    <div>
      <p className="mt-3 text-sm font-medium">Fotos y videos</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {fotos.map((f, i) => (
          <span key={f} className="relative">
            <img src={resolverImagen(f)} alt={`Foto ${i + 1}`} className={`h-16 w-16 rounded-xl object-cover ${i === 0 ? "border-2 border-accent" : ""}`} />
            <button type="button" onClick={() => setFotos(fotos.filter((x) => x !== f))} aria-label={`Quitar foto ${i + 1}`}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground"><X className="h-3 w-3" /></button>
          </span>
        ))}
        {videos.map((v, i) => (
          <span key={v} className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-xs">
            <Video className="h-5 w-5" />
            <button type="button" onClick={() => setVideos(videos.filter((x) => x !== v))} aria-label={`Quitar video ${i + 1}`}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground">
          <ImagePlus className="h-4 w-4" /> {subiendo ? "Subiendo…" : "Agregar fotos"}
          <input type="file" accept="image/*" multiple disabled={subiendo} onChange={(e) => subir(e, "foto")} className="sr-only" aria-label="Subir fotos del producto" />
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-input px-4 py-2.5 text-sm font-semibold">
          <Video className="h-4 w-4" /> Agregar video
          <input type="file" accept="video/*" disabled={subiendo} onChange={(e) => subir(e, "video")} className="sr-only" aria-label="Subir video del producto" />
        </label>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">La primera foto es la portada. Videos de hasta 50 MB.</p>
    </div>
  );
}

function Productos({ mios }: { mios: Producto[] }) {
  const { guardarProducto, actualizarProducto, eliminarProducto } = useApp();
  const [form, setForm] = useState(vacio);
  const [fotos, setFotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [borrar, setBorrar] = useState<Producto | null>(null);
  const [guardando, setGuardando] = useState(false);

  const limpiar = () => { setForm(vacio); setFotos([]); setVideos([]); setEditando(null); };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fotos.length === 0) return void toast.error("Agrega al menos una foto");
    setGuardando(true);
    const r = await guardarProducto(editando, {
      nombre: form.nombre.trim(), precio: Number(form.precio), categoria: form.categoria, descripcion: form.descripcion.trim(),
      materiales: form.materiales.trim(), dimensiones: form.dimensiones.trim(), tiempoEntrega: form.tiempoEntrega.trim(),
      imagenes: fotos, videos, disponible: Number(form.disponible), agotado: form.agotado,
    });
    setGuardando(false);
    if (!r.ok) return void toast.error("No se pudo guardar", { description: r.error });
    toast.success(editando ? "Producto actualizado" : "Producto publicado");
    limpiar();
  };

  const accion = async (p: Promise<{ ok: boolean; error?: string }>) => {
    const r = await p;
    if (!r.ok) toast.error(r.error ?? "Error");
  };

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={guardar} className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{editando ? "Editar producto" : "Publicar producto"}</h2>
          {editando && <button type="button" onClick={limpiar} className="text-xs text-muted-foreground">Cancelar</button>}
        </div>
        <label className="mt-4 block text-sm font-medium">Nombre
          <input required maxLength={120} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={campo} />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">Precio (COP)
            <input required type="number" min={1000} value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className={campo} />
          </label>
          <label className="block text-sm font-medium">Inventario
            <input required type="number" min={0} value={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.value })} className={campo} />
          </label>
        </div>
        <label className="mt-3 block text-sm font-medium">Categoría
          <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })} className={campo}>
            {categorias.map((c) => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
          </select>
        </label>
        <label className="mt-3 block text-sm font-medium">Descripción
          <textarea required rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className={campo} />
        </label>
        <label className="mt-3 block text-sm font-medium">Materiales
          <input value={form.materiales} onChange={(e) => setForm({ ...form, materiales: e.target.value })} className={campo} placeholder="Ej. hilo de algodón, fique" />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">Dimensiones
            <input value={form.dimensiones} onChange={(e) => setForm({ ...form, dimensiones: e.target.value })} className={campo} placeholder="30 × 25 cm" />
          </label>
          <label className="block text-sm font-medium">Tiempo de entrega
            <input value={form.tiempoEntrega} onChange={(e) => setForm({ ...form, tiempoEntrega: e.target.value })} className={campo} placeholder="3 a 5 días" />
          </label>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.agotado} onChange={(e) => setForm({ ...form, agotado: e.target.checked })} /> Marcar como agotado
        </label>
        <SubirMedios fotos={fotos} setFotos={setFotos} videos={videos} setVideos={setVideos} />
        <button disabled={guardando} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60">
          <Plus className="h-4 w-4" /> {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Publicar producto"}
        </button>
      </form>

      <div>
        <h2 className="font-display text-xl font-bold">Mis productos</h2>
        {mios.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Todavía no has publicado productos.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {mios.map((p) => (
              <li key={p.id} className="rounded-2xl border border-border bg-card p-3">
                <div className="flex items-center gap-3">
                  <img src={p.imagen} alt={p.nombre} loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to="/producto/$id" params={{ id: p.id }} className="block truncate text-sm font-medium">{p.nombre}</Link>
                    <p className="text-xs text-muted-foreground">{formatoCOP(p.precio)} · {p.agotado ? "Agotado" : `${p.disponible} disp.`}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <button onClick={() => accion(actualizarProducto(p.id, { disponible: Math.max(0, p.disponible - 1) }))} aria-label={`Reducir inventario de ${p.nombre}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-input"><Minus className="h-3 w-3" /></button>
                      <button onClick={() => accion(actualizarProducto(p.id, { disponible: p.disponible + 1, agotado: false }))} aria-label={`Aumentar inventario de ${p.nombre}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-input"><Plus className="h-3 w-3" /></button>
                      <button onClick={() => accion(actualizarProducto(p.id, { agotado: !p.agotado }))}
                        disabled={p.agotado && p.disponible === 0}
                        className="rounded-full border border-input px-2.5 py-1 text-[11px] disabled:opacity-50">
                        {p.agotado ? "Marcar disponible" : "Marcar agotado"}
                      </button>
                    </div>
                  </div>
                  <button aria-label={`Editar ${p.nombre}`} className="p-1 text-muted-foreground" onClick={() => {
                    setEditando(p.id);
                    setForm({ nombre: p.nombre, precio: String(p.precio), categoria: p.categoria, descripcion: p.descripcion, materiales: p.materiales,
                      dimensiones: p.dimensiones, tiempoEntrega: p.tiempoEntrega, disponible: String(p.disponible), agotado: p.agotado });
                    setFotos(p.imagenesRaw); setVideos(p.videos);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}><Pencil className="h-4 w-4" /></button>
                  <button aria-label={`Eliminar ${p.nombre}`} onClick={() => setBorrar(p)} className="p-1 text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-2">
                  <QrTarjeta ruta={`/producto/${p.id}`} titulo={p.nombre} subtitulo={formatoCOP(p.precio)} nombreArchivo={`etiqueta-${p.id}`} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog open={!!borrar} onOpenChange={(o) => !o && setBorrar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar “{borrar?.nombre}”?</AlertDialogTitle>
            <AlertDialogDescription>La publicación dejará de verse en el catálogo. Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (!borrar) return;
              const r = await eliminarProducto(borrar.id);
              if (r.ok) toast.success("Producto eliminado"); else toast.error(r.error);
              setBorrar(null);
            }}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function PedidosRecibidos() {
  const { pedidos, miTienda, cambiarEstadoPedido } = useApp();
  const recibidos = pedidos.filter((p) => p.artesanoId === miTienda?.id);
  if (recibidos.length === 0) return <p className="mt-6 text-sm text-muted-foreground">Sin pedidos por ahora.</p>;
  return (
    <ul className="mt-6 space-y-3">
      {recibidos.map((p) => {
        const sig = siguienteEstado(p.estado);
        return (
          <li key={p.id} className="rounded-2xl border border-border bg-card p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display font-bold">{p.codigo} · {p.comprador || "Comprador"}</p>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs">{etiquetaEstado[p.estado]}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{new Date(p.fecha).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })} · Entrega: {p.direccion || "—"}</p>
            <ul className="mt-2 text-xs">{p.items.map((i, k) => <li key={k}>{i.cantidad} × {i.nombre} — {formatoCOP(i.precio * i.cantidad)}</li>)}</ul>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-semibold">Total {formatoCOP(p.total)}</span>
              {sig && p.estado !== "cancelado" && (
                <button onClick={async () => { const r = await cambiarEstadoPedido(p.id, sig); if (r.ok) toast.success(`Pedido: ${etiquetaEstado[sig]}`); else toast.error(r.error); }}
                  className="ml-auto rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">Marcar como “{etiquetaEstado[sig]}”</button>
              )}
              {p.estado === "pendiente" && (
                <button onClick={async () => { const r = await cambiarEstadoPedido(p.id, "cancelado"); if (r.ok) toast.success("Pedido cancelado"); else toast.error(r.error); }}
                  className="rounded-full border border-input px-4 py-2 text-xs">Rechazar</button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Tienda() {
  const { miTienda, actualizarTienda, subirArchivo } = useApp();
  const t = miTienda!;
  const [f, setF] = useState({ nombre: t.nombre, taller: t.taller, ubicacion: t.ubicacion, descripcion: t.descripcion, historia: t.historia,
    proceso: t.proceso, tecnica: t.tecnica, tradicion: t.tradicion, contactoPublico: t.contactoPublico });
  const [foto, setFoto] = useState(t.fotoRaw);
  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await actualizarTienda({ ...f, foto });
    if (r.ok) toast.success("Tienda actualizada"); else toast.error(r.error);
  };
  const cambiarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = e.target.files?.[0]; e.target.value = "";
    if (!a) return;
    try { setFoto(await subirArchivo(a)); } catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
  };
  const texto = (k: keyof typeof f, l: string, area = false, ph = "") => (
    <label className="mt-3 block text-sm font-medium">{l}
      {area ? <textarea rows={4} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={campo} placeholder={ph} />
        : <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={campo} placeholder={ph} />}
    </label>
  );
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <form onSubmit={guardar} className="rounded-3xl border border-border bg-card p-5">
        <h2 className="font-display text-xl font-bold">Perfil comercial</h2>
        <div className="mt-3 flex items-center gap-3">
          <img src={resolverImagen(foto)} alt="Foto de la tienda" className="h-16 w-16 rounded-full object-cover" />
          <label className="cursor-pointer rounded-full bg-secondary px-4 py-2 text-sm font-semibold">Cambiar foto
            <input type="file" accept="image/*" onChange={cambiarFoto} className="sr-only" aria-label="Cambiar foto de la tienda" />
          </label>
        </div>
        {texto("nombre", "Nombre")}
        {texto("taller", "Nombre del taller")}
        <label className="mt-3 block text-sm font-medium">Ubicación
          <select value={f.ubicacion} onChange={(e) => setF({ ...f, ubicacion: e.target.value })} className={campo}>
            {[...new Set([f.ubicacion, ...ubicaciones])].map((u) => <option key={u}>{u}</option>)}
          </select>
        </label>
        {texto("descripcion", "Descripción corta de tu trabajo")}
        {texto("historia", "Tu historia", true, "¿Cómo aprendiste el oficio? ¿Qué significa para ti?")}
        {texto("proceso", "Proceso de elaboración", true)}
        {texto("tecnica", "Técnica tradicional", false, "Ej. crochet de una hebra")}
        {texto("tradicion", "Tradición cultural", false, "Ej. Wayuu, Arhuaca, Caribe samario")}
        {texto("contactoPublico", "Contacto que autorizas mostrar (opcional)", false, "Ej. WhatsApp 300 000 0000")}
        <p className="mt-1 text-[11px] text-muted-foreground">Déjalo vacío si prefieres que te escriban solo por el chat.</p>
        <button className="mt-5 w-full rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground">Guardar tienda</button>
      </form>
      <div>
        <h2 className="font-display text-xl font-bold">Tu código QR</h2>
        <p className="mt-1 text-sm text-muted-foreground">Imprímelo en tarjetas o en tu puesto: lleva a tu tienda pública sin necesidad de iniciar sesión.</p>
        <div className="mt-3"><QrTarjeta ruta={`/artesano/${t.id}`} titulo={t.nombre} subtitulo={t.taller || t.ubicacion} nombreArchivo={`tarjeta-${t.id}`} /></div>
      </div>
    </div>
  );
}

function Taller() {
  const { publicaciones, miTienda, crearPublicacion, ocultarPublicacion, eliminarPublicacion, subirArchivo } = useApp();
  const mias = publicaciones.filter((p) => p.artesanoId === miTienda?.id);
  const [texto, setTexto] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const publicar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = e.target.files?.[0]; e.target.value = "";
    if (!a) return;
    setSubiendo(true);
    try {
      const url = await subirArchivo(a);
      const r = await crearPublicacion({ tipo: a.type.startsWith("video/") ? "video" : "foto", mediaUrl: url, texto: texto.trim() });
      if (r.ok) { toast.success("Publicado en Mi taller"); setTexto(""); } else toast.error(r.error);
    } catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
    setSubiendo(false);
  };
  return (
    <div className="mt-6">
      <div className="rounded-3xl border border-border bg-card p-5">
        <h2 className="font-display text-xl font-bold">Compartir en Mi taller</h2>
        <p className="mt-1 text-sm text-muted-foreground">Muestra tus procesos, nuevas creaciones y el día a día del taller.</p>
        <textarea rows={2} maxLength={1000} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Cuéntale a la gente qué estás creando…" className={campo} />
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
          <ImagePlus className="h-4 w-4" /> {subiendo ? "Publicando…" : "Elegir foto o video y publicar"}
          <input type="file" accept="image/*,video/*" disabled={subiendo} onChange={publicar} className="sr-only" aria-label="Elegir foto o video para Mi taller" />
        </label>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {mias.map((p) => (
          <figure key={p.id} className={`overflow-hidden rounded-2xl border border-border bg-card ${p.oculta ? "opacity-60" : ""}`}>
            {p.tipo === "video" ? <video src={p.mediaUrl} controls playsInline className="aspect-square w-full object-cover" />
              : <img src={p.mediaUrl} alt={p.texto || "Publicación"} className="aspect-square w-full object-cover" />}
            <figcaption className="space-y-2 p-2.5 text-xs">
              {p.texto && <p className="text-muted-foreground">{p.texto}</p>}
              <div className="flex gap-2">
                <button onClick={async () => { const r = await ocultarPublicacion(p.id, !p.oculta); if (!r.ok) toast.error(r.error); }}
                  className="inline-flex items-center gap-1 rounded-full border border-input px-2.5 py-1">
                  {p.oculta ? <><Eye className="h-3 w-3" /> Mostrar</> : <><EyeOff className="h-3 w-3" /> Ocultar</>}
                </button>
                <button onClick={async () => { if (!confirm("¿Eliminar esta publicación?")) return; const r = await eliminarPublicacion(p.id); if (!r.ok) toast.error(r.error); }}
                  className="inline-flex items-center gap-1 rounded-full border border-input px-2.5 py-1"><Trash2 className="h-3 w-3" /> Eliminar</button>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      {mias.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Aún no has compartido publicaciones.</p>}
    </div>
  );
}
