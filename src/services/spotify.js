// src/services/spotify.js
// Détecte les nouvelles sorties Rock/Metal via l'API Spotify

const axios = require('axios');
const { isAlreadySeen, markAsSeen } = require('../utils/storage');
const logger = require('../utils/logger');

const SOURCE_KEY = 'spotify_releases';

let accessToken = null;
let tokenExpiry = 0;

/**
 * Obtient (ou renouvelle) le token Spotify via Client Credentials.
 */
async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry - 60000) return accessToken;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SPOTIFY_CLIENT_ID et SPOTIFY_CLIENT_SECRET requis dans .env');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    }
  );

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;
  logger.info('[Spotify] Token renouvelé');
  return accessToken;
}

/**
 * Récupère les nouvelles sorties Spotify et filtre pour le Rock/Metal.
 */
async function fetchNewReleases() {
  try {
    const token = await getAccessToken();
    const newAlbums = [];
    let offset = 0;
    const limit = 50;
    let total = 1;

    // Récupérer jusqu'à 200 sorties récentes
    while (offset < Math.min(total, 200)) {
      const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit, offset, country: 'FR' },
        timeout: 10000,
      });

      const { items, total: t } = response.data.albums;
      total = t;

      for (const album of items) {
        if (isAlreadySeen(SOURCE_KEY, album.id)) continue;

        // Vérifier si l'artiste est dans un genre Metal/Rock
        const isMetalRock = await isMetalRockArtist(token, album.artists[0]?.id);
        if (!isMetalRock) continue;

        markAsSeen(SOURCE_KEY, album.id);
        newAlbums.push(album);
      }

      offset += limit;
      // Petit délai entre les pages
      await new Promise(r => setTimeout(r, 200));
    }

    if (newAlbums.length > 0) {
      logger.info(`[Spotify] ${newAlbums.length} nouvelle(s) sortie(s) Metal/Rock trouvée(s)`);
    }
    return newAlbums;
  } catch (err) {
    if (err.message.includes('SPOTIFY_CLIENT_ID')) {
      logger.warn('[Spotify] API non configurée, fonctionnalité désactivée');
      return [];
    }
    logger.error('[Spotify] Erreur fetchNewReleases:', err.message);
    return [];
  }
}

// Cache des artistes vérifiés pour éviter les appels répétés
const artistCache = new Map();
const METAL_ROCK_GENRES = [
  'metal', 'rock', 'heavy metal', 'black metal', 'death metal', 'thrash metal',
  'doom metal', 'power metal', 'metalcore', 'hard rock', 'punk', 'grunge',
  'alternative rock', 'prog', 'industrial', 'gothic', 'nu-metal', 'post-metal',
  'sludge', 'stoner', 'symphonic', 'folk metal', 'viking metal', 'speed metal',
];

async function isMetalRockArtist(token, artistId) {
  if (!artistId) return false;
  if (artistCache.has(artistId)) return artistCache.get(artistId);

  try {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000,
    });
    const genres = (response.data.genres || []).map(g => g.toLowerCase());
    const isMatch = genres.some(g => METAL_ROCK_GENRES.some(mr => g.includes(mr)));
    artistCache.set(artistId, isMatch);
    // Vider le cache après 10 000 entrées
    if (artistCache.size > 10000) {
      const firstKey = artistCache.keys().next().value;
      artistCache.delete(firstKey);
    }
    return isMatch;
  } catch {
    return false;
  }
}

/**
 * Initialise le service Spotify (marque les releases actuelles comme vues).
 */
async function initializeSpotify() {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit: 50, country: 'FR' },
      timeout: 10000,
    });
    const ids = response.data.albums.items.map(a => a.id);
    const { markManyAsSeen } = require('../utils/storage');
    markManyAsSeen(SOURCE_KEY, ids);
    logger.success(`[Spotify] Initialisation: ${ids.length} releases marquées comme vues`);
  } catch (err) {
    if (err.message.includes('SPOTIFY_CLIENT_ID')) {
      logger.warn('[Spotify] Non configuré, ignoré');
      return;
    }
    logger.warn('[Spotify] Erreur initialisation:', err.message);
  }
}

module.exports = { fetchNewReleases, initializeSpotify };
