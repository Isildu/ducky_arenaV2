# 🦆 Ducky Arena V2

## 🎮 Visión General

**Ducky Arena** es un videojuego multijugador competitivo inspirado en MOBAs y sistemas de gamificación educativa.

Los enfrentamientos entre jugadores se resuelven mediante conocimientos técnicos de programación y desarrollo web, transformando preguntas y retos técnicos en mecánicas de combate.

Este proyecto busca simular una arquitectura real de desarrollo de videojuegos utilizando una estructura cliente-servidor moderna.

---

# 👥 Integrantes

* Mateo
* Oriol
* Jaime

---

# 🏗️ Arquitectura del Proyecto

```text
┌────────────────────┐
│      FRONTEND      │
│       React        │
│ (Pendiente integrar)
└─────────┬──────────┘
          │ REST API
          ▼
┌────────────────────┐
│      BACKEND       │
│ Node + Express     │
│ CRUD + API REST    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│    PostgreSQL      │
│    Dockerizado     │
└────────────────────┘
```

---

# ⚙️ Tecnologías Utilizadas

| Área                 | Tecnología          |
| -------------------- | ------------------- |
| Frontend             | React *(pendiente)* |
| Backend              | Node.js             |
| Framework API        | Express.js          |
| Base de Datos        | PostgreSQL          |
| Contenedores         | Docker              |
| Gestión BD           | pgAdmin             |
| Comunicación         | REST API            |
| Control de versiones | Git + GitHub        |

---

# 🎮 Concepto del Juego

Duckies Arena mezcla:

* Competición multijugador.
* Preguntas técnicas.
* Combate basado en habilidades.
* Progresión de cuenta.
* Personalización mediante cosméticos.

Las categorías educativas incluyen:

* HTML
* CSS
* JavaScript
* Git
* APIs REST
* Bases de Datos
* Backend
* Arquitectura Web

---

# 🦆 Personajes del Juego

Cada personaje posee estadísticas y habilidades propias.

| Personaje      | Rol     |
| -------------- | ------- |
| Pato Asesino   | Hacker  |
| Pato Robusto   | Tank    |
| Pato Curandero | Healer  |
| Pato Mago      | Mage    |
| Pato Escudero  | Support |

---

# 🚀 Instalación del Proyecto

## 1. Clonar repositorio

```bash
git clone https://github.com/Isildu/ducky_arenaV2.git
cd ducky_arenaV2
```

---

## 2. Configurar variables de entorno

Crear archivo `.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=duckies_arena_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD

PORT=3000
```

---

## 3. Levantar Docker

```bash
docker compose up -d
```

Comprobar:

```bash
docker ps
```

---

## 4. Importar base de datos

PowerShell:

```powershell
Get-Content .\UF2175_PP_DuckiesArena.sql |
docker exec -i duckies_postgres_db psql -U postgres -d duckies_arena_db
```

---

## 5. Instalar dependencias

```bash
npm install
```

---

## 6. Iniciar servidor

```bash
npm run dev
```

Servidor disponible en:

```text
http://localhost:3000
```

---

# 🔌 API REST

## Characters

```text
GET    /api/characters
GET    /api/characters/:id
POST   /api/characters
PUT    /api/characters/:id
DELETE /api/characters/:id
```

---

## Abilities

```text
GET    /api/abilities
GET    /api/abilities/:id
POST   /api/abilities
PUT    /api/abilities/:id
DELETE /api/abilities/:id
```

---

## Cosmetics

```text
GET    /api/cosmetics
GET    /api/cosmetics/:id
POST   /api/cosmetics
PUT    /api/cosmetics/:id
DELETE /api/cosmetics/:id
```

---

## Users

```text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

---

# 📦 Estado del Proyecto

## Backend

✅ CRUD completo Characters
✅ CRUD completo Abilities
✅ CRUD completo Cosmetics
✅ CRUD completo Users

---

## Infraestructura

✅ PostgreSQL dockerizado
✅ pgAdmin conectado
✅ Variables de entorno configuradas
✅ API REST funcional

---

## Próximas fases

⬜ Desarrollo Frontend React
⬜ Integración React ↔ API
⬜ Interfaz visual del juego
⬜ Sistema de autenticación completo

---

# 📝 Notas Técnicas

* El archivo `.env` **NO se sube al repositorio**.
* Usar `.env.example` como plantilla.
* Ejecutar Docker antes del backend.
* La columna `img_url` actualmente tiene longitud limitada y podrá ampliarse en futuras versiones.

---

# 🎯 Objetivo Académico

Este proyecto busca aplicar conceptos reales de:

* Desarrollo Full Stack
* Arquitectura Cliente–Servidor
* Diseño de APIs REST
* Gestión de bases de datos
* Dockerización
* Desarrollo colaborativo mediante Git

en un entorno práctico y orientado al desarrollo de videojuegos.
