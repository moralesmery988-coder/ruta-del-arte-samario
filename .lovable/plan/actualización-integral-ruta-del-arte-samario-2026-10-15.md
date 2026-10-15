# Actualización integral — Ruta del Arte Samario

Hoy la app guarda todo en el navegador de cada persona. Para que funcione de verdad (cuentas reales, artesanos que solo editan lo suyo, fotos y videos en línea, chats privados), se activa Lovable Cloud y se hace en fases, sin reemplazar las pantallas existentes.

## Fase 1 — Base real (Cloud)
- Activar Lovable Cloud: cuentas reales (correo y contraseña), roles comprador / artesano.
- Tablas: perfiles de artesano, productos, fotos/videos de producto, pedidos y sus líneas, historial de estados, conversaciones, mensajes, reseñas, favoritos, publicaciones de "Mi taller", notificaciones.
- Permisos: cada artesano solo ve y edita sus productos, pedidos y publicaciones; los chats solo los ven sus dos participantes; catálogo, perfiles y productos son públicos sin iniciar sesión.
- Almacenamiento de archivos para fotos y videos.
- Los artesanos y productos de ejemplo actuales se cargan como datos iniciales.

## Fase 2 — Panel del artesano y tienda
- Panel privado: publicar, editar, eliminar (con confirmación), varias fotos y videos, precio, materiales, dimensiones, inventario, agotado/disponible.
- Tienda pública del artesano: foto, historia, catálogo, contacto autorizado (el artesano elige qué mostrar).
- Reseñas solo de compradores con pedido entregado.

## Fase 3 — Pedidos y chat
- Estados: pendiente de confirmación, confirmado, en preparación, enviado, entregado, con fecha de cada cambio.
- El comprador consulta; el artesano actualiza solo sus pedidos; notificaciones en cada cambio.
- Chat privado comprador–artesano ligado al producto, con historial y aviso de mensajes nuevos (en tiempo real). Se retira la respuesta automática simulada.

## Fase 4 — QR, "Mi taller" e "Historias que se tejen"
- QR único por artesano y por producto hacia su página pública; ver, descargar (PNG) e imprimir tarjetas/etiquetas con el logo.
- "Mi taller": muro visual de fotos/videos y procesos, enlazado al perfil; el artesano puede ocultar sus publicaciones y los usuarios pueden reportarlas.
- "Historias que se tejen": técnicas, materiales y significado cultural; descubrir por tipo de artesanía y tradición.
- Recomendaciones simples (misma categoría/artesano) en el producto.

## Verificación final
Registro, publicación, cambio de precio, QR (generar y abrir), mensajería y seguimiento de pedido, probados en el navegador con cuentas reales.

## Requiere configuración adicional (se indicará al final)
- Pagos reales (por ahora el pedido queda "pendiente de confirmación" sin cobro).
- Inicio de sesión con Google, si se desea.
- Moderación por administrador: se deja la opción de reportar; la revisión necesita definir quién administra.

## Detalles técnicos
- Lovable Cloud (Postgres + RLS + Storage + Realtime), server functions con requireSupabaseAuth, rutas protegidas bajo `_authenticated`.
- Roles en tabla `user_roles` con `has_role`.
- Rutas públicas nuevas: `/taller`, `/historias`; QR con librería `qrcode` en el cliente.
- `store.tsx` se reemplaza gradualmente por consultas con TanStack Query.
