// src/utils/storage.js
// Gestion de la persistance JSON pour la config des serveurs et les items déjà vus

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const DATA_DIR = path.join(__dirname, '../../data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const SEEN_FILE = path.join(DATA_DIR, 'seen.json');

// Cache en mémoire pour seen.json (évite lectures disque répétées)
let _seenCache = null;

// ─── Initialisation ──────────────────────────────────────────────────────────
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    logger.error(`Erreur lecture ${filePath}:`, err.message);
    return defaultValue;
  }
}

function writeJSON(filePath, data) {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    // Mettre à jour le cache si c'est le fichier seen
    if (filePath === SEEN_FILE) _seenCache = data;
  } catch (err) {
    logger.error(`Erreur écriture ${filePath}:`, err.message);
  }
}

// ─── Config serveurs ──────────────────────────────────────────────────────────
function getConfig() {
  return readJSON(CONFIG_FILE, {});
}

function getGuildConfig(guildId) {
  const config = getConfig();
  return config[guildId] || null;
}

function setGuildConfig(guildId, guildConfig) {
  const config = getConfig();
  config[guildId] = { ...config[guildId], ...guildConfig };
  writeJSON(CONFIG_FILE, config);
}

function removeGuildConfig(guildId) {
  const config = getConfig();
  delete config[guildId];
  writeJSON(CONFIG_FILE, config);
}

function getAllGuilds() {
  return getConfig();
}

// ─── Items déjà vus ──────────────────────────────────────────────────────────
const MAX_SEEN_PER_SOURCE = 500; // éviter que le fichier grossisse indéfiniment

function getSeen() {
  if (_seenCache) return _seenCache;
  _seenCache = readJSON(SEEN_FILE, {});
  return _seenCache;
}

function isAlreadySeen(source, id) {
  const seen = getSeen();
  return seen[source] ? seen[source].includes(String(id)) : false;
}

function markAsSeen(source, id) {
  const seen = getSeen();
  if (!seen[source]) seen[source] = [];
  const idStr = String(id);
  if (!seen[source].includes(idStr)) {
    seen[source].push(idStr);
    // Garder seulement les MAX_SEEN_PER_SOURCE derniers
    if (seen[source].length > MAX_SEEN_PER_SOURCE) {
      seen[source] = seen[source].slice(-MAX_SEEN_PER_SOURCE);
    }
    writeJSON(SEEN_FILE, seen);
  }
}

function markManyAsSeen(source, ids) {
  const seen = getSeen();
  if (!seen[source]) seen[source] = [];
  const newIds = ids.map(String).filter(id => !seen[source].includes(id));
  seen[source].push(...newIds);
  if (seen[source].length > MAX_SEEN_PER_SOURCE) {
    seen[source] = seen[source].slice(-MAX_SEEN_PER_SOURCE);
  }
  writeJSON(SEEN_FILE, seen);
}

module.exports = {
  getGuildConfig,
  setGuildConfig,
  removeGuildConfig,
  getAllGuilds,
  isAlreadySeen,
  markAsSeen,
  markManyAsSeen,
};
