import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/logo.png.asset.json";
import { AppShell } from "@/components/AppShell";
import { ubicaciones } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Crear cuenta o iniciar sesión | Ruta del Arte Samario" },
      { name: "description", content: "Regístrate como comprador o artesano para comprar y vender artesanías samarias." },
      { property: "og:title", content: "Acceso a Ruta del Arte Samario" },
      { property: "og:description", content: "Crea tu cuenta de comprador o artesano." },
    ],
  }),
  component: Auth,
});

type Modo = "registro" | "ingreso" | "recuperar";

function Auth() {
  const { registrar, entrar, recuperar } = useApp();
  const navigate = useNavigate();
  const [modo, setModo] = useState<Modo>("registro");
  const [tipo, setTipo] = useState<"comprador" | "artesano">("comprador");
  const [form, setForm] = useState({ nombre: "", correo: "", password: "", ubicacion: ubicaciones[0]! });
  const [enviando, setEnviando] = useState(false);

  const campo = "mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring";

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      if (modo === "registro") {
        if (form.password.length < 8) { toast.error("La contraseña debe tener al menos 8 caracteres"); return; }
        const r = await registrar({ ...form, tipo });
        if (!r.ok) { toast.error("No se pudo crear la cuenta", { description: r.error }); return; }
        if (r.confirmar) {
          toast.success("Revisa tu correo", { description: "Te enviamos un enlace para confirmar tu cuenta." });
          setModo("ingreso");
        } else {
          toast.success(`¡Bienvenido/a, ${form.nombre}!`);
          navigate({ to: tipo === "artesano" ? "/panel" : "/explorar" });
        }
      } else if (modo === "ingreso") {
        const r = await entrar(form.correo, form.password);
        if (r.ok) { toast.success("Sesión iniciada"); navigate({ to: "/perfil" }); }
        else toast.error(r.error);
      } else {
        const r = await recuperar(form.correo);
        if (r.ok) { toast.success("Te enviamos un enlace de recuperación", { description: form.correo }); setModo("ingreso"); }
        else toast.error(r.error);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md px-5 py-8">
        <img src={logo.url} alt="Logo Ruta del Arte Samario" className="mx-auto h-24 w-24 rounded-full shadow-suave" />
        <h1 className="mt-5 text-center font-display text-3xl font-bold">
          {modo === "registro" ? "Crear cuenta" : modo === "ingreso" ? "Iniciar sesión" : "Recuperar contraseña"}
        </h1>

        <div className="mt-6 grid grid-cols-2 rounded-full bg-secondary p-1 text-sm">
          <button
            onClick={() => setModo("registro")}
            className={`rounded-full py-2 font-medium ${modo === "registro" ? "bg-card shadow-card" : ""}`}
          >
            Registro
          </button>
          <button
            onClick={() => setModo("ingreso")}
            className={`rounded-full py-2 font-medium ${modo === "ingreso" ? "bg-card shadow-card" : ""}`}
          >
            Ingresar
          </button>
        </div>

        <form onSubmit={enviar} className="mt-6 space-y-4">
          {modo === "registro" && (
            <>
              <div>
                <p className="text-sm font-medium">Tipo de usuario</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["comprador", "artesano"] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTipo(t)}
                      className={`rounded-2xl border p-3 text-sm capitalize ${
                        tipo === t ? "border-accent bg-secondary font-semibold" : "border-border"
                      }`}
                    >
                      {t === "comprador" ? "🛍️ Comprador" : "🧶 Artesano"}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block text-sm font-medium">
                Nombre completo
                <input
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className={campo}
                  placeholder="Ej. Luz Marina Epieyu"
                />
              </label>
              {tipo === "artesano" && (
                <label className="block text-sm font-medium">
                  Ubicación del taller
                  <select
                    value={form.ubicacion}
                    onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                    className={campo}
                  >
                    {ubicaciones.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </>
          )}

          <label className="block text-sm font-medium">
            Correo electrónico
            <input
              required
              type="email"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              className={campo}
              placeholder="tucorreo@ejemplo.com"
            />
          </label>

          {modo !== "recuperar" && (
            <label className="block text-sm font-medium">
              Contraseña
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={campo}
                placeholder="••••••••"
              />
            </label>
          )}

          <button className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-accent-foreground">
            {modo === "registro" ? "Crear cuenta" : modo === "ingreso" ? "Entrar" : "Enviar enlace"}
          </button>
        </form>

        <button
          onClick={() => setModo(modo === "recuperar" ? "ingreso" : "recuperar")}
          className="mt-4 w-full text-center text-sm text-primary"
        >
          {modo === "recuperar" ? "Volver a iniciar sesión" : "¿Olvidaste tu contraseña?"}
        </button>
      </div>
    </AppShell>
  );
}
