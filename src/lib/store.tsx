import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { productosBase, type Producto } from "./data";

export type Usuario = {
  nombre: string;
  correo: string;
  tipo: "comprador" | "artesano";
  ubicacion?: string;
  historia?: string;
};

export type ItemCarrito = { productoId: string; cantidad: number };

export type EstadoPedido = "Pedido recibido" | "En preparación" | "Enviado" | "Entregado";

export type Pedido = {
  id: string;
  fecha: string;
  items: { productoId: string; nombre: string; precio: number; cantidad: number; imagen: string }[];
  total: number;
  estado: EstadoPedido;
  comprador: string;
};

export const estadosPedido: EstadoPedido[] = [
  "Pedido recibido",
  "En preparación",
  "Enviado",
  "Entregado",
];

type Ctx = {
  usuario: Usuario | null;
  registrar: (u: Usuario & { password: string }) => void;
  entrar: (correo: string, password: string) => boolean;
  salir: () => void;
  productos: Producto[];
  agregarProducto: (p: Omit<Producto, "id">) => void;
  actualizarProducto: (id: string, p: Partial<Producto>) => void;
  eliminarProducto: (id: string) => void;
  carrito: ItemCarrito[];
  agregarAlCarrito: (productoId: string, cantidad?: number) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  quitarDelCarrito: (productoId: string) => void;
  vaciarCarrito: () => void;
  pedidos: Pedido[];
  confirmarPedido: () => Pedido | null;
  avanzarPedido: (id: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);

const KEY = "ruta-arte-samario";

type Persist = {
  usuario: Usuario | null;
  cuentas: (Usuario & { password: string })[];
  productos: Producto[];
  carrito: ItemCarrito[];
  pedidos: Pedido[];
};

const inicial: Persist = {
  usuario: null,
  cuentas: [],
  productos: productosBase,
  carrito: [],
  pedidos: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persist>(inicial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...inicial, ...JSON.parse(raw) });
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state]);

  const value = useMemo<Ctx>(
    () => ({
      usuario: state.usuario,
      registrar: (u) =>
        setState((s) => ({
          ...s,
          cuentas: [...s.cuentas.filter((c) => c.correo !== u.correo), u],
          usuario: { nombre: u.nombre, correo: u.correo, tipo: u.tipo, ubicacion: u.ubicacion },
        })),
      entrar: (correo, password) => {
        const cuenta = state.cuentas.find((c) => c.correo === correo && c.password === password);
        if (!cuenta) return false;
        setState((s) => ({
          ...s,
          usuario: { nombre: cuenta.nombre, correo: cuenta.correo, tipo: cuenta.tipo, ubicacion: cuenta.ubicacion },
        }));
        return true;
      },
      salir: () => setState((s) => ({ ...s, usuario: null })),
      productos: state.productos,
      agregarProducto: (p) =>
        setState((s) => ({ ...s, productos: [{ ...p, id: `n${Date.now()}` }, ...s.productos] })),
      actualizarProducto: (id, p) =>
        setState((s) => ({
          ...s,
          productos: s.productos.map((x) => (x.id === id ? { ...x, ...p } : x)),
        })),
      eliminarProducto: (id) =>
        setState((s) => ({ ...s, productos: s.productos.filter((x) => x.id !== id) })),
      carrito: state.carrito,
      agregarAlCarrito: (productoId, cantidad = 1) =>
        setState((s) => {
          const existe = s.carrito.find((i) => i.productoId === productoId);
          return {
            ...s,
            carrito: existe
              ? s.carrito.map((i) =>
                  i.productoId === productoId ? { ...i, cantidad: i.cantidad + cantidad } : i,
                )
              : [...s.carrito, { productoId, cantidad }],
          };
        }),
      cambiarCantidad: (productoId, cantidad) =>
        setState((s) => ({
          ...s,
          carrito:
            cantidad <= 0
              ? s.carrito.filter((i) => i.productoId !== productoId)
              : s.carrito.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i)),
        })),
      quitarDelCarrito: (productoId) =>
        setState((s) => ({ ...s, carrito: s.carrito.filter((i) => i.productoId !== productoId) })),
      vaciarCarrito: () => setState((s) => ({ ...s, carrito: [] })),
      pedidos: state.pedidos,
      confirmarPedido: () => {
        if (state.carrito.length === 0) return null;
        const items = state.carrito.map((i) => {
          const p = state.productos.find((x) => x.id === i.productoId)!;
          return {
            productoId: p.id,
            nombre: p.nombre,
            precio: p.precio,
            cantidad: i.cantidad,
            imagen: p.imagen,
          };
        });
        const pedido: Pedido = {
          id: `RAS-${String(state.pedidos.length + 1).padStart(4, "0")}`,
          fecha: new Date().toISOString(),
          items,
          total: items.reduce((a, b) => a + b.precio * b.cantidad, 0),
          estado: "Pedido recibido",
          comprador: state.usuario?.nombre ?? "Invitado",
        };
        setState((s) => ({ ...s, pedidos: [pedido, ...s.pedidos], carrito: [] }));
        return pedido;
      },
      avanzarPedido: (id) =>
        setState((s) => ({
          ...s,
          pedidos: s.pedidos.map((p) =>
            p.id === id
              ? {
                  ...p,
                  estado:
                    estadosPedido[Math.min(estadosPedido.indexOf(p.estado) + 1, estadosPedido.length - 1)],
                }
              : p,
          ),
        })),
    }),
    [state],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
