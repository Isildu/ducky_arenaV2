# 🦆 Duckies Arena

## 🎮 Visión General del Proyecto

**Duckies Arena** es un videojuego multijugador competitivo 3 vs 3 desarrollado bajo una arquitectura cliente-servidor moderna, diseñado como un proyecto formativo y profesional orientado a simular el pipeline real de un estudio indie de videojuegos.

El proyecto combina mecánicas inspiradas en MOBAs y RPGs tácticos con un enfoque de **Gamificación Educativa (EdTech)**, donde el combate entre jugadores se resuelve mediante conocimientos técnicos de programación y desarrollo web.

La propuesta busca demostrar competencias avanzadas en:

- Desarrollo Full-Stack aplicado a videojuegos.
- Arquitectura multijugador síncrona.
- Diseño de sistemas de progresión y matchmaking.
- Integración entre motor gráfico y backend REST.
- Diseño de gameplay basado en conocimiento técnico.
- Sistemas de combate matemático y lógica de estados.

La estética del juego adopta un enfoque **cartoon/humorístico**, protagonizado por patitos de goma con clases y habilidades absurdamente competitivas.

---

# 🏗️ Arquitectura y Stack Tecnológico

## 🔧 Arquitectura General

Duckies Arena implementa una arquitectura distribuida desacoplada:

```text
┌────────────────────┐
│      CLIENTE       │
│   Godot Engine     │
│ Gameplay/UI/FX     │
└─────────┬──────────┘
          │ REST API
          ▼
┌────────────────────┐
│      BACKEND       │
│ Django + DRF       │
│ Auth/Stats/MMR     │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│    PostgreSQL      │
│ Persistencia Data  │
└────────────────────┘
```

---

## ⚙️ Tecnologías Utilizadas

| Área | Tecnología | Propósito |
|---|---|---|
| Motor de Juego | Godot Engine | Gameplay, físicas, UI y render |
| Backend API | Django | Arquitectura del servidor |
| API REST | Django REST Framework | Comunicación cliente-servidor |
| Base de Datos | PostgreSQL | Persistencia de usuarios y progresión |
| Autenticación | JWT/Auth System | Login y sesiones |
| Matchmaking | Sistema custom MMR | Emparejamiento competitivo |
| Networking | HTTP + sincronización lógica | Gestión de estado de partidas |
| Arquitectura | Cliente-Servidor | Separación lógica y escalabilidad |

---

# ⚔️ Mecánicas Principales de Gameplay

## 🗺️ Sistema de Mapa y Estructura de Partida

El gameplay está diseñado bajo una estructura inspirada en MOBAs simplificados como *League of Legends*, adaptada a partidas rápidas y tácticas.

### Características del mapa

- Dos bases enfrentadas.
- Sistema de **3 carriles (Lanes)**.
- Distribución simétrica competitiva.
- Fases tácticas previas al combate.
- Sistema de descubrimiento enemigo.

---

## 🎯 Fases de la Partida

### 1. Fase de Selección

Antes del inicio de la partida:

- Cada jugador selecciona secretamente un carril.
- El sistema registra la elección sin mostrarla al resto.
- La composición táctica del equipo depende de esta decisión.

Esto introduce:

- Estrategia previa al combate.
- Lectura psicológica del rival.
- Distribución táctica del equipo.

---

### 2. Fase de Despliegue

Cuando comienza la partida:

- Se elimina la “niebla de guerra”.
- Los jugadores descubren:
  - su rival directo,
  - la línea asignada,
  - la composición rival.

Esto genera un momento de transición táctica y adaptación inmediata.

---

# 🧠 Sistema de Combate Trivia (EdTech Combat System)

El núcleo innovador de Duckies Arena es su sistema de combate educativo.

## 💡 Mecánica Principal

En lugar de ataques tradicionales:

- Los jugadores deben responder correctamente preguntas técnicas.
- Las respuestas activan:
  - ataques,
  - defensas,
  - buffs,
  - debuffs,
  - habilidades especiales.

---

## 📚 Categorías Técnicas

Las preguntas incluyen contenidos relacionados con:

- HTML
- CSS
- JavaScript
- Git
- APIs REST
- Bases de Datos
- Algoritmia
- Backend Development
- Arquitectura Web

---

## ⚡ Resultado del Combate

```text
Daño Final =
(Poder Base × Multiplicador de Clase × Precisión)
- Mitigación del Rival
+ Buffs/Debuffs Activos
```

La precisión técnica del jugador impacta directamente el rendimiento competitivo.

---

# 🦆 Sistema de Clases y Personajes

Cada personaje posee estadísticas base únicas y un rol táctico definido.

## 📊 Tabla de Clases

| Personaje | Rol | Vida | Daño | Aguante | Soporte | Especialidad |
|---|---|---|---|---|---|---|
| HackQuack | Hacker/Debuffer | Media | Alta | Baja | Media | Alteración lógica y debuffs |
| Duck Vader | Tanque/Control | Muy Alta | Media | Muy Alta | Baja | Mitigación de daño |
| Magicuack | Mago Burst | Baja | Muy Alta | Baja | Media | Multiplicadores ofensivos |
| Chef Duck | Híbrido Heal/DPS | Media | Media | Media | Alta | Curación y ataques absurdos |
| Barduck | Support Buffer | Media | Baja | Media | Muy Alta | Buffs de equipo |

---

## 🧩 Diseño de Roles

### 🖥️ HackQuack
Especialista en manipular estados del enemigo:

- reducción de daño,
- corrupción de buffs,
- alteración de estadísticas temporales.

---

### 🛡️ Duck Vader
Tanque principal del juego:

- alta resistencia,
- mitigación pasiva,
- control defensivo.

Ideal para proteger aliados y absorber daño.

---

### 🔮 Magicuack
Clase orientada al daño explosivo:

- grandes multiplicadores,
- alto riesgo/recompensa,
- dependencia de precisión técnica.

---

### 🍳 Chef Duck
Personaje híbrido:

- soporte ofensivo,
- curaciones absurdas,
- ataques culinarios humorísticos.

---

### 🎵 Barduck
Especialista en utilidad:

- buffs globales,
- mejora de estadísticas,
- soporte táctico.

---

# 📈 Sistema de Progresión y Cuenta

Duckies Arena implementa un sistema de progresión persistente de cuenta.

## 🎚️ Nivel Máximo

```text
Nivel Máximo de Cuenta: 30
```

---

## 🔓 Sistema de Desbloqueos

A medida que el jugador sube de nivel:

- desbloquea nuevas categorías técnicas,
- aumenta la complejidad de preguntas,
- obtiene cosméticos exclusivos,
- expande opciones estratégicas.

---

## 🧠 Progresión Educativa Integrada

El sistema de progresión está diseñado para incentivar el aprendizaje técnico progresivo.

### Ejemplo Conceptual

| Nivel | Tecnología Desbloqueada | Recompensa |
|---|---|---|
| Nivel 1 | HTML | Skin básica |
| Nivel 2 | CSS | Cosmético intermedio |
| Nivel 3 | JavaScript | Efectos visuales especiales |
| Nivel 5+ | APIs REST | Animaciones avanzadas |
| Nivel 10+ | Backend/DB | Cosméticos raros |
| Nivel 20+ | Arquitectura Software | Contenido competitivo avanzado |

---

## 🎨 Cosméticos y Personalización

Los desbloqueos incluyen:

- skins exclusivas,
- animaciones,
- efectos visuales,
- títulos de jugador,
- banners competitivos,
- efectos de habilidades.

---

# 🚀 Objetivos Técnicos del Proyecto

Duckies Arena fue diseñado como un entorno de práctica profesional enfocado en:

- Arquitectura multijugador.
- Diseño de videojuegos competitivos.
- Backend escalable para videojuegos.
- Sistemas de progresión persistente.
- APIs REST aplicadas a gaming.
- Integración Full-Stack Game Development.
- Gamificación educativa.
- Diseño de sistemas de combate complejos.
- Gestión de estados sincronizados en tiempo real.

---

# 🎯 Filosofía del Proyecto

Duckies Arena busca demostrar cómo el aprendizaje técnico puede integrarse en experiencias multijugador competitivas sin perder diversión, identidad visual ni profundidad estratégica.

El proyecto mezcla:

- Educación técnica,
- Diseño de videojuegos,
- Arquitectura backend,
- UX competitiva,
- y sistemas RPG tácticos

en una experiencia humorística centrada en patitos de goma armados con conocimiento de programación.