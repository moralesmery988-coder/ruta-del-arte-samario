
create type public.app_role as enum ('comprador','artesano','admin');
create type public.estado_pedido as enum ('pendiente','confirmado','preparacion','enviado','entregado','cancelado');

-- PERFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  tipo text not null default 'comprador' check (tipo in ('comprador','artesano')),
  ubicacion text,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "perfiles visibles a usuarios" on public.profiles for select to authenticated using (true);
create policy "editar mi perfil" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "ver mis roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- ARTESANOS (tiendas)
create table public.artesanos (
  id text primary key,
  user_id uuid unique,
  nombre text not null,
  taller text not null default '',
  ubicacion text not null default 'Santa Marta',
  descripcion text not null default '',
  historia text not null default '',
  proceso text not null default '',
  tecnica text not null default '',
  tradicion text not null default '',
  foto text not null default '',
  contacto_publico text not null default '',
  verificado boolean not null default false,
  coord_x real not null default 50,
  coord_y real not null default 50,
  created_at timestamptz not null default now()
);
grant select on public.artesanos to anon, authenticated;
grant update on public.artesanos to authenticated;
grant all on public.artesanos to service_role;
alter table public.artesanos enable row level security;
create policy "artesanos publicos" on public.artesanos for select to anon, authenticated using (true);
create policy "editar mi tienda" on public.artesanos for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.es_duenio_artesano(_artesano_id text)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.artesanos where id = _artesano_id and user_id = auth.uid()) $$;

-- PRODUCTOS
create table public.productos (
  id text primary key default replace(gen_random_uuid()::text,'-',''),
  artesano_id text not null references public.artesanos(id) on delete cascade,
  nombre text not null check (length(nombre) between 1 and 120),
  precio integer not null check (precio >= 0),
  categoria text not null default 'Otros',
  descripcion text not null default '',
  materiales text not null default '',
  dimensiones text not null default '',
  tiempo_entrega text not null default '',
  imagenes text[] not null default '{}',
  videos text[] not null default '{}',
  disponible integer not null default 0 check (disponible >= 0),
  agotado boolean not null default false,
  destacado boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.productos(artesano_id);
grant select on public.productos to anon, authenticated;
grant insert, update, delete on public.productos to authenticated;
grant all on public.productos to service_role;
alter table public.productos enable row level security;
create policy "productos publicos" on public.productos for select to anon, authenticated using (true);
create policy "crear mis productos" on public.productos for insert to authenticated with check (public.es_duenio_artesano(artesano_id));
create policy "editar mis productos" on public.productos for update to authenticated using (public.es_duenio_artesano(artesano_id)) with check (public.es_duenio_artesano(artesano_id));
create policy "borrar mis productos" on public.productos for delete to authenticated using (public.es_duenio_artesano(artesano_id));

-- NOTIFICACIONES
create table public.notificaciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  titulo text not null,
  detalle text not null default '',
  enlace text,
  leida boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.notificaciones(user_id, created_at desc);
grant select, update on public.notificaciones to authenticated;
grant all on public.notificaciones to service_role;
alter table public.notificaciones enable row level security;
create policy "ver mis notificaciones" on public.notificaciones for select to authenticated using (user_id = auth.uid());
create policy "marcar mis notificaciones" on public.notificaciones for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- PEDIDOS
create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique default ('RAS-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6))),
  comprador_id uuid not null,
  comprador_nombre text not null default '',
  artesano_id text not null references public.artesanos(id),
  estado public.estado_pedido not null default 'pendiente',
  total integer not null default 0,
  direccion text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  producto_id text,
  nombre text not null,
  precio integer not null,
  cantidad integer not null check (cantidad > 0),
  imagen text not null default ''
);
create table public.pedido_historial (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  estado public.estado_pedido not null,
  created_at timestamptz not null default now()
);
grant select on public.pedidos, public.pedido_items, public.pedido_historial to authenticated;
grant all on public.pedidos, public.pedido_items, public.pedido_historial to service_role;
alter table public.pedidos enable row level security;
alter table public.pedido_items enable row level security;
alter table public.pedido_historial enable row level security;

create or replace function public.puede_ver_pedido(_pedido_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.pedidos p where p.id = _pedido_id
  and (p.comprador_id = auth.uid() or public.es_duenio_artesano(p.artesano_id))) $$;

create policy "ver mis pedidos" on public.pedidos for select to authenticated using (comprador_id = auth.uid() or public.es_duenio_artesano(artesano_id));
create policy "ver items" on public.pedido_items for select to authenticated using (public.puede_ver_pedido(pedido_id));
create policy "ver historial" on public.pedido_historial for select to authenticated using (public.puede_ver_pedido(pedido_id));

-- Crear pedido: precios desde la base, un pedido por artesano, descuenta inventario
create or replace function public.crear_pedido(_items jsonb, _direccion text default '')
returns setof text language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  nombre_c text;
  it record;
  prod record;
  ped record;
  art record;
begin
  if uid is null then raise exception 'Debes iniciar sesión'; end if;
  if jsonb_array_length(_items) = 0 then raise exception 'El carrito está vacío'; end if;
  select nombre into nombre_c from profiles where id = uid;
  create temp table _lineas (producto_id text, artesano_id text, nombre text, precio int, cantidad int, imagen text) on commit drop;
  for it in select (e->>'producto_id') as pid, (e->>'cantidad')::int as cant from jsonb_array_elements(_items) e loop
    if it.cant is null or it.cant <= 0 then raise exception 'Cantidad inválida'; end if;
    select * into prod from productos where id = it.pid for update;
    if not found then raise exception 'Producto no encontrado'; end if;
    if prod.agotado or prod.disponible < it.cant then raise exception 'No hay unidades suficientes de "%"', prod.nombre; end if;
    update productos set disponible = disponible - it.cant, agotado = (disponible - it.cant) = 0 where id = prod.id;
    insert into _lineas values (prod.id, prod.artesano_id, prod.nombre, prod.precio, it.cant, coalesce(prod.imagenes[1], ''));
  end loop;
  for art in select artesano_id, sum(precio * cantidad)::int as total from _lineas group by artesano_id loop
    insert into pedidos (comprador_id, comprador_nombre, artesano_id, total, direccion)
      values (uid, coalesce(nombre_c, ''), art.artesano_id, art.total, coalesce(_direccion, ''))
      returning * into ped;
    insert into pedido_items (pedido_id, producto_id, nombre, precio, cantidad, imagen)
      select ped.id, producto_id, nombre, precio, cantidad, imagen from _lineas where artesano_id = art.artesano_id;
    insert into pedido_historial (pedido_id, estado) values (ped.id, 'pendiente');
    insert into notificaciones (user_id, titulo, detalle, enlace)
      values (uid, 'Pedido registrado', 'Tu pedido ' || ped.codigo || ' quedó pendiente de confirmación.', '/pedidos');
    insert into notificaciones (user_id, titulo, detalle, enlace)
      select a.user_id, 'Nuevo pedido', 'Recibiste el pedido ' || ped.codigo || ' de ' || coalesce(nombre_c, 'un comprador') || '.', '/panel'
      from artesanos a where a.id = art.artesano_id and a.user_id is not null;
    return next ped.codigo;
  end loop;
end $$;
revoke all on function public.crear_pedido(jsonb, text) from public, anon;
grant execute on function public.crear_pedido(jsonb, text) to authenticated;

-- Actualizar estado: solo el artesano dueño, en orden
create or replace function public.actualizar_estado_pedido(_pedido_id uuid, _estado public.estado_pedido)
returns void language plpgsql security definer set search_path = public
as $$
declare ped record;
  etiqueta text;
begin
  select * into ped from pedidos where id = _pedido_id for update;
  if not found or not public.es_duenio_artesano(ped.artesano_id) then raise exception 'No autorizado'; end if;
  if ped.estado in ('entregado','cancelado') then raise exception 'El pedido ya está cerrado'; end if;
  if _estado <> 'cancelado' and array_position(enum_range(null::estado_pedido), _estado) <= array_position(enum_range(null::estado_pedido), ped.estado) then
    raise exception 'Estado no válido';
  end if;
  update pedidos set estado = _estado, updated_at = now() where id = _pedido_id;
  insert into pedido_historial (pedido_id, estado) values (_pedido_id, _estado);
  etiqueta := case _estado when 'confirmado' then 'Confirmado' when 'preparacion' then 'En preparación'
    when 'enviado' then 'Enviado' when 'entregado' then 'Entregado' when 'cancelado' then 'Cancelado' else 'Pendiente' end;
  insert into notificaciones (user_id, titulo, detalle, enlace)
    values (ped.comprador_id, 'Actualización de pedido', ped.codigo || ' ahora está: ' || etiqueta || '.', '/pedidos');
end $$;
revoke all on function public.actualizar_estado_pedido(uuid, public.estado_pedido) from public, anon;
grant execute on function public.actualizar_estado_pedido(uuid, public.estado_pedido) to authenticated;

-- CONVERSACIONES Y MENSAJES
create table public.conversaciones (
  id uuid primary key default gen_random_uuid(),
  comprador_id uuid not null,
  artesano_id text not null references public.artesanos(id) on delete cascade,
  producto_id text,
  producto_nombre text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (comprador_id, artesano_id, producto_id)
);
create table public.mensajes (
  id uuid primary key default gen_random_uuid(),
  conversacion_id uuid not null references public.conversaciones(id) on delete cascade,
  autor_id uuid not null default auth.uid(),
  texto text not null check (length(texto) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index on public.mensajes(conversacion_id, created_at);
grant select, insert on public.conversaciones, public.mensajes to authenticated;
grant all on public.conversaciones, public.mensajes to service_role;
alter table public.conversaciones enable row level security;
alter table public.mensajes enable row level security;

create or replace function public.es_participante(_conv uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.conversaciones c where c.id = _conv
  and (c.comprador_id = auth.uid() or public.es_duenio_artesano(c.artesano_id))) $$;

create policy "ver mis conversaciones" on public.conversaciones for select to authenticated using (comprador_id = auth.uid() or public.es_duenio_artesano(artesano_id));
create policy "iniciar conversacion" on public.conversaciones for insert to authenticated with check (comprador_id = auth.uid() and not public.es_duenio_artesano(artesano_id));
create policy "ver mensajes" on public.mensajes for select to authenticated using (public.es_participante(conversacion_id));
create policy "enviar mensajes" on public.mensajes for insert to authenticated with check (autor_id = auth.uid() and public.es_participante(conversacion_id));

create or replace function public.tras_mensaje()
returns trigger language plpgsql security definer set search_path = public
as $$
declare c record; destino uuid; remitente text;
begin
  select * into c from conversaciones where id = new.conversacion_id;
  update conversaciones set updated_at = now() where id = c.id;
  select nombre into remitente from profiles where id = new.autor_id;
  if new.autor_id = c.comprador_id then
    select user_id into destino from artesanos where id = c.artesano_id;
  else
    destino := c.comprador_id;
  end if;
  if destino is not null then
    insert into notificaciones (user_id, titulo, detalle, enlace)
    values (destino, 'Nuevo mensaje', coalesce(remitente, 'Alguien') || ': ' || left(new.texto, 80), '/mensajes');
  end if;
  return new;
end $$;
create trigger mensajes_after_insert after insert on public.mensajes for each row execute function public.tras_mensaje();

-- RESEÑAS (solo con compra entregada)
create table public.resenas (
  id uuid primary key default gen_random_uuid(),
  producto_id text not null references public.productos(id) on delete cascade,
  autor_id uuid,
  autor_nombre text not null default '',
  estrellas integer not null check (estrellas between 1 and 5),
  comentario text not null default '' check (length(comentario) <= 1000),
  verificada boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.resenas to anon, authenticated;
grant insert on public.resenas to authenticated;
grant all on public.resenas to service_role;
alter table public.resenas enable row level security;

create or replace function public.puede_resenar(_producto_id text)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.pedidos p join public.pedido_items i on i.pedido_id = p.id
  where p.comprador_id = auth.uid() and p.estado = 'entregado' and i.producto_id = _producto_id) $$;

create policy "resenas publicas" on public.resenas for select to anon, authenticated using (true);
create policy "resenar con compra entregada" on public.resenas for insert to authenticated
  with check (autor_id = auth.uid() and verificada = true and public.puede_resenar(producto_id));

-- FAVORITOS
create table public.favoritos (
  user_id uuid not null default auth.uid(),
  producto_id text not null references public.productos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, producto_id)
);
grant select, insert, delete on public.favoritos to authenticated;
grant all on public.favoritos to service_role;
alter table public.favoritos enable row level security;
create policy "mis favoritos" on public.favoritos for select to authenticated using (user_id = auth.uid());
create policy "agregar favorito" on public.favoritos for insert to authenticated with check (user_id = auth.uid());
create policy "quitar favorito" on public.favoritos for delete to authenticated using (user_id = auth.uid());

-- MI TALLER
create table public.publicaciones (
  id uuid primary key default gen_random_uuid(),
  artesano_id text not null references public.artesanos(id) on delete cascade,
  tipo text not null default 'foto' check (tipo in ('foto','video')),
  media_url text not null,
  texto text not null default '' check (length(texto) <= 1000),
  oculta boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.publicaciones to anon, authenticated;
grant insert, update, delete on public.publicaciones to authenticated;
grant all on public.publicaciones to service_role;
alter table public.publicaciones enable row level security;
create policy "publicaciones visibles" on public.publicaciones for select to anon, authenticated using (oculta = false or public.es_duenio_artesano(artesano_id));
create policy "publicar en mi taller" on public.publicaciones for insert to authenticated with check (public.es_duenio_artesano(artesano_id));
create policy "editar mis publicaciones" on public.publicaciones for update to authenticated using (public.es_duenio_artesano(artesano_id)) with check (public.es_duenio_artesano(artesano_id));
create policy "borrar mis publicaciones" on public.publicaciones for delete to authenticated using (public.es_duenio_artesano(artesano_id));

create table public.reportes (
  id uuid primary key default gen_random_uuid(),
  publicacion_id uuid not null references public.publicaciones(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  motivo text not null default '' check (length(motivo) <= 500),
  created_at timestamptz not null default now(),
  unique (publicacion_id, user_id)
);
grant select, insert on public.reportes to authenticated;
grant all on public.reportes to service_role;
alter table public.reportes enable row level security;
create policy "reportar" on public.reportes for insert to authenticated with check (user_id = auth.uid());
create policy "admins ven reportes" on public.reportes for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- REGISTRO: perfil, rol y tienda
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  t text := coalesce(new.raw_user_meta_data->>'tipo', 'comprador');
  n text := coalesce(nullif(new.raw_user_meta_data->>'nombre', ''), split_part(new.email, '@', 1));
  u text := nullif(new.raw_user_meta_data->>'ubicacion', '');
begin
  if t not in ('comprador','artesano') then t := 'comprador'; end if;
  insert into profiles (id, nombre, tipo, ubicacion) values (new.id, n, t, u);
  insert into user_roles (user_id, role) values (new.id, t::app_role);
  if t = 'artesano' then
    insert into artesanos (id, user_id, nombre, taller, ubicacion)
    values (new.id::text, new.id, n, n, coalesce(u, 'Santa Marta'));
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- TIEMPO REAL
alter publication supabase_realtime add table public.mensajes, public.notificaciones, public.pedidos;

-- ARCHIVOS: cada usuario solo escribe en su carpeta
create policy "media lectura publica" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "media subir propia" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media editar propia" on storage.objects for update to authenticated using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media borrar propia" on storage.objects for delete to authenticated using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
