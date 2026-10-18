import { Download, Printer, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/logo.png.asset.json";

/** Dirección pública permanente (dominio publicado si existe, si no el actual). */
export const urlPublica = (ruta: string) =>
  `${typeof window !== "undefined" ? window.location.origin : "https://ruta-del-arte-samario.lovable.app"}${ruta}`;

function cargarImagen(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

/** Dibuja la tarjeta/etiqueta con logo, QR, nombre y texto de apoyo. */
async function dibujarTarjeta(url: string, titulo: string, subtitulo: string) {
  const W = 700, H = 980;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fbf6ec"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#0f6e78"; g.fillRect(0, 0, W, 18); g.fillRect(0, H - 18, W, 18);
  try {
    const l = await cargarImagen(logo.url);
    g.save(); g.beginPath(); g.arc(W / 2, 120, 80, 0, Math.PI * 2); g.clip();
    g.drawImage(l, W / 2 - 80, 40, 160, 160); g.restore();
  } catch { /* sin logo */ }
  g.textAlign = "center"; g.fillStyle = "#3a2a1e";
  g.font = "700 30px Georgia, serif"; g.fillText("Ruta del Arte Samario", W / 2, 245);
  const qr = await QRCode.toDataURL(url, { width: 440, margin: 1, color: { dark: "#2b1d12", light: "#ffffff" } });
  const q = await cargarImagen(qr);
  g.fillStyle = "#ffffff"; g.fillRect(W / 2 - 240, 275, 480, 480);
  g.drawImage(q, W / 2 - 220, 295, 440, 440);
  g.fillStyle = "#3a2a1e"; g.font = "700 34px Georgia, serif";
  g.fillText(titulo.length > 32 ? `${titulo.slice(0, 31)}…` : titulo, W / 2, 815);
  g.fillStyle = "#b5532f"; g.font = "500 22px sans-serif"; g.fillText(subtitulo.slice(0, 48), W / 2, 855);
  g.fillStyle = "#6b5b4d"; g.font = "18px sans-serif";
  g.fillText("Escanea para ver la pieza, su historia y su artesano", W / 2, 905);
  return c.toDataURL("image/png");
}

export function QrTarjeta({ ruta, titulo, subtitulo, nombreArchivo }: { ruta: string; titulo: string; subtitulo: string; nombreArchivo: string }) {
  const [abierto, setAbierto] = useState(false);
  const [imagen, setImagen] = useState<string | null>(null);
  const url = urlPublica(ruta);

  useEffect(() => {
    if (!abierto) return;
    let vivo = true;
    dibujarTarjeta(url, titulo, subtitulo).then((d) => vivo && setImagen(d)).catch(() => toast.error("No se pudo generar el QR"));
    return () => { vivo = false; };
  }, [abierto, url, titulo, subtitulo]);

  const descargar = () => {
    if (!imagen) return;
    const a = document.createElement("a");
    a.href = imagen; a.download = `${nombreArchivo}.png`; a.click();
  };
  const imprimir = () => {
    if (!imagen) return;
    const w = window.open("", "_blank");
    if (!w) { toast.error("Permite las ventanas emergentes para imprimir"); return; }
    w.document.write(`<title>${titulo}</title><body style="margin:0;display:flex;justify-content:center"><img src="${imagen}" style="width:9cm" onload="setTimeout(()=>{print();},200)"></body>`);
    w.document.close();
  };

  if (!abierto) {
    return (
      <button type="button" onClick={() => setAbierto(true)} className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-4 py-2.5 text-xs font-semibold">
        <QrCode className="h-4 w-4" /> Código QR
      </button>
    );
  }
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        {imagen ? (
          <img src={imagen} alt={`Tarjeta con código QR de ${titulo}`} className="w-40 rounded-xl border border-border" />
        ) : (
          <div className="flex h-56 w-40 items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground">Generando…</div>
        )}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="font-display font-semibold">Código QR de {titulo}</p>
          <p className="mt-1 break-all text-xs text-muted-foreground">Lleva a: <a href={url} className="text-primary underline">{url}</a></p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <button type="button" onClick={descargar} disabled={!imagen} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground disabled:opacity-50">
              <Download className="h-3.5 w-3.5" /> Descargar PNG
            </button>
            <button type="button" onClick={imprimir} disabled={!imagen} className="inline-flex items-center gap-1.5 rounded-full border border-input px-4 py-2 text-xs font-semibold disabled:opacity-50">
              <Printer className="h-3.5 w-3.5" /> Imprimir tarjeta
            </button>
            <button type="button" onClick={() => setAbierto(false)} className="rounded-full px-3 py-2 text-xs text-muted-foreground">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
