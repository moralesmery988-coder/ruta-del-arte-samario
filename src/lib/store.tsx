import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { imagenes, type Categoria } from "./data";

/** Las imágenes de ejemplo se guardan como clave ("mochila"); las subidas, como URL. */
export const resolverImagen = (s: string | null | undefined) => (s ? (imagenes[s] ?? s) : imagenes["mochila"]!);

export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
  tipo: "comprador" | "artesano";
  ubicacion?: string | undefined;
  artesanoId?: string | undefined;
};

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  categoria: Categoria;
  artesanoId: string;
  descripcion: string;
  imagen: string;
  imagenes: string[];
  imagenesRaw: string[];
  videos: string[];
  disponible: number;
  agotado: boolean;
  destacado: boolean;
  materiales: string;
  dimensiones: string;
  tiempoEntrega: string;
};

export type Artesano = {
  id: string;
  userId: string | null;
  nombre: string;
  taller: string;
  ubicacion: string;
  descripcion: string;
  historia: string;
  proceso: string;
  tecnica: string;
  tradicion: string;
  foto: string;
  fotoRaw: string;
  contactoPublico: string;
  verificado: boolean;
  coords: { x: number; y: number };
};

export type Resena = {
  id: string;
  productoId: string;
  autor: string;
  autorId: string | null;
  estrellas: number;
  comentario: string;
  fecha: string;
  verificada: boolean;
};

export type EstadoPedido = "pendiente" | "confirmado" | "preparacion" | "enviado" | "entregado" | "cancelado";
export const estadosPedido: EstadoPedido[] = ["pendiente", "confirmado", "preparacion", "enviado", "entregado"];
export const etiquetaEstado: Record<EstadoPedido, string> = {
  pendiente: "Pendiente de confirmación",
  confirmado: "Confirmado",
  preparacion: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};
export const siguienteEstado = (e: EstadoPedido): EstadoPedido | null => {
  const i = estadosPedido.indexOf(e);
  return i >= 0 && i < estadosPedido.length - 1 ? estadosPedido[i + 1]! : null;
};

export type Pedido = {
  id: string;
  codigo: string;
  fecha: string;
  items: { productoId: string; nombre: string; precio: number; cantidad: number; imagen: string }[];
  total: number;
  estado: EstadoPedido;
  comprador: string;
  compradorId: string;
  artesanoId: string;
  direccion: string;
  historial: { estado: EstadoPedido; fecha: string }[];
};

export type ItemCarrito = { productoId: string; cantidad: number };
export type RolMensaje = "comprador" | "artesano";
export type Mensaje = { id: string; de: RolMensaje; texto: string; fecha: string };
export type Conversacion = {
  id: string;
  artesanoId: string;
  artesanoNombre: string;
  productoId?: string | undefined;
  productoNombre?: string | undefined;
  compradorId: string;
  comprador: string;
  mensajes: Mensaje[];
  actualizada: string;
};
export type Notificacion = { id: string; titulo: string; detalle: string; enlace: string | null; fecha: string; leida: boolean };
export type Publicacion = {
  id: string;
  artesanoId: string;
  tipo: "foto" | "video";
  mediaUrl: string;
  texto: string;
  oculta: boolean;
  fecha: string;
};

type Resultado = { ok: true } | { ok: false; error: string };
const fallo = (e: unknown): Resultado => ({ ok: false, error: e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e) });

type Ctx = {
  cargando: boolean;
  usuario: Usuario | null;
  registrar: (u: { nombre: string; correo: string; password: string; tipo: "comprador" | "artesano"; ubicacion?: string }) => Promise<Resultado & { confirmar?: boolean }>;
  entrar: (correo: string, password: string) => Promise<Resultado>;
  recuperar: (correo: string) => Promise<Resultado>;
  salir: () => Promise<void>;
  artesanos: Artesano[];
  miTienda: Artesano | null;
  actualizarTienda: (d: Partial<Pick<Artesano, "nombre" | "taller" | "ubicacion" | "descripcion" | "historia" | "proceso" | "tecnica" | "tradicion" | "contactoPublico">> & { foto?: string }) => Promise<Resultado>;
  productos: Producto[];
  guardarProducto: (id: string | null, d: {
    nombre: string; precio: number; categoria: Categoria; descripcion: string; materiales: string; dimensiones: string;
    tiempoEntrega: string; imagenes: string[]; videos: string[]; disponible: number; agotado: boolean;
  }) => Promise<Resultado>;
  actualizarProducto: (id: string, d: { disponible?: number; agotado?: boolean; precio?: number }) => Promise<Resultado>;
  eliminarProducto: (id: string) => Promise<Resultado>;
  subirArchivo: (archivo: File) => Promise<string>;
  carrito: ItemCarrito[];
  agregarAlCarrito: (productoId: string, cantidad?: number) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  quitarDelCarrito: (productoId: string) => void;
  vaciarCarrito: () => void;
  pedidos: Pedido[];
  confirmarPedido: (direccion: string) => Promise<Resultado & { codigos?: string[] }>;
  cambiarEstadoPedido: (id: string, estado: EstadoPedido) => Promise<Resultado>;
  favoritos: string[];
  toggleFavorito: (productoId: string) => Promise<Resultado>;
  resenas: Resena[];
  agregarResena: (r: { productoId: string; estrellas: number; comentario: string }) => Promise<Resultado>;
  conversaciones: Conversacion[];
  iniciarConversacion: (artesanoId: string, producto?: { id: string; nombre: string }) => Promise<string | null>;
  enviarMensaje: (conversacionId: string, texto: string) => Promise<Resultado>;
  notificaciones: Notificacion[];
  marcarNotificacionesLeidas: () => Promise<void>;
  publicaciones: Publicacion[];
  crearPublicacion: (d: { tipo: "foto" | "video"; mediaUrl: string; texto: string }) => Promise<Resultado>;
  ocultarPublicacion: (id: string, oculta: boolean) => Promise<Resultado>;
  eliminarPublicacion: (id: string) => Promise<Resultado>;
  reportarPublicacion: (id: string, motivo: string) => Promise<Resultado>;
};

const AppCtx = createContext<Ctx | null>(null);
const KEY_CARRITO = "ruta-arte-samario-carrito";

/** Reduce una imagen a máx. 1400px en JPEG antes de subirla. */
async function comprimirImagen(archivo: File): Promise<Blob> {
  const url = URL.createObjectURL(archivo);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("Archivo de imagen no válido"));
      i.src = url;
    });
    const escala = Math.min(1, 1400 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("No se pudo procesar"))), "image/jpeg", 0.82));
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const mapArtesano = (a: any): Artesano => ({
  id: a.id, userId: a.user_id, nombre: a.nombre, taller: a.taller, ubicacion: a.ubicacion, descripcion: a.descripcion,
  historia: a.historia, proceso: a.proceso, tecnica: a.tecnica, tradicion: a.tradicion, foto: resolverImagen(a.foto),
  fotoRaw: a.foto, contactoPublico: a.contacto_publico, verificado: a.verificado, coords: { x: a.coord_x, y: a.coord_y },
});
const mapProducto = (p: any): Producto => {
  const imgs = (p.imagenes as string[]).map(resolverImagen);
  return {
    id: p.id, nombre: p.nombre, precio: p.precio, categoria: p.categoria, artesanoId: p.artesano_id, descripcion: p.descripcion,
    imagen: imgs[0] ?? resolverImagen(null), imagenes: imgs.length ? imgs : [resolverImagen(null)], imagenesRaw: p.imagenes,
    videos: p.videos, disponible: p.disponible, agotado: p.agotado || p.disponible === 0, destacado: p.destacado,
    materiales: p.materiales, dimensiones: p.dimensiones, tiempoEntrega: p.tiempo_entrega,
  };
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [artesanos, setArtesanos] = useState<Artesano[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const usuarioRef = useRef<Usuario | null>(null);
  usuarioRef.current = usuario;

  // Carrito local (no requiere cuenta)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_CARRITO);
      if (raw) setCarrito(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito)); } catch { /* noop */ }
  }, [carrito]);

  const cargarPublico = useCallback(async () => {
    const [a, p, r, pub] = await Promise.all([
      supabase.from("artesanos").select("*").order("created_at"),
      supabase.from("productos").select("*").order("created_at", { ascending: false }),
      supabase.from("resenas").select("*").order("created_at", { ascending: false }),
      supabase.from("publicaciones").select("*").order("created_at", { ascending: false }),
    ]);
    setArtesanos((a.data ?? []).map(mapArtesano));
    setProductos((p.data ?? []).map(mapProducto));
    setResenas((r.data ?? []).map((x) => ({
      id: x.id, productoId: x.producto_id, autor: x.autor_nombre, autorId: x.autor_id, estrellas: x.estrellas,
      comentario: x.comentario, fecha: x.created_at, verificada: x.verificada,
    })));
    setPublicaciones((pub.data ?? []).map((x) => ({
      id: x.id, artesanoId: x.artesano_id, tipo: x.tipo as "foto" | "video", mediaUrl: x.media_url, texto: x.texto, oculta: x.oculta, fecha: x.created_at,
    })));
  }, []);

  const cargarPrivado = useCallback(async (u: Usuario) => {
    const [ped, fav, conv, noti] = await Promise.all([
      supabase.from("pedidos").select("*, pedido_items(*), pedido_historial(*)").order("created_at", { ascending: false }),
      supabase.from("favoritos").select("producto_id"),
      supabase.from("conversaciones").select("*, mensajes(*), artesanos(nombre)").order("updated_at", { ascending: false }),
      supabase.from("notificaciones").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    setPedidos((ped.data ?? []).map((p: any) => ({
      id: p.id, codigo: p.codigo, fecha: p.created_at, total: p.total, estado: p.estado, comprador: p.comprador_nombre,
      compradorId: p.comprador_id, artesanoId: p.artesano_id, direccion: p.direccion,
      items: (p.pedido_items ?? []).map((i: any) => ({ productoId: i.producto_id, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad, imagen: resolverImagen(i.imagen) })),
      historial: (p.pedido_historial ?? []).map((h: any) => ({ estado: h.estado, fecha: h.created_at }))
        .sort((x: any, y: any) => x.fecha.localeCompare(y.fecha)),
    })));
    setFavoritos((fav.data ?? []).map((f) => f.producto_id));
    const convs = conv.data ?? [];
    const ids = [...new Set(convs.map((c) => c.comprador_id))];
    const perfiles = ids.length ? (await supabase.from("profiles").select("id, nombre").in("id", ids)).data ?? [] : [];
    const nombre = (id: string) => perfiles.find((p) => p.id === id)?.nombre ?? "Comprador";
    setConversaciones(convs.map((c: any) => ({
      id: c.id, artesanoId: c.artesano_id, artesanoNombre: c.artesanos?.nombre ?? "Artesano", productoId: c.producto_id ?? undefined,
      productoNombre: c.producto_nombre ?? undefined, compradorId: c.comprador_id, comprador: nombre(c.comprador_id), actualizada: c.updated_at,
      mensajes: (c.mensajes ?? []).sort((a: any, b: any) => a.created_at.localeCompare(b.created_at)).map((m: any) => ({
        id: m.id, de: m.autor_id === c.comprador_id ? "comprador" : "artesano", texto: m.texto, fecha: m.created_at,
      })),
    })));
    setNotificaciones((noti.data ?? []).map((n) => ({ id: n.id, titulo: n.titulo, detalle: n.detalle, enlace: n.enlace, fecha: n.created_at, leida: n.leida })));
    void u;
  }, []);

  const cargarUsuario = useCallback(async (sesionUser: { id: string; email?: string | undefined } | null) => {
    if (!sesionUser) {
      setUsuario(null); setPedidos([]); setFavoritos([]); setConversaciones([]); setNotificaciones([]);
      return;
    }
    const [{ data: perfil }, { data: tienda }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", sesionUser.id).maybeSingle(),
      supabase.from("artesanos").select("id").eq("user_id", sesionUser.id).maybeSingle(),
    ]);
    const u: Usuario = {
      id: sesionUser.id, correo: sesionUser.email ?? "", nombre: perfil?.nombre ?? "",
      tipo: (perfil?.tipo as Usuario["tipo"]) ?? "comprador", ubicacion: perfil?.ubicacion ?? undefined, artesanoId: tienda?.id,
    };
    setUsuario(u);
    await cargarPrivado(u);
  }, [cargarPrivado]);

  useEffect(() => {
    let activo = true;
    (async () => {
      await cargarPublico();
      const { data } = await supabase.auth.getUser();
      if (activo) await cargarUsuario(data.user);
      if (activo) setCargando(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((evento, sesion) => {
      if (evento !== "SIGNED_IN" && evento !== "SIGNED_OUT" && evento !== "USER_UPDATED") return;
      setTimeout(() => void cargarUsuario(sesion?.user ?? null), 0);
    });
    return () => { activo = false; sub.subscription.unsubscribe(); };
  }, [cargarPublico, cargarUsuario]);

  // Tiempo real: mensajes, notificaciones y pedidos
  useEffect(() => {
    if (!usuario) return;
    const recargar = () => { if (usuarioRef.current) void cargarPrivado(usuarioRef.current); };
    const canal = supabase
      .channel(`usuario-${usuario.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensajes" }, recargar)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notificaciones", filter: `user_id=eq.${usuario.id}` }, recargar)
      .on("postgres_changes", { event: "*", schema: "public", table: "pedidos" }, recargar)
      .subscribe();
    return () => { void supabase.removeChannel(canal); };
  }, [usuario?.id, cargarPrivado]); // eslint-disable-line react-hooks/exhaustive-deps

  const miTienda = useMemo(() => artesanos.find((a) => a.userId === usuario?.id) ?? null, [artesanos, usuario?.id]);

  const value = useMemo<Ctx>(() => {
    const requiereSesion = (): Resultado | null => (usuarioRef.current ? null : { ok: false, error: "Inicia sesión para continuar" });
    return {
      cargando,
      usuario,
      registrar: async ({ nombre, correo, password, tipo, ubicacion }) => {
        const { data, error } = await supabase.auth.signUp({
          email: correo, password,
          options: { emailRedirectTo: `${window.location.origin}/perfil`, data: { nombre, tipo, ubicacion } },
        });
        if (error) return fallo(error);
        return { ok: true, confirmar: !data.session };
      },
      entrar: async (correo, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email: correo, password });
        return error ? fallo(error.message === "Invalid login credentials" ? new Error("Correo o contraseña incorrectos") : error) : { ok: true };
      },
      recuperar: async (correo) => {
        const { error } = await supabase.auth.resetPasswordForEmail(correo, { redirectTo: `${window.location.origin}/restablecer` });
        return error ? fallo(error) : { ok: true };
      },
      salir: async () => { await supabase.auth.signOut(); },
      artesanos,
      miTienda,
      actualizarTienda: async (d) => {
        if (!miTienda) return { ok: false, error: "No tienes una tienda" };
        const fila: Record<string, string> = {};
        const mapa: Record<string, string> = { contactoPublico: "contacto_publico" };
        for (const [k, v] of Object.entries(d)) if (v !== undefined) fila[mapa[k] ?? k] = v as string;
        const { error } = await supabase.from("artesanos").update(fila).eq("id", miTienda.id);
        if (error) return fallo(error);
        await cargarPublico();
        return { ok: true };
      },
      productos,
      guardarProducto: async (id, d) => {
        if (!miTienda) return { ok: false, error: "Solo los artesanos pueden publicar" };
        const fila = {
          nombre: d.nombre, precio: d.precio, categoria: d.categoria, descripcion: d.descripcion, materiales: d.materiales,
          dimensiones: d.dimensiones, tiempo_entrega: d.tiempoEntrega, imagenes: d.imagenes, videos: d.videos,
          disponible: d.disponible, agotado: d.agotado || d.disponible === 0,
        };
        const { error } = id
          ? await supabase.from("productos").update(fila).eq("id", id)
          : await supabase.from("productos").insert({ ...fila, artesano_id: miTienda.id });
        if (error) return fallo(error);
        await cargarPublico();
        return { ok: true };
      },
      actualizarProducto: async (id, d) => {
        const fila: { disponible?: number; agotado?: boolean; precio?: number } = { ...d };
        if (d.disponible !== undefined && d.agotado === undefined) fila.agotado = d.disponible === 0;
        const { error } = await supabase.from("productos").update(fila).eq("id", id);
        if (error) return fallo(error);
        await cargarPublico();
        return { ok: true };
      },
      eliminarProducto: async (id) => {
        const { error } = await supabase.from("productos").delete().eq("id", id);
        if (error) return fallo(error);
        await cargarPublico();
        return { ok: true };
      },
      subirArchivo: async (archivo) => {
        const u = usuarioRef.current;
        if (!u) throw new Error("Inicia sesión para subir archivos");
        const esImagen = archivo.type.startsWith("image/");
        const esVideo = archivo.type.startsWith("video/");
        if (!esImagen && !esVideo) throw new Error("Solo se permiten fotos o videos");
        if (esVideo && archivo.size > 50 * 1024 * 1024) throw new Error("El video supera 50 MB");
        const cuerpo = esImagen ? await comprimirImagen(archivo) : archivo;
        const ext = esImagen ? "jpg" : (archivo.name.split(".").pop() ?? "mp4").toLowerCase();
        const ruta = `${u.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(ruta, cuerpo, { contentType: esImagen ? "image/jpeg" : archivo.type });
        if (error) throw error;
        const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(ruta, 60 * 60 * 24 * 365 * 10);
        if (e2 || !data) throw e2 ?? new Error("No se pudo obtener el enlace");
        return data.signedUrl;
      },
      carrito,
      agregarAlCarrito: (productoId, cantidad = 1) =>
        setCarrito((c) => c.find((i) => i.productoId === productoId)
          ? c.map((i) => (i.productoId === productoId ? { ...i, cantidad: i.cantidad + cantidad } : i))
          : [...c, { productoId, cantidad }]),
      cambiarCantidad: (productoId, cantidad) =>
        setCarrito((c) => cantidad <= 0 ? c.filter((i) => i.productoId !== productoId) : c.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i))),
      quitarDelCarrito: (productoId) => setCarrito((c) => c.filter((i) => i.productoId !== productoId)),
      vaciarCarrito: () => setCarrito([]),
      pedidos,
      confirmarPedido: async (direccion) => {
        const r = requiereSesion(); if (r) return r;
        const { data, error } = await supabase.rpc("crear_pedido", {
          _items: carrito.map((i) => ({ producto_id: i.productoId, cantidad: i.cantidad })), _direccion: direccion,
        });
        if (error) return fallo(error);
        setCarrito([]);
        await Promise.all([cargarPublico(), cargarPrivado(usuarioRef.current!)]);
        return { ok: true, codigos: (data as unknown as string[]) ?? [] };
      },
      cambiarEstadoPedido: async (id, estado) => {
        const { error } = await supabase.rpc("actualizar_estado_pedido", { _pedido_id: id, _estado: estado });
        if (error) return fallo(error);
        await cargarPrivado(usuarioRef.current!);
        return { ok: true };
      },
      favoritos,
      toggleFavorito: async (productoId) => {
        const r = requiereSesion(); if (r) return r;
        const es = favoritos.includes(productoId);
        setFavoritos((f) => (es ? f.filter((x) => x !== productoId) : [...f, productoId]));
        const { error } = es
          ? await supabase.from("favoritos").delete().eq("producto_id", productoId)
          : await supabase.from("favoritos").insert({ producto_id: productoId });
        if (error) { setFavoritos((f) => (es ? [...f, productoId] : f.filter((x) => x !== productoId))); return fallo(error); }
        return { ok: true };
      },
      resenas,
      agregarResena: async ({ productoId, estrellas, comentario }) => {
        const u = usuarioRef.current;
        if (!u) return { ok: false, error: "Inicia sesión para reseñar" };
        const { error } = await supabase.from("resenas").insert({
          producto_id: productoId, autor_id: u.id, autor_nombre: u.nombre, estrellas, comentario, verificada: true,
        });
        if (error) return fallo(error.code === "42501" ? new Error("Solo puedes reseñar productos que ya recibiste") : error);
        await cargarPublico();
        return { ok: true };
      },
      conversaciones,
      iniciarConversacion: async (artesanoId, producto) => {
        const u = usuarioRef.current;
        if (!u) return null;
        let q = supabase.from("conversaciones").select("id").eq("comprador_id", u.id).eq("artesano_id", artesanoId);
        q = producto ? q.eq("producto_id", producto.id) : q.is("producto_id", null);
        const { data: existe } = await q.maybeSingle();
        if (existe) return existe.id;
        const { data, error } = await supabase.from("conversaciones")
          .insert({ comprador_id: u.id, artesano_id: artesanoId, producto_id: producto?.id ?? null, producto_nombre: producto?.nombre ?? null })
          .select("id").single();
        if (error) return null;
        await cargarPrivado(u);
        return data.id;
      },
      enviarMensaje: async (conversacionId, texto) => {
        const u = usuarioRef.current;
        if (!u) return { ok: false, error: "Inicia sesión" };
        const { error } = await supabase.from("mensajes").insert({ conversacion_id: conversacionId, autor_id: u.id, texto });
        if (error) return fallo(error);
        await cargarPrivado(u);
        return { ok: true };
      },
      notificaciones,
      marcarNotificacionesLeidas: async () => {
        const u = usuarioRef.current;
        if (!u) return;
        setNotificaciones((n) => n.map((x) => ({ ...x, leida: true })));
        await supabase.from("notificaciones").update({ leida: true }).eq("user_id", u.id).eq("leida", false);
      },
      publicaciones,
      crearPublicacion: async (d) => {
        if (!miTienda) return { ok: false, error: "Solo los artesanos pueden publicar" };
        const { error } = await supabase.from("publicaciones").insert({ artesano_id: miTienda.id, tipo: d.tipo, media_url: d.mediaUrl, texto: d.texto });
        if (error) return fallo(error);
        await cargarPublico();
        return { ok: true };
      },
      ocultarPublicacion: async (id, oculta) => {
        const { error } = await supabase.from("publicaciones").update({ oculta }).eq("id", id);
        if (error) return fallo(error);
        await cargarPublico();
        return { ok: true };
      },
      eliminarPublicacion: async (id) => {
        const { error } = await supabase.from("publicaciones").delete().eq("id", id);
        if (error) return fallo(error);
        await cargarPublico();
        return { ok: true };
      },
      reportarPublicacion: async (id, motivo) => {
        const r = requiereSesion(); if (r) return r;
        const { error } = await supabase.from("reportes").insert({ publicacion_id: id, motivo });
        if (error) return fallo(error.code === "23505" ? new Error("Ya reportaste esta publicación") : error);
        return { ok: true };
      },
    };
  }, [cargando, usuario, artesanos, miTienda, productos, carrito, pedidos, favoritos, resenas, conversaciones, notificaciones, publicaciones, cargarPublico, cargarPrivado]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
