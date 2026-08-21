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
  proceso: string;
  telefono: string;
  correo: string;
  foto: string;
  verificado: boolean;
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
    proceso:
      "Cada mochila se teje a una hebra en técnica de crochet durante 15 a 25 días. Los hilos de algodón se tiñen con tintes naturales y cada patrón kanasü se dibuja a mano antes de empezar el tejido.",
    telefono: "+57 300 555 1201",
    correo: "luzmarina@rutadelartesamario.co",
    foto: mochila,
    verificado: true,
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
    proceso:
      "La arcilla se extrae de la quebrada, se amasa a pie limpio y se tornea a mano. Las piezas se secan al sol durante una semana y se queman en horno de leña a más de 900 grados.",
    telefono: "+57 300 555 1202",
    correo: "ovidio@rutadelartesamario.co",
    foto: ceramica,
    verificado: true,
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
    proceso:
      "Recolectamos semillas caídas (nunca cortadas del árbol), las secamos, pulimos y perforamos a mano. Los tejidos en chaquira se arman mostacilla por mostacilla siguiendo patrones geométricos.",
    telefono: "+57 300 555 1203",
    correo: "yaneth@rutadelartesamario.co",
    foto: accesorios,
    verificado: false,
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
    proceso:
      "Trabajo solo con madera recuperada del río Manzanares. Cada pieza se talla con gubia y machete, se lija en cuatro granos y se sella con aceite de coco y cera de abejas.",
    telefono: "+57 300 555 1204",
    correo: "rafael@rutadelartesamario.co",
    foto: madera,
    verificado: false,
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
    proceso:
      "El cuero se curte artesanalmente, se corta a mano sobre horma y el empeine se teje con hilos encerados de colores. Cada par lleva dos días de trabajo entre corte, costura y tejido.",
    telefono: "+57 300 555 1205",
    correo: "dilia@rutadelartesamario.co",
    foto: sandalias,
    verificado: true,
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
    proceso:
      "Tejemos en macramé con nudos planos y festón, usando fique natural y palma de iraca del interior del Magdalena. Las piezas grandes, como las hamacas, las trabajamos entre cuatro manos.",
    telefono: "+57 300 555 1206",
    correo: "manosdemar@rutadelartesamario.co",
    foto: decoracion,
    verificado: true,
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
  materiales?: string;
  dimensiones?: string;
  tiempoEntrega?: string;
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
    materiales: "Hilo de algodón, tintes naturales",
    dimensiones: "28 cm alto × 22 cm diámetro",
    tiempoEntrega: "3 a 5 días hábiles",
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
    materiales: "Arcilla roja de Taganga",
    dimensiones: "24 cm alto × 18 cm diámetro",
    tiempoEntrega: "4 a 6 días hábiles",
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
    materiales: "Semillas naturales, chaquira checa, fibra de fique",
    dimensiones: "45 cm de largo, ajustable",
    tiempoEntrega: "2 a 3 días hábiles",
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
    materiales: "Madera recuperada del río Manzanares, aceite de coco",
    dimensiones: "20 cm diámetro × 9 cm alto",
    tiempoEntrega: "3 a 5 días hábiles",
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
    materiales: "Cuero curtido vegetal, hilo encerado, suela de caucho",
    dimensiones: "Tallas 35 a 42",
    tiempoEntrega: "3 a 4 días hábiles",
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
    materiales: "Fique natural, palma de iraca, plumas sintéticas",
    dimensiones: "40 cm diámetro × 90 cm largo total",
    tiempoEntrega: "2 a 4 días hábiles",
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
    materiales: "Hilo de algodón, tintes naturales",
    dimensiones: "18 cm alto × 14 cm diámetro",
    tiempoEntrega: "2 a 3 días hábiles",
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
    materiales: "Chaquira checa, hilo de nylon encerado",
    dimensiones: "Talla única ajustable",
    tiempoEntrega: "1 a 2 días hábiles",
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
    materiales: "Algodón trenzado, argollas de madera",
    dimensiones: "3.4 m largo × 1.5 m ancho",
    tiempoEntrega: "5 a 7 días hábiles",
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
    materiales: "Madera de cedro recuperada, pintura acrílica",
    dimensiones: "35 cm alto × 22 cm ancho",
    tiempoEntrega: "4 a 6 días hábiles",
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
    materiales: "Arcilla roja, esmalte natural sin plomo",
    dimensiones: "22 cm alto, capacidad 1.5 L",
    tiempoEntrega: "3 a 5 días hábiles",
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
    materiales: "Fique trenzado, lona de algodón teñida a mano",
    dimensiones: "Tallas 35 a 42",
    tiempoEntrega: "2 a 4 días hábiles",
  },
];

export type Resena = {
  id: string;
  productoId: string;
  autor: string;
  estrellas: number;
  comentario: string;
  fecha: string;
};

export const resenasBase: Resena[] = [
  {
    id: "r1",
    productoId: "p1",
    autor: "Camila Torres",
    estrellas: 5,
    comentario: "Hermosa, se nota el trabajo de semanas en cada tejido. Llegó bien empacada y antes de lo esperado.",
    fecha: "2026-07-18T10:00:00.000Z",
  },
  {
    id: "r2",
    productoId: "p1",
    autor: "Andrés Mejía",
    estrellas: 4,
    comentario: "Muy buena calidad y los colores son exactamente como en la foto. La uso todos los días.",
    fecha: "2026-08-02T15:30:00.000Z",
  },
  {
    id: "r3",
    productoId: "p2",
    autor: "Valentina Ríos",
    estrellas: 5,
    comentario: "Una pieza única. Los grabados tayrona son impresionantes y el acabado es impecable.",
    fecha: "2026-07-25T09:15:00.000Z",
  },
  {
    id: "r4",
    productoId: "p3",
    autor: "Jorge Padilla",
    estrellas: 5,
    comentario: "Compré dos collares para regalo y fueron un éxito. Se siente el amor por el detalle.",
    fecha: "2026-08-10T18:45:00.000Z",
  },
  {
    id: "r5",
    productoId: "p4",
    autor: "María Fernanda Cotes",
    estrellas: 4,
    comentario: "El cuenco es precioso y la veta de la madera es única. Perfecto para la cocina.",
    fecha: "2026-08-05T12:00:00.000Z",
  },
  {
    id: "r6",
    productoId: "p5",
    autor: "Daniel Ospina",
    estrellas: 5,
    comentario: "Cómodas desde el primer día y el tejido es de otro nivel. Volveré a comprar.",
    fecha: "2026-07-30T20:10:00.000Z",
  },
  {
    id: "r7",
    productoId: "p6",
    autor: "Lucía Gamboa",
    estrellas: 5,
    comentario: "Quedó hermoso en la terraza. Las chicas de Manos de Mar fueron muy amables por el chat.",
    fecha: "2026-08-12T14:20:00.000Z",
  },
  {
    id: "r8",
    productoId: "p8",
    autor: "Sofía Navarro",
    estrellas: 4,
    comentario: "Bonitas y resistentes, ideales para regalar. El envío fue rápido.",
    fecha: "2026-08-15T11:05:00.000Z",
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

export const metodosPago = ["Nequi", "Daviplata", "Tarjetas", "PSE", "Contra entrega"];

export const formatoCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);
