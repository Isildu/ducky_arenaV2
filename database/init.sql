-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: esquema completo
-- RESPONSABILIDAD: crear dominios, tablas, relaciones y datos base
-- ====================================================

CREATE SCHEMA ducky_arena;

SET SEARCH_PATH TO ducky_arena;

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: dominios
-- RESPONSABILIDAD: definir tipos reutilizables y restricciones comunes
-- ====================================================
CREATE DOMAIN positive_int AS INT
    CHECK (VALUE >= 0);

CREATE DOMAIN player_level AS INT
    CHECK (VALUE >= 1);

CREATE DOMAIN email_text AS VARCHAR(200)
    CHECK (VALUE LIKE '%@%');

CREATE DOMAIN character_role AS VARCHAR(50)
    CHECK (VALUE IN ('Hacker', 'Tank', 'Support', 'Mage','Healer'));

CREATE DOMAIN friend_status AS VARCHAR(20)
    CHECK (VALUE IN ('PENDING', 'ACCEPTED', 'BLOCKED'));

CREATE DOMAIN team_type AS VARCHAR(20)
    CHECK (VALUE IN ('BLUE', 'RED'));

CREATE DOMAIN input_key_type AS VARCHAR(10)
    CHECK (VALUE IN ('Q', 'W', 'E', 'R'));

CREATE DOMAIN cosmetic_type AS VARCHAR(20)
    CHECK (VALUE IN ('skin', 'hat', 'weapon', 'emote'));

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: auth_user
-- RESPONSABILIDAD: almacenar usuarios base de la aplicacion
-- ====================================================
CREATE TABLE IF NOT EXISTS auth_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email email_text UNIQUE NOT NULL,
    password VARCHAR(30) NOT NULL,
    date_joined DATE DEFAULT CURRENT_DATE
);


-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: player_profile
-- RESPONSABILIDAD: almacenar progreso y monedas del jugador
-- ====================================================
CREATE TABLE IF NOT EXISTS player_profile (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    level player_level DEFAULT 1,
    experience positive_int DEFAULT 0,
    bread_coins positive_int DEFAULT 0
);


-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: game_maps
-- RESPONSABILIDAD: definir mapas disponibles para partidas
-- ====================================================
CREATE TABLE IF NOT EXISTS game_maps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    environment_type VARCHAR(50) NOT NULL
);

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: characters
-- RESPONSABILIDAD: definir personajes jugables y estadisticas base
-- ====================================================
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    role character_role NOT NULL,
    base_health positive_int NOT NULL,
	attack_damage positive_int NOT NULL,
	endurance positive_int NOT NULL
);


-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: abilities
-- RESPONSABILIDAD: definir habilidades asociadas a personajes
-- ====================================================
CREATE TABLE IF NOT EXISTS abilities (
    id SERIAL PRIMARY KEY,
    character_id INT NOT NULL,
    input_key input_key_type NOT NULL,
    name VARCHAR(100) NOT NULL,
    cooldown DECIMAL(5,2) NOT NULL CHECK (cooldown >= 0),
    CONSTRAINT fk_abilities_characters
        FOREIGN KEY (character_id)
        REFERENCES characters(id)
        ON DELETE CASCADE
);

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: matches
-- RESPONSABILIDAD: registrar partidas disputadas
-- ====================================================
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    map_id INT NOT NULL,
    game_mode VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_seconds positive_int,
    CONSTRAINT fk_matches_game_maps
        FOREIGN KEY (map_id)
        REFERENCES game_maps(id)
        ON DELETE RESTRICT
);

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: match_players
-- RESPONSABILIDAD: relacionar jugadores, personajes y estadisticas por partida
-- ====================================================
CREATE TABLE IF NOT EXISTS match_players (
    id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    profile_id INT NOT NULL,
    character_id INT NOT NULL,
    team team_type NOT NULL,
    is_winner BOOLEAN NOT NULL DEFAULT FALSE,
    kills positive_int NOT NULL DEFAULT 0,
    deaths positive_int NOT NULL DEFAULT 0,
    CONSTRAINT fk_match_players_matches
        FOREIGN KEY (match_id)
        REFERENCES matches(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_match_players_characters
        FOREIGN KEY (character_id)
        REFERENCES characters(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_match_players_profile
        FOREIGN KEY (profile_id)
        REFERENCES player_profile(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_match_player UNIQUE (match_id, profile_id)
);

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: player_friends
-- RESPONSABILIDAD: almacenar relaciones de amistad entre perfiles
-- ====================================================
-- NOTA: Relaciona perfiles entre sí. 'profile_id' y 'friend_id' apuntan a 'player_profile'.
CREATE TABLE IF NOT EXISTS player_friends (
    id SERIAL PRIMARY KEY,
    character_id INT NOT NULL, -- Según tu DER, monitorea el personaje favorito/activo del amigo
    profile_id INT NOT NULL,
    friend_id INT NOT NULL,
    status friend_status NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_player_friends_characters
        FOREIGN KEY (character_id)
        REFERENCES characters(id)
        ON DELETE RESTRICT,
    CONSTRAINT unique_friendship UNIQUE (profile_id, friend_id),
    CONSTRAINT check_not_self_friend CHECK (profile_id <> friend_id),
    -- Al igual que antes, las FKs a player_profile quedan pendientes de la parte de tu compañero:
    CONSTRAINT fk_friends_profile FOREIGN KEY (profile_id) REFERENCES player_profile(id),
    CONSTRAINT fk_friends_friend FOREIGN KEY (friend_id) REFERENCES player_profile(id)
);

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: cosmetics
-- RESPONSABILIDAD: definir cosmeticos disponibles
-- ====================================================
CREATE TABLE IF NOT EXISTS cosmetics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    type cosmetic_type NOT NULL,
    price positive_int DEFAULT 0,
	img_url VARCHAR(255)
);

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: player_cosmetics
-- RESPONSABILIDAD: relacionar cosmeticos desbloqueados con perfiles
-- ====================================================
CREATE TABLE IF NOT EXISTS player_cosmetics (
    id SERIAL PRIMARY KEY,
    profile_id INT NOT NULL REFERENCES player_profile(id) ON DELETE CASCADE,
    cosmetic_id INT NOT NULL REFERENCES cosmetics(id) ON DELETE CASCADE,
    is_unlocked BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_player_cosmetic UNIQUE (profile_id, cosmetic_id)
);

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: daily_quest
-- RESPONSABILIDAD: definir misiones diarias y recompensas
-- ====================================================
CREATE TABLE IF NOT EXISTS daily_quest (
    id SERIAL PRIMARY KEY,
    description VARCHAR(200),
    reward_coins positive_int DEFAULT 10
);

-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: player_quests
-- RESPONSABILIDAD: relacionar misiones asignadas con perfiles
-- ====================================================
CREATE TABLE IF NOT EXISTS player_quests (
    id SERIAL PRIMARY KEY,
    profile_id INT NOT NULL REFERENCES player_profile(id) ON DELETE CASCADE,
    quest_id INT NOT NULL REFERENCES daily_quest(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_player_quest UNIQUE (profile_id, quest_id)
);
-- ===========================================================================
-- Índices sugeridos para optimizar el rendimiento del matchmaking y estadísticas
-- ===========================================================================
CREATE INDEX IF NOT EXISTS idx_matches_start_time ON matches(start_time);
CREATE INDEX IF NOT EXISTS idx_match_players_match ON match_players(match_id);
CREATE INDEX IF NOT EXISTS idx_abilities_character ON abilities(character_id);
CREATE INDEX IF NOT EXISTS idx_player_friends_profile ON player_friends(profile_id);
CREATE INDEX IF NOT EXISTS idx_player_friends_friend ON player_friends(friend_id);

-- =====================================================
-- INSERTS PARA DUCKY ARENA
-- =====================================================

-- 1. Usuarios (auth_user)
INSERT INTO auth_user (id,username, email, password, date_joined) VALUES
(1,'patoloco', 'pato@ducky.com', 'duck123', '2024-01-15'),
(2,'lola_arena', 'lola@ducky.com', 'arena456', '2024-02-20'),
(3,'cuaquito', 'cuaq@ducky.com', 'pluma789', '2024-03-10'),
(4,'pato_fuego', 'fuego@ducky.com', 'fire321', '2024-04-05'),
(5,'patobombo', 'bombo@ducky.com', 'explode654', '2024-05-12');

-- 2. Perfiles de jugador (player_profile) - IDs alineados con auth_user
INSERT INTO player_profile (user_id, level, experience, bread_coins) VALUES
(1, 15, 1250, 5000),
(2, 8, 450, 2300),
(3, 3, 120, 800),
(4, 22, 3400, 12000),
(5, 1, 0, 100);

-- 3. Mapas (game_maps)
INSERT INTO game_maps (name, environment_type) VALUES
('Isla Patolandia', 'Tropical'),
('Fábrica de Plumas', 'Industrial'),
('Pantano Misterioso', 'Pantano'),
('Arena Volcánica', 'Volcánico'),
('Ciudad Duckpool', 'Urbano');

-- 4. Personajes (characters)
INSERT INTO characters (name, role, base_health,attack_damage,endurance) VALUES
('Pato Asesino', 'Hacker', 120,100,59),
('Pato Robusto', 'Tank', 250,100,59),
('Pato Curandero', 'Healer', 90,100,59),
('Pato Mago', 'Mage', 100,100,59),
('Pato Escudero', 'Support', 150,100,59),
('Pato Ninja', 'Hacker', 110,100,59),
('Pato Titan', 'Tank', 300,100,59);


-- 5. Habilidades (abilities)
INSERT INTO abilities (character_id, input_key, name, cooldown) VALUES
-- Pato Asesino (id=1)
(1, 'Q', 'Puñalada Digital', 6.0),
(1, 'W', 'Infiltración', 12.0),
(1, 'E', 'Virus Letal', 8.5),
(1, 'R', 'Hackeo Masivo', 25.0),
-- Pato Robusto (id=2)
(2, 'Q', 'Golpe Escudo', 4.0),
(2, 'W', 'Muro Infranqueable', 10.0),
(2, 'E', 'Contraataque', 7.0),
(2, 'R', 'Terremoto Patoso', 20.0),
-- Pato Curandero (id=3)
(3, 'Q', 'Pluma Curativa', 3.0),
(3, 'W', 'Vendaje Rápido', 8.0),
(3, 'E', 'Campo Sanador', 15.0),
(3, 'R', 'Resurrección Patosa', 60.0),
-- Pato Mago (id=4)
(4, 'Q', 'Bola de Pluma', 2.5),
(4, 'W', 'Teletransporte', 12.0),
(4, 'E', 'Tormenta de Plumón', 9.0),
(4, 'R', 'Maldición del Pato', 30.0);

-- 6. Partidas (matches)
INSERT INTO matches (map_id, game_mode, start_time, duration_seconds) VALUES
(1, 'Duelo', '2025-01-10 18:30:00+00', 1240),
(2, 'Escaramuza', '2025-01-11 20:15:00+00', 980),
(3, 'Captura la Pluma', '2025-01-12 19:00:00+00', 1560),
(1, 'Duelo', '2025-01-13 21:30:00+00', 1100),
(4, 'Batalla Real', '2025-01-14 22:00:00+00', 2100);

-- 7. Participaciones en partidas (match_players)
INSERT INTO match_players (match_id, profile_id, character_id, team, is_winner, kills, deaths) VALUES
-- Partida 1 (mapa Isla Patolandia, Duelo)
(1, 1, 1, 'BLUE', TRUE, 12, 3),   -- Pato Asesino gana
(1, 2, 2, 'RED', FALSE, 5, 8),    -- Pato Robusto pierde
-- Partida 2 (Fábrica, Escaramuza)
(2, 3, 3, 'BLUE', FALSE, 2, 6),   -- Pato Curandero pierde
(2, 4, 4, 'RED', TRUE, 15, 1),    -- Pato Mago gana
-- Partida 3 (Pantano, Captura la Pluma)
(3, 1, 1, 'BLUE', TRUE, 8, 4),
(3, 2, 2, 'BLUE', TRUE, 3, 2),
(3, 3, 3, 'RED', FALSE, 1, 5),
(3, 4, 4, 'RED', FALSE, 6, 3),
-- Partida 4 (Isla, Duelo)
(4, 5, 5, 'BLUE', FALSE, 0, 10),  -- Pato Escudero novato
(4, 1, 1, 'RED', TRUE, 9, 2),
-- Partida 5 (Volcánica, Batalla Real)
(5, 4, 4, 'BLUE', TRUE, 20, 5),
(5, 1, 1, 'RED', FALSE, 11, 7),
(5, 2, 2, 'RED', FALSE, 3, 12);

-- 8. Amigos (player_friends)
INSERT INTO player_friends (character_id, profile_id, friend_id, status) VALUES
(1, 1, 2, 'ACCEPTED'),   -- patoloco es amigo de lola_arena
(4, 2, 1, 'ACCEPTED'),   -- lola_arena es amiga de patoloco
(3, 1, 3, 'PENDING'),    -- patoloco ha solicitado a cuaquito
(1, 4, 1, 'ACCEPTED'),   -- pato_fuego es amigo de patoloco
(2, 2, 4, 'BLOCKED');    -- lola_arena bloqueó a pato_fuego

-- 9. Cosméticos (cosmetics)
INSERT INTO cosmetics (name, type, price,img_url) VALUES
('Pirata', 'skin', 1500,'img'),
('Granjero', 'skin', 800,'img'),
('Samurai', 'skin', 2000,'img'),
('Sombrero de Copa', 'hat', 300,'img'),
('Gorra Duck', 'hat', 150,'img'),
('Pico Laser', 'weapon', 1200,'img'),
('Martillo Patoso', 'weapon', 1000,'img'),
('Baile Feliz', 'emote', 500,'img'),
('Rendir Pluma', 'emote', 400,'img');

-- 10. Cosméticos de jugadores (player_cosmetics)
INSERT INTO player_cosmetics (profile_id, cosmetic_id, is_unlocked) VALUES
(1, 1, TRUE),   -- patoloco tiene skin Pirata
(1, 4, TRUE),   -- patoloco tiene Sombrero de Copa
(1, 8, TRUE),   -- patoloco tiene Baile Feliz
(2, 2, TRUE),   -- lola_arena tiene skin Granjero
(2, 6, FALSE),  -- lola_arena NO tiene Pico Laser aún
(4, 3, TRUE),   -- pato_fuego tiene skin Samurai
(4, 7, TRUE);   -- pato_fuego tiene Martillo Patoso

-- 11. Misiones diarias (daily_quest)
INSERT INTO daily_quest (description, reward_coins) VALUES
('Consigue 10 bajas en partidas', 50),
('Juega 3 partidas como Tank', 30),
('Gana una partida en el mapa Volcánico', 40),
('Completa una partida sin morir', 60),
('Usa tu habilidad definitiva 5 veces', 25);

-- 12. Misiones de jugadores (player_quests)
INSERT INTO player_quests (profile_id, quest_id, is_completed) VALUES
(1, 1, TRUE),
(1, 3, FALSE),
(2, 2, TRUE),
(3, 5, FALSE),
(4, 1, TRUE),
(4, 4, TRUE);
