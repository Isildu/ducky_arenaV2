DROP SCHEMA IF EXISTS DUCKY_ARENA CASCADE;
CREATE SCHEMA DUCKY_ARENA;

SET SEARCH_PATH TO DUCKY_ARENA;


-- 1. Tabla: auth_user 
CREATE TABLE IF NOT EXISTS auth_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(30) NOT NULL,
    date_joined DATE DEFAULT CURRENT_DATE
);


-- 2. Tabla: player_profile 
CREATE TABLE IF NOT EXISTS player_profile (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES auth_user(id) ON DELETE CASCADE,
    nickname VARCHAR(20) NOT NULL,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    bread_coins INT DEFAULT 0
);


-- 3. Tabla: game_maps
CREATE TABLE IF NOT EXISTS game_maps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    environment_type VARCHAR(50) NOT NULL
);

-- 4. Tabla: characters
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    base_health INT NOT NULL CHECK (base_health >= 0)
);


-- 5. Tabla: abilities
CREATE TABLE IF NOT EXISTS abilities (
    id SERIAL PRIMARY KEY,
    character_id INT NOT NULL,
    input_key VARCHAR(10) NOT NULL, -- Ej: 'Q', 'W', 'E', 'R'
    name VARCHAR(100) NOT NULL,
    cooldown DECIMAL(5,2) NOT NULL CHECK (cooldown >= 0),
    CONSTRAINT fk_abilities_characters
        FOREIGN KEY (character_id)
        REFERENCES characters(id)
        ON DELETE CASCADE
);

-- 6. Tabla: matches
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    map_id INT NOT NULL,
    game_mode VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INT, -- Se llena al finalizar la partida
    CONSTRAINT fk_matches_game_maps
        FOREIGN KEY (map_id)
        REFERENCES game_maps(id)
        ON DELETE RESTRICT
);

-- 7. Tabla: match_players
CREATE TABLE IF NOT EXISTS match_players (
    id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    profile_id INT NOT NULL,
    character_id INT NOT NULL,
    team VARCHAR(20) NOT NULL,
    is_winner BOOLEAN NOT NULL DEFAULT FALSE,
    kills INT NOT NULL DEFAULT 0 CHECK (kills >= 0),
    deaths INT NOT NULL DEFAULT 0 CHECK (deaths >= 0),
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
        ON DELETE CASCADE
);

-- 8. Tabla: player_friends
-- NOTA: Relaciona perfiles entre sí. 'profile_id' y 'friend_id' apuntan a 'player_profile'.
CREATE TABLE IF NOT EXISTS player_friends (
    id SERIAL PRIMARY KEY,
    character_id INT NOT NULL, -- Según tu DER, monitorea el personaje favorito/activo del amigo
    profile_id INT NOT NULL,
    friend_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- Ej: 'PENDING', 'ACCEPTED', 'BLOCKED'
    CONSTRAINT fk_player_friends_characters
        FOREIGN KEY (character_id)
        REFERENCES characters(id)
        ON DELETE RESTRICT,
    CONSTRAINT unique_friendship UNIQUE (profile_id, friend_id),
    -- Al igual que antes, las FKs a player_profile quedan pendientes de la parte de tu compañero:
    CONSTRAINT fk_friends_profile FOREIGN KEY (profile_id) REFERENCES player_profile(id),
    CONSTRAINT fk_friends_friend FOREIGN KEY (friend_id) REFERENCES player_profile(id)
);

-- 9. Tabla: cosmetics
CREATE TABLE IF NOT EXISTS cosmetics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    price INT DEFAULT 0
);

-- 10. Tabla: player_cosmetics
CREATE TABLE IF NOT EXISTS player_cosmetics (
    id SERIAL PRIMARY KEY,
    profile_id INT REFERENCES player_profile(id) ON DELETE CASCADE,
    cosmetic_id INT REFERENCES cosmetics(id) ON DELETE CASCADE,
    unlocked_at BOOLEAN DEFAULT FALSE
);

-- 11. Tabla: daily_quest
CREATE TABLE IF NOT EXISTS daily_quest (
    id SERIAL PRIMARY KEY,
    description VARCHAR(140),
    reward_coins INT DEFAULT 10
);

-- 12. Tabla: player_quests
CREATE TABLE IF NOT EXISTS player_quests (
    id SERIAL PRIMARY KEY,
    profile_id INT REFERENCES player_profile(id) ON DELETE CASCADE,
    quest_id INT REFERENCES daily_quest(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE
);
-- ===========================================================================
-- Índices sugeridos para optimizar el rendimiento del matchmaking y estadísticas
-- ===========================================================================
CREATE INDEX IF NOT EXISTS idx_matches_start_time ON matches(start_time);
CREATE INDEX IF NOT EXISTS idx_match_players_match ON match_players(match_id);
CREATE INDEX IF NOT EXISTS idx_abilities_character ON abilities(character_id);
CREATE INDEX IF NOT EXISTS idx_player_friends_profile ON player_friends(profile_id);
CREATE INDEX IF NOT EXISTS idx_player_friends_friend ON player_friends(friend_id);  