import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/store";

type BusquedaChat = { con?: string | undefined };

export const Route = createFileRoute("/mensajes")({
  validateSearch: (search: Record<string, unknown>): BusquedaChat => ({
    con: typeof search["con"] === "string" ? (search["con"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Mensajes | Ruta del Arte Samario" },
      { name: "description", content: "Habla directamente con los artesanos sobre productos, personalización y entregas." },
      { property: "og:title", content: "Chat con artesanos" },
      { property: "og:description", content: "Comunícate directo con quien crea cada pieza." },
    ],
  }),
  component: Mensajes,
});

function Mensajes() {
  const { conversaciones, enviarMensaje, usuario } = useApp();
  const { con } = Route.useSearch();
  const navigate = useNavigate({ from: "/mensajes" });
  const [texto, setTexto] = useState("");
  const finalRef = useRef<HTMLDivElement>(null);

  const activa = conversaciones.find((c) => c.id === con) ?? conversaciones[0];
  const soyArtesano = (c: { compradorId: string }) => c.compradorId !== usuario?.id;

  useEffect(() => {
    finalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activa?.mensajes.length]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio || !activa) return;
    setTexto("");
    const r = await enviarMensaje(activa.id, limpio);
    if (!r.ok) { setTexto(limpio); toast.error("No se envió el mensaje", { description: r.error }); }
  };

  if (!usuario) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md px-5 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Inicia sesión para ver tus mensajes</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tus conversaciones con artesanos son privadas.</p>
          <Link to="/auth" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground">Iniciar sesión</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-5 py-6">
        <h1 className="font-display text-3xl font-bold">Mensajes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Habla directamente con los artesanos sobre productos, personalización y entregas.
        </p>

        {conversaciones.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Todavía no tienes conversaciones. Abre un producto y toca “Escribir al artesano”. Si eres artesano, aquí llegarán las preguntas de tus compradores.
            </p>
            <Link
              to="/explorar"
              className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Explorar artesanías
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-[280px_1fr]">
            <ul className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
              {conversaciones.map((c) => {
                const ultimo = c.mensajes[c.mensajes.length - 1];
                return (
                  <li key={c.id} className="min-w-56 md:min-w-0">
                    <button
                      onClick={() => navigate({ search: (prev) => ({ ...prev, con: c.id }) })}
                      className={`w-full rounded-2xl border p-3 text-left ${
                        activa?.id === c.id ? "border-accent bg-secondary" : "border-border bg-card"
                      }`}
                    >
                      <p className="truncate text-sm font-semibold">{soyArtesano(c) ? c.comprador : c.artesanoNombre}</p>
                      {c.productoNombre && (
                        <p className="truncate text-[11px] uppercase tracking-wide text-accent">{c.productoNombre}</p>
                      )}
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {ultimo ? ultimo.texto : "Inicia la conversación"}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>

            {activa && (
              <section className="flex min-h-[60vh] flex-col rounded-3xl border border-border bg-card">
                <header className="border-b border-border px-5 py-3.5">
                  <p className="font-display text-base font-bold">{soyArtesano(activa) ? activa.comprador : activa.artesanoNombre}</p>
                  {activa.productoNombre && (
                    <p className="text-xs text-muted-foreground">
                      Sobre: {activa.productoNombre}
                    </p>
                  )}
                </header>

                <div className="flex-1 space-y-2.5 overflow-y-auto px-5 py-4">
                  {activa.mensajes.length === 0 && (
                    <p className="py-8 text-center text-xs text-muted-foreground">
                      Escribe tu primera pregunta: disponibilidad, personalización o tiempos de entrega.
                    </p>
                  )}
                  {activa.mensajes.map((m) => {
                    const mio = (m.de === "artesano") === soyArtesano(activa);
                    return (
                    <div key={m.id} className={`flex ${mio ? "justify-end" : "justify-start"}`}>
                      <p
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
                          mio
                            ? "rounded-br-md bg-accent text-accent-foreground"
                            : "rounded-bl-md bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {m.texto}
                        <span className="mt-0.5 block text-[10px] opacity-70">{new Date(m.fecha).toLocaleTimeString("es-CO", { timeStyle: "short" })}</span>
                      </p>
                    </div>
                  );})}
                  <div ref={finalRef} />
                </div>

                <form onSubmit={enviar} className="flex gap-2 border-t border-border p-3">
                  <input
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escribe un mensaje…"
                    maxLength={2000}
                    aria-label="Escribe un mensaje"
                    className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="submit"
                    aria-label="Enviar mensaje"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </section>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
