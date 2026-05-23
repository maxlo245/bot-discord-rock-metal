// src/services/lastfm.js
// Récupère les nouvelles sorties d'albums via l'API Last.fm

const axios = require('axios');
const { LASTFM_TAGS } = require('../config/feeds');
const { isAlreadySeen, markAsSeen, markManyAsSeen } = require('../utils/storage');
const logger = require('../utils/logger');

const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const SOURCE_KEY = 'lastfm_releases';

function getApiKey() {
  const key = process.env.LASTFM_API_KEY;
  if (!key) throw new Error('LASTFM_API_KEY requis dans .env');
  return key;
}

/**
 * Récupère les top albums récents pour un tag donné.
 */
async function fetchTagTopAlbums(tag, limit = 20) {
  const apiKey = getApiKey();
  const response = await axios.get(BASE_URL, {
    params: {
      method: 'tag.gettopalbums',
      tag,
      api_key: apiKey,
      format: 'json',
      limit,
    },
    timeout: 10000,
  });
  return response.data?.albums?.album || [];
}

/**
 * Récupère les nouvelles sorties d'artistes populaires Metal/Rock
 * en croisant les tags Last.fm.
 */
async function fetchNewReleases() {
  try {
    const apiKey = getApiKey();
    const newReleases = [];
    const seen = new Set();

    // Utiliser les 4 premiers tags pour éviter trop d'appels
    const tagsToCheck = LASTFM_TAGS.slice(0, 4);

    for (const tag of tagsToCheck) {
      try {
        const albums = await fetchTagTopAlbums(tag, 10);
        for (const album of albums) {
          const id = `${album.artist?.name}_${album.name}`.toLowerCase().replace(/\s+/g, '_');
          if (seen.has(id) || isAlreadySeen(SOURCE_KEY, id)) continue;
          seen.add(id);
          markAsSeen(SOURCE_KEY, id);

          // Récupérer l'URL de l'image
          const image = album.image?.find(img => img.size === 'extralarge')?.['#text']
            || album.image?.find(img => img.size === 'large')?.['#text']
            || null;

          newReleases.push({
            id,
            name: album.name,
            artist: album.artist?.name || 'Inconnu',
            url: album.url,
            image: image || null,
            tag,
          });
        }
        await new Promise(r => setTimeout(r, 250)); // Respecter le rate limit Last.fm
      } catch (tagErr) {
        logger.warn(`[Last.fm] Erreur pour le tag "${tag}": ${tagErr.message}`);
      }
    }

    // Récupérer aussi les nouvelles sorties via chart.gettopartists
    try {
      const chartResp = await axios.get(BASE_URL, {
        params: {
          method: 'chart.gettoptracks',
          api_key: apiKey,
          format: 'json',
          limit: 30,
        },
        timeout: 10000,
      });
      // Utiliser uniquement pour enrichir les infos si pertinent
    } catch (_) {}

    if (newReleases.length > 0) {
      logger.info(`[Last.fm] ${newReleases.length} nouvelle(s) sortie(s) trouvée(s)`);
    }
    return newReleases;
  } catch (err) {
    if (err.message.includes('LASTFM_API_KEY')) {
      logger.warn('[Last.fm] API non configurée, fonctionnalité désactivée');
      return [];
    }
    logger.error('[Last.fm] Erreur fetchNewReleases:', err.message);
    return [];
  }
}

/**
 * Initialise Last.fm (marque les albums actuels comme vus).
 */
async function initializeLastfm() {
  try {
    getApiKey(); // Vérifie que la clé est présente
    const albums = await fetchTagTopAlbums('metal', 25);
    const ids = albums.map(a =>
      `${a.artist?.name}_${a.name}`.toLowerCase().replace(/\s+/g, '_')
    );
    markManyAsSeen(SOURCE_KEY, ids);
    logger.success(`[Last.fm] Initialisation: ${ids.length} albums marqués comme vus`);
  } catch (err) {
    if (err.message.includes('LASTFM_API_KEY')) {
      logger.warn('[Last.fm] Non configuré, ignoré');
      return;
    }
    logger.warn('[Last.fm] Erreur initialisation:', err.message);
  }
}

module.exports = { fetchNewReleases, initializeLastfm };
