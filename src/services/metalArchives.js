// src/services/metalArchives.js
// Scrape les nouvelles sorties depuis Encyclopaedia Metallum (metal-archives.com)

const axios = require('axios');
const { isAlreadySeen, markAsSeen, markManyAsSeen } = require('../utils/storage');
const logger = require('../utils/logger');

const SOURCE_KEY = 'metal_archives_releases';
const BASE_URL = 'https://www.metal-archives.com';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/javascript, */*',
  'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
  'Referer': 'https://www.metal-archives.com/',
  'X-Requested-With': 'XMLHttpRequest',
};

/**
 * Parse le HTML d'une cellule pour en extraire le texte et l'URL.
 */
function parseCell(html) {
  if (!html) return { text: '', url: null };
  const match = html.match(/href="([^"]+)">([^<]+)</);
  if (match) return { text: match[2].trim(), url: match[1].trim() };
  return { text: html.replace(/<[^>]+>/g, '').trim(), url: null };
}

/**
 * Récupère les sorties récentes depuis Metal Archives (API AJAX).
 * Cette API retourne les sorties du mois en cours et du suivant.
 */
async function fetchRecentReleases() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const response = await axios.get(`${BASE_URL}/release/ajax-upcoming/json/1`, {
      headers: HEADERS,
      params: {
        sEcho: 1,
        iColumns: 6,
        iDisplayStart: 0,
        iDisplayLength: 100,
        iSortCol_0: 4,
        sSortDir_0: 'desc',
        iSortingCols: 1,
      },
      timeout: 15000,
    });

    const data = response.data;
    if (!data?.aaData) {
      logger.warn('[MetalArchives] Réponse inattendue de l\'API');
      return [];
    }

    const newReleases = [];

    for (const row of data.aaData) {
      // row = [bandHtml, releaseHtml, type, genreHtml, dateHtml, labelHtml]
      const band = parseCell(row[0]);
      const release = parseCell(row[1]);
      const type = row[2] || 'Album';
      const genre = row[3]?.replace(/<[^>]+>/g, '').trim() || 'Metal';
      const date = row[4]?.replace(/<[^>]+>/g, '').trim() || '';
      const label = parseCell(row[5]);

      if (!band.text || !release.text) continue;

      const id = `${band.text}_${release.text}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      if (isAlreadySeen(SOURCE_KEY, id)) continue;
      markAsSeen(SOURCE_KEY, id);

      newReleases.push({
        id,
        band: band.text,
        bandUrl: band.url,
        title: release.text,
        url: release.url,
        type,
        genre,
        date,
        label: label.text || 'Inconnu',
        labelUrl: label.url,
        cover: null, // À récupérer si nécessaire
      });
    }

    if (newReleases.length > 0) {
      logger.info(`[MetalArchives] ${newReleases.length} nouvelle(s) sortie(s) trouvée(s)`);
    }
    return newReleases;
  } catch (err) {
    logger.error('[MetalArchives] Erreur fetchRecentReleases:', err.message);
    return [];
  }
}

/**
 * Récupère aussi les nouvelles bandes annoncées récemment sur Metal Archives.
 */
async function fetchNewBands() {
  try {
    const response = await axios.get(`${BASE_URL}/band/ajax-new/json/1`, {
      headers: HEADERS,
      params: {
        sEcho: 1,
        iColumns: 5,
        iDisplayStart: 0,
        iDisplayLength: 50,
        iSortCol_0: 3,
        sSortDir_0: 'desc',
        iSortingCols: 1,
      },
      timeout: 15000,
    });

    const data = response.data;
    if (!data?.aaData) return [];

    const SOURCE_BANDS = 'metal_archives_bands';
    const newBands = [];

    for (const row of data.aaData) {
      // row = [bandHtml, country, genre, addedDate, ...]
      const band = parseCell(row[0]);
      const country = row[1]?.replace(/<[^>]+>/g, '').trim() || '';
      const genre = row[2]?.replace(/<[^>]+>/g, '').trim() || '';
      const addedDate = row[3]?.replace(/<[^>]+>/g, '').trim() || '';

      if (!band.text) continue;

      const id = `band_${band.text}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      if (isAlreadySeen(SOURCE_BANDS, id)) continue;
      markAsSeen(SOURCE_BANDS, id);

      newBands.push({
        id,
        name: band.text,
        url: band.url ? `${BASE_URL}${band.url.startsWith('/') ? '' : '/'}${band.url}` : null,
        country,
        genre,
        addedDate,
      });
    }

    if (newBands.length > 0) {
      logger.info(`[MetalArchives] ${newBands.length} nouveau(x) groupe(s) trouvé(s)`);
    }
    return newBands;
  } catch (err) {
    logger.error('[MetalArchives] Erreur fetchNewBands:', err.message);
    return [];
  }
}

/**
 * Initialise Metal Archives (marque les releases existantes comme vues).
 */
async function initializeMetalArchives() {
  try {
    const response = await axios.get(`${BASE_URL}/release/ajax-upcoming/json/1`, {
      headers: HEADERS,
      params: {
        sEcho: 1,
        iColumns: 6,
        iDisplayStart: 0,
        iDisplayLength: 100,
        iSortCol_0: 4,
        sSortDir_0: 'desc',
        iSortingCols: 1,
      },
      timeout: 15000,
    });

    const data = response.data;
    if (data?.aaData) {
      const ids = data.aaData.map(row => {
        const band = parseCell(row[0]);
        const release = parseCell(row[1]);
        return `${band.text}_${release.text}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      }).filter(Boolean);
      markManyAsSeen(SOURCE_KEY, ids);
      logger.success(`[MetalArchives] Initialisation: ${ids.length} sorties marquées comme vues`);
    }
  } catch (err) {
    logger.warn('[MetalArchives] Erreur initialisation:', err.message);
  }
}

module.exports = { fetchRecentReleases, fetchNewBands, initializeMetalArchives };
