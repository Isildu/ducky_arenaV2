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
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       ├── routes/
│       ├── models/
│       └── middleware/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── database/
│   ├── UF2175_PP_DuckiesArena.sql
│   └── UF2176_PPDuckiesArena.sql
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

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
DB_PASSWORD=TU_PASSWORD_AQUI
PORT=3000
```

El backend carga este archivo desde la raiz del monorepo.

### 3. Levantar PostgreSQL y pgAdmin

Desde la raiz del proyecto:

```bash
docker compose up -d
```

Comprobar contenedores:

```bash
docker ps
```

### 4. Importar base de datos

PowerShell:

```powershell
Get-Content .\database\UF2175_PP_DuckiesArena.sql |
docker exec -i duckies_postgres_db psql -U postgres -d duckies_arena_db
```

Si tambien necesitas ejecutar el segundo script:

```powershell
Get-Content .\database\UF2176_PPDuckiesArena.sql |
docker exec -i duckies_postgres_db psql -U postgres -d duckies_arena_db
```

### 5. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 6. Iniciar servidor backend

Desde `backend/`:

```bash
npm run dev
```

Servidor disponible en:

```text
http://localhost:3000
```

## API REST

Endpoints principales:

```text
GET    /api/characters
GET    /api/characters/:id
POST   /api/characters
PUT    /api/characters/:id
DELETE /api/characters/:id

GET    /api/abilities
GET    /api/abilities/:id
POST   /api/abilities
PUT    /api/abilities/:id
DELETE /api/abilities/:id

GET    /api/cosmetics
GET    /api/cosmetics/:id
POST   /api/cosmetics
PUT    /api/cosmetics/:id
DELETE /api/cosmetics/:id

GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

Tambien existen rutas para perfiles, amistades, misiones, mapas, partidas y jugadores de partida.

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
curl http://localhost:3000/api/characters
curl http://localhost:3000/api/profiles
```

## Notas Tecnicas

* El archivo `.env` no se sube al repositorio.
* `backend/.env` tambien esta ignorado por seguridad, aunque la configuracion esperada vive en la raiz.
* Ejecutar Docker antes de iniciar el backend.
* No hay frontend React creado todavia; solo existe la estructura base.
