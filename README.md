# Ducky Arena V2

## Vision General

Ducky Arena es un videojuego multijugador competitivo inspirado en MOBAs y sistemas de gamificacion educativa.

El proyecto usa una arquitectura cliente-servidor con backend Node.js + Express, base de datos PostgreSQL y una estructura preparada para frontend.

## Integrantes

* Mateo
* Oriol
* Jaime

## Estructura Del Proyecto

```text
ducky_arenaV2/
|-- backend/
|   |-- package.json
|   |-- package-lock.json
|   `-- src/
|       |-- app.js
|       |-- config/
|       |   `-- db.js
|       |-- controllers/
|       |-- routes/
|       |-- models/
|       `-- middleware/
|-- frontend/
|   `-- src/
|       |-- components/
|       |-- pages/
|       `-- services/
|-- database/
|   |-- UF2175_PP_DuckiesArena.sql
|   `-- UF2176_PP_DuckiesArena.sql
|-- docker-compose.yml
|-- .env.example
|-- .gitignore
`-- README.md
```

## Arquitectura Backend

El backend sigue una estructura MVC ligera:

```text
routes -> controllers -> models -> PostgreSQL
```

* `routes/` define endpoints publicos del backend.
* `controllers/` gestiona peticiones HTTP, validacion basica y respuestas.
* `models/` centraliza consultas SQL.
* `config/db.js` inicializa la conexion PostgreSQL.

## Middleware Actual

El backend tiene middleware basico para validaciones y errores comunes:

* `validate_id.middleware.js`: valida que los parametros `:id` sean numeros enteros positivos.
* `not_found.middleware.js`: responde rutas inexistentes con `404`.
* `error_handler.middleware.js`: queda preparado para centralizar errores enviados con `next(error)`.

Actualmente no hay middleware de autenticacion.

## Integridad Minima DB-1

La base de datos incluye constraints minimas para evitar datos duplicados o inconsistentes en relaciones importantes:

* `unique_match_player`: evita repetir el mismo perfil dentro de la misma partida.
* `unique_player_cosmetic`: evita repetir el mismo cosmetico para el mismo perfil.
* `unique_player_quest`: evita repetir la misma mision para el mismo perfil.
* `check_not_self_friend`: evita que un perfil sea amigo de si mismo.

## Estado Actual

* MVC completado en los modulos actuales.
* DB-1 integridad minima aplicada en tablas puente.
* API-1 endpoints agregados de lectura aplicada.
* Middleware basico completado.
* React pendiente.
* Auth real pendiente.

## Tecnologias

| Area | Tecnologia |
| --- | --- |
| Frontend | React pendiente |
| Backend | Node.js |
| Framework API | Express.js |
| Base de datos | PostgreSQL |
| Contenedores | Docker |
| Gestion BD | pgAdmin |
| Comunicacion | REST API |

## Instalacion

### 1. Clonar repositorio

```bash
git clone https://github.com/Isildu/ducky_arenaV2.git
cd ducky_arenaV2
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en la raiz del proyecto usando `.env.example` como plantilla:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=duckies_arena_db
DB_USER=postgres
DB_PASSWORD=CHANGE_ME
PORT=3000

PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=CHANGE_ME
```

El backend carga este archivo desde la raiz del monorepo.
Usa las credenciales definidas en tu archivo `.env` local y mantenlas fuera de Git.
Docker Compose lee automaticamente estas variables desde el archivo `.env` local.
Rellena al menos `DB_PASSWORD` y `PGADMIN_DEFAULT_PASSWORD` antes de levantar los servicios.

### 3. Levantar PostgreSQL, pgAdmin y backend

Desde la raiz del proyecto:

```bash
docker compose up -d
```

Comprobar contenedores:

```bash
docker compose ps
```

pgAdmin queda disponible en:

```text
http://localhost:8080
```

Credenciales de pgAdmin:

```text
Usa las credenciales definidas en tu archivo .env local.
```

El servidor PostgreSQL aparece registrado automaticamente en pgAdmin como `Duckies Arena PostgreSQL`.
La configuracion de pgAdmin se conserva entre reinicios mediante un volumen Docker.

El backend Express tambien se levanta con Docker y queda disponible en:

```text
http://localhost:3000
```

Dentro de Docker, el backend usa `DB_HOST=db` para conectarse al servicio PostgreSQL.

### 4. Inicializacion automatica de base de datos

PostgreSQL monta `database/init.sql` en `/docker-entrypoint-initdb.d/01-init.sql`.
Este script se ejecuta automaticamente solo cuando el volumen `postgres_data` esta vacio.
Si el volumen ya existe, Docker no vuelve a ejecutar `init.sql`.

Para probar la inicializacion desde cero:

```bash
docker compose down -v
docker compose up -d
```

Atencion: `docker compose down -v` borra los datos de PostgreSQL y la configuracion persistida de pgAdmin.

La importacion manual ya no es necesaria en un arranque limpio. Si necesitas reimportar manualmente por algun motivo, puedes usar:

PowerShell:

```powershell
Get-Content .\database\UF2175_PP_DuckiesArena.sql |
docker exec -i duckies_postgres_db psql -U postgres -d duckies_arena_db
```

Consultas de apoyo:

```powershell
Get-Content .\database\UF2176_PP_DuckiesArena.sql |
docker exec -i duckies_postgres_db psql -U postgres -d duckies_arena_db
```

### 5. Instalar dependencias del backend sin Docker

```bash
cd backend
npm install
```

### 6. Iniciar servidor backend sin Docker

Desde `backend/`:

```powershell
npm.cmd run dev
```

Servidor disponible en:

```text
http://localhost:3000
```

El frontend aun no esta dockerizado porque la aplicacion React todavia no esta creada; actualmente solo existe la estructura base.

## API REST

### Characters

```text
GET    /api/characters
GET    /api/characters/all
GET    /api/characters/role?type=Hacker
GET    /api/characters/:id
GET    /api/characters/:id/abilities
POST   /api/characters
PUT    /api/characters/:id
DELETE /api/characters/:id
```

### Abilities

```text
GET    /api/abilities
GET    /api/abilities/:id
POST   /api/abilities
PUT    /api/abilities/:id
DELETE /api/abilities/:id
```

### Cosmetics

```text
GET    /api/cosmetics
GET    /api/cosmetics/:id
POST   /api/cosmetics
PUT    /api/cosmetics/:id
DELETE /api/cosmetics/:id
```

### Users

```text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Profiles

```text
GET    /api/profiles
GET    /api/profiles/all
GET    /api/profiles/:id
GET    /api/profiles/:id/dashboard
GET    /api/profiles/:id/stats
GET    /api/profiles/:id/inventory
POST   /api/profiles
PUT    /api/profiles/:id
DELETE /api/profiles/:id
```

### Player Friends

```text
GET    /api/player-friends
GET    /api/player-friends/all
GET    /api/player-friends/:id
GET    /api/player-friends/profile/:profile_id
POST   /api/player-friends
PUT    /api/player-friends/:id
DELETE /api/player-friends/:id
```

### Player Cosmetics

```text
GET    /api/player-cosmetics
GET    /api/player-cosmetics/all
GET    /api/player-cosmetics/:id
GET    /api/player-cosmetics/profile/:profile_id
POST   /api/player-cosmetics
PUT    /api/player-cosmetics/:id
DELETE /api/player-cosmetics/:id
```

### Player Quests

```text
GET    /api/player-quests
GET    /api/player-quests/all
GET    /api/player-quests/:id
GET    /api/player-quests/profile/:profile_id
POST   /api/player-quests
PUT    /api/player-quests/:id
DELETE /api/player-quests/:id
```

### Daily Quest

```text
GET    /api/daily-quest
GET    /api/daily-quest/all
GET    /api/daily-quest/:id
GET    /api/daily-quest/reward?reward_coins=50
GET    /api/daily-quest/description
POST   /api/daily-quest
PUT    /api/daily-quest/:id
PATCH  /api/daily-quest/:id
DELETE /api/daily-quest/:id
```

### Game Maps

```text
GET    /api/game-maps
GET    /api/game-maps/:id
GET    /api/game-maps/environment?environment_type=Tropical
GET    /api/game-maps/names
POST   /api/game-maps
PUT    /api/game-maps/:id
PATCH  /api/game-maps/:id
DELETE /api/game-maps/:id
```

### Matches

```text
GET    /api/matches
GET    /api/matches/:id
GET    /api/matches/basic
GET    /api/matches/by-game-mode?game_mode=Duelo
GET    /api/matches/by-map?map_id=1
POST   /api/matches
PUT    /api/matches/:id
PATCH  /api/matches/:id
DELETE /api/matches/:id
```

### Match Players

```text
GET    /api/match-players
GET    /api/match-players/:id
GET    /api/match-players/by-match?match_id=1
GET    /api/match-players/by-team?match_id=1&team=BLUE
GET    /api/match-players/winners?match_id=1
GET    /api/match-players/player-stats?profile_id=1
POST   /api/match-players
PUT    /api/match-players/:id
PATCH  /api/match-players/:id
DELETE /api/match-players/:id
```

### Ranking

```text
GET    /api/ranking
```

`/api/ranking` es un endpoint calculado. No existe una tabla `ranking`; el resultado se obtiene desde `player_profile` y `auth_user`, ordenando los perfiles por nivel y experiencia.

## Endpoints Agregados Para React

```text
GET /api/profiles/:id/dashboard
GET /api/profiles/:id/stats
GET /api/profiles/:id/inventory
GET /api/ranking
GET /api/characters/:id/abilities
```

## Comandos Utiles

Verificar sintaxis del backend:

```bash
cd backend
node --check src/app.js
node --check src/config/db.js
```

Probar API:

```bash
curl http://localhost:3000/
curl http://localhost:3000/api/characters/all
curl http://localhost:3000/api/profiles/1/dashboard
curl http://localhost:3000/api/profiles/1/stats
curl http://localhost:3000/api/profiles/1/inventory
curl http://localhost:3000/api/ranking
curl http://localhost:3000/api/characters/1/abilities
```

## Notas Tecnicas

* El archivo `.env` no se sube al repositorio.
* `backend/.env` tambien esta ignorado por seguridad, aunque la configuracion esperada vive en la raiz.
* Ejecutar Docker antes de iniciar el backend.
* No hay frontend React creado todavia; solo existe la estructura base.
* Las consultas SQL del backend viven en `backend/src/models`.
* No hay autenticacion real implementada todavia.

## Deuda Tecnica Pendiente

Estos puntos siguen pendientes y no deben asumirse como implementados:

* Auth real y uso de `password_hash`.
* Tienda con compras y transacciones.
* Progreso avanzado de misiones.
* Estado y resultados avanzados de partidas.
* Preguntas y respuestas educativas.
* Combate educativo.
