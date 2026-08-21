import mochila from "@/assets/p-mochila.jpg";
import accesorios from "@/assets/p-accesorios.jpg";
import ceramica from "@/assets/p-ceramica.jpg";
import madera from "@/assets/p-madera.jpg";
import sandalias from "@/assets/p-sandalias.jpg";
import decoracion from "@/assets/p-decoracion.jpg";

export const imagenes: Record<string, string> = {
  mochila,
  accesorios,
  ceramica,
  madera,
  sandalias,
  decoracion,
};

export type Categoria =
  | "Tejidos y mochilas"
  | "Accesorios"
  | "Cerámica"
  | "Madera"
  | "Sandalias y calzado"
  | "Decoración"
  | "Otros";

export const categorias: { nombre: Categoria; icono: string; img: string }[] = [
  { nombre: "Tejidos y mochilas", icono: "🧶", img: mochila },
  { nombre: "Accesorios", icono: "📿", img: accesorios },
  { nombre: "Cerámica", icono: "🏺", img: ceramica },
  { nombre: "Madera", icono: "🪵", img: madera },
  { nombre: "Sandalias y calzado", icono: "👡", img: sandalias },
  { nombre: "Decoración", icono: "🪢", img: decoracion },
  { nombre: "Otros", icono: "✨", img: accesorios },
];

export type Artesano = {
  id: string;
  nombre: string;
  taller: string;
  ubicacion: string;
  descripcion: string;
  historia: string;
  telefono: string;
  correo: string;
  foto: string;
  coords: { x: number; y: number };
};

export const artesanos: Artesano[] = [
  {
    id: "a1",
    nombre: "Luz Marina Epieyu",
    taller: "Tejidos Epieyu",
    ubicacion: "Centro Histórico, Santa Marta",
    descripcion: "Tejedora wayuu de mochilas en crochet con patrones ancestrales.",
    historia:
      "Aprendí a tejer a los ocho años, sentada junto a mi abuela en la ranchería. Cada kanasü que dibujo en una mochila cuenta algo: el camino del agua, la huella del cangrejo, la estrella que guía a los pescadores. Llegué a Santa Marta hace veinte años y desde entonces tejo frente al mar, mezclando los colores de la Sierra con los del Caribe.",
    telefono: "+57 300 555 1201",
    correo: "luzmarina@rutadelartesamario.co",
    foto: mochila,
    coords: { x: 26, y: 42 },
  },
  {
    id: "a2",
    nombre: "Ovidio Camargo",
    taller: "Barro de Taganga",
    ubicacion: "Taganga",
    descripcion: "Ceramista que trabaja con arcilla roja y motivos tayrona.",
    historia:
      "Mi padre era pescador y yo quería quedarme en tierra. Encontré la arcilla en la quebrada y empecé a copiar las figuras que veíamos en las piedras tayrona. Hoy el horno de leña sigue encendido en el patio de la casa y cada pieza guarda un poco del humo de Taganga.",
    telefono: "+57 300 555 1202",
    correo: "ovidio@rutadelartesamario.co",
    foto: ceramica,
    coords: { x: 44, y: 22 },
  },
  {
    id: "a3",
    nombre: "Yaneth Daza",
    taller: "Semillas del Magdalena",
    ubicacion: "Minca, Magdalena",
    descripcion: "Accesorios con semillas, fibras naturales y chaquiras.",
    historia:
      "En Minca todo crece rápido: el café, la niebla y las semillas. Recojo semillas caídas en los caminos y las convierto en collares. Trabajo con ocho mujeres del vecindario y con cada venta pagamos la escuela de nuestros hijos.",
    telefono: "+57 300 555 1203",
    correo: "yaneth@rutadelartesamario.co",
    foto: accesorios,
    coords: { x: 68, y: 66 },
  },
  {
    id: "a4",
    nombre: "Rafael Bermúdez",
    taller: "Taller Madera Viva",
    ubicacion: "Bonda, Santa Marta",
    descripcion: "Tallador de utensilios y esculturas en maderas recuperadas.",
    historia:
      "Nunca corto un árbol vivo. Trabajo con madera que el río baja en invierno y con troncos que caen solos. Tallar es escuchar: la madera dice qué quiere ser y uno solo le quita lo que le sobra.",
    telefono: "+57 300 555 1204",
    correo: "rafael@rutadelartesamario.co",
    foto: madera,
    coords: { x: 74, y: 34 },
  },
  {
    id: "a5",
    nombre: "Dilia Pertuz",
    taller: "Sandalias Guajira Azul",
    ubicacion: "El Rodadero",
    descripcion: "Calzado artesanal en cuero con tejidos de colores.",
    historia:
      "Empecé vendiendo sandalias en la playa del Rodadero, caminando de sombrilla en sombrilla. Ahora tengo un pequeño taller donde entreno a jóvenes del barrio para que aprendan el oficio del cuero.",
    telefono: "+57 300 555 1205",
    correo: "dilia@rutadelartesamario.co",
    foto: sandalias,
    coords: { x: 18, y: 76 },
  },
  {
    id: "a6",
    nombre: "Colectivo Manos de Mar",
    taller: "Manos de Mar",
    ubicacion: "Playa Salguero, Santa Marta",
    descripcion: "Decoración en macramé, fique y palma iraca.",
    historia:
      "Somos doce mujeres que nos reunimos cada tarde bajo el mismo almendro. Tejemos hamacas, atrapasueños y lámparas mientras contamos historias del barrio. La artesanía nos volvió a juntar después del huracán.",
    telefono: "+57 300 555 1206",
    correo: "manosdemar@rutadelartesamario.co",
    foto: decoracion,
    coords: { x: 52, y: 86 },
  },
];

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  categoria: Categoria;
  artesanoId: string;
  descripcion: string;
  imagen: string;
  disponible: number;
  destacado?: boolean;
};

export const productosBase: Producto[] = [
  {
    id: "p1",
    nombre: "Mochila wayuu tejida a mano",
    precio: 290000,
    categoria: "Tejidos y mochilas",
    artesanoId: "a1",
    descripcion:
      "Mochila de una hebra tejida en crochet durante 20 días. Patrones kanasü inspirados en el camino del agua.",
    imagen: mochila,
    disponible: 4,
    destacado: true,
  },
  {
    id: "p2",
    nombre: "Vasija tayrona en arcilla roja",
    precio: 185000,
    categoria: "Cerámica",
    artesanoId: "a2",
    descripcion: "Pieza torneada a mano y quemada en horno de leña, con grabados de figuras tayrona.",
    imagen: ceramica,
    disponible: 2,
    destacado: true,
  },
  {
    id: "p3",
    nombre: "Collar de semillas del Magdalena",
    precio: 78000,
    categoria: "Accesorios",
    artesanoId: "a3",
    descripcion: "Collar con semillas recolectadas en Minca, chaquira y fibra natural teñida con tintes vegetales.",
    imagen: accesorios,
    disponible: 12,
    destacado: true,
  },
  {
    id: "p4",
    nombre: "Cuenco tallado en madera recuperada",
    precio: 145000,
    categoria: "Madera",
    artesanoId: "a4",
    descripcion: "Cuenco tallado en una sola pieza, acabado con aceite de coco. Cada veta es única.",
    imagen: madera,
    disponible: 5,
    destacado: true,
  },
  {
    id: "p5",
    nombre: "Sandalias de cuero con tejido caribe",
    precio: 165000,
    categoria: "Sandalias y calzado",
    artesanoId: "a5",
    descripcion: "Cuero curtido artesanalmente y empeine tejido a mano en hilos de colores.",
    imagen: sandalias,
    disponible: 8,
    destacado: true,
  },
  {
    id: "p6",
    nombre: "Atrapasueños en fique y palma",
    precio: 120000,
    categoria: "Decoración",
    artesanoId: "a6",
    descripcion: "Pieza decorativa tejida en fique natural y palma iraca, ideal para muros y terrazas.",
    imagen: decoracion,
    disponible: 6,
    destacado: true,
  },
  {
    id: "p7",
    nombre: "Mochila pequeña de playa",
    precio: 130000,
    categoria: "Tejidos y mochilas",
    artesanoId: "a1",
    descripcion: "Versión compacta ideal para el día a día, con cordón trenzado y borlas.",
    imagen: mochila,
    disponible: 9,
  },
  {
    id: "p8",
    nombre: "Set de pulseras en chaquira",
    precio: 45000,
    categoria: "Accesorios",
    artesanoId: "a3",
    descripcion: "Tres pulseras tejidas en chaquira checa con diseños geométricos.",
    imagen: accesorios,
    disponible: 20,
  },
  {
    id: "p9",
    nombre: "Hamaca tejida Manos de Mar",
    precio: 320000,
    categoria: "Decoración",
    artesanoId: "a6",
    descripcion: "Hamaca en algodón trenzado por doce artesanas, resistente y fresca.",
    imagen: decoracion,
    disponible: 3,
  },
  {
    id: "p10",
    nombre: "Máscara decorativa en madera",
    precio: 210000,
    categoria: "Madera",
    artesanoId: "a4",
    descripcion: "Escultura mural tallada a mano inspirada en la máscara del carnaval caribeño.",
    imagen: madera,
    disponible: 2,
  },
  {
    id: "p11",
    nombre: "Jarra de barro de Taganga",
    precio: 96000,
    categoria: "Cerámica",
    artesanoId: "a2",
    descripcion: "Jarra funcional de arcilla roja, mantiene el agua fresca de forma natural.",
    imagen: ceramica,
    disponible: 7,
  },
  {
    id: "p12",
    nombre: "Alpargatas artesanales de fique",
    precio: 98000,
    categoria: "Sandalias y calzado",
    artesanoId: "a5",
    descripcion: "Suela de fique trenzado y capellada en lona teñida a mano.",
    imagen: sandalias,
    disponible: 10,
  },
];

export const ubicaciones = [
  "Centro Histórico, Santa Marta",
  "Taganga",
  "Minca, Magdalena",
  "Bonda, Santa Marta",
  "El Rodadero",
  "Playa Salguero, Santa Marta",
];

export const puntosInteres = [
  { nombre: "Mercado Artesanal del Camellón", tipo: "Punto de venta", x: 34, y: 52 },
  { nombre: "Casa de la Cultura Samaria", tipo: "Cultura", x: 60, y: 48 },
  { nombre: "Muelle de Taganga", tipo: "Ruta turística", x: 48, y: 16 },
];

export const formatoCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);
