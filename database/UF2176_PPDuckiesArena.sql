-- ====================================================
-- DUCKYARENA DATABASE
-- TABLA: consultas de apoyo
-- RESPONSABILIDAD: documentar consultas utiles de analisis y usuario
-- ====================================================

SET SEARCH_PATH TO ducky_arena;

--Consultas para administrador / análisis  

--Duración media partidas:

SELECT AVG(duration_seconds) AS media_duracion
FROM matches;

--Mapa más jugado:

SELECT
    gm.name,
    COUNT(*) partidas
FROM matches m
JOIN game_maps gm
ON m.map_id=gm.id
GROUP BY gm.name
ORDER BY partidas DESC;

--Personajes más elegidos:

SELECT
    c.role,
    COUNT(*)
FROM match_players mp
JOIN characters c
ON mp.character_id=c.id
GROUP BY c.role;

--Winrate por personaje:

SELECT
c.name,
ROUND(AVG(CASE WHEN mp.is_winner THEN 100 ELSE 0 END),2) winrate
FROM match_players mp
JOIN characters c
ON mp.character_id=c.id
GROUP BY c.name
ORDER BY winrate DESC;


--Consultas orientadas al usuario (las más importantes)  

--Perfil del jugador:  

SELECT
    au.username,
    pp.level,
    pp.experience,
    pp.bread_coins
FROM player_profile pp
JOIN auth_user au ON pp.user_id=au.id
WHERE au.username='?';

--Historial de partidas:

SELECT
    m.id,
    gm.name,
    m.game_mode,
    mp.kills,
    mp.deaths,
    mp.is_winner
FROM match_players mp
JOIN matches m ON mp.match_id=m.id
JOIN game_maps gm ON m.map_id=gm.id
WHERE mp.profile_id=1;

--Ranking de jugadores:

SELECT
    au.username,
    SUM(mp.kills) total_kills
FROM match_players mp
JOIN player_profile pp ON mp.profile_id=pp.id
JOIN auth_user au ON pp.user_id=au.id
GROUP BY au.username
ORDER BY total_kills DESC;

--Personaje más usado:

SELECT
    c.name,
    COUNT(*) veces
FROM match_players mp
JOIN characters c ON mp.character_id=c.id
GROUP BY c.name
ORDER BY veces DESC;

-- Amigos:  

SELECT
    u2.username
FROM player_friends pf
JOIN player_profile p2 ON pf.friend_id=p2.id
JOIN auth_user u2 ON p2.user_id=u2.id
WHERE pf.profile_id=1
AND pf.status='?';

--Cosméticos desbloqueados:
SELECT
    c.name,
    c.type
FROM player_cosmetics pc
JOIN cosmetics c
ON pc.cosmetic_id=c.id
WHERE pc.profile_id=1
AND pc.is_unlocked=TRUE;


-- Partidas ganadas por cada jugador

SELECT
    au.username,
    COUNT(mp.id) AS wins
FROM match_players mp
JOIN player_profile pp ON mp.profile_id = pp.id
JOIN auth_user au ON pp.user_id = au.id
WHERE mp.is_winner = TRUE
GROUP BY au.username
ORDER BY wins DESC;

-- Mostrar habilidades de cada personaje
SELECT
    c.name AS character_name,
    c.role,
    a.input_key,
    a.name AS ability_name,
    a.cooldown
FROM abilities a
JOIN characters c
ON a.character_id = c.id
ORDER BY c.name, a.input_key;


