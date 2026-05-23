// src/services/rss.js
// Récupère et filtre les nouveaux articles de tous les flux RSS

const Parser = require('rss-parser');
const { RSS_FEEDS } = require('../config/feeds');
const { isAlreadySeen, markAsSeen } = require('../utils/storage');
const logger = require('../utils/logger');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'MetalRockBot/1.0 (Discord Bot; +https://discord.gg)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
    ],
  },
});

// Statistiques par flux
const feedStats = {};

// Déduplication globale par titre (cross-feeds, en mémoire)
// Conserve les titres vus depuis le démarrage pour éviter les doublons
const globalSeenTitles = new Set();

/**
 * Normalise un titre pour la comparaison (minuscules, sans ponctuation).
 */
function normalizeTitle(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 120);
}

// Limite d'articles postés par cycle de check
const MAX_ITEMS_PER_CHECK = 12;
const MAX_ITEMS_PER_FEED = 2;

// Patterns à exclure uniquement sur les feeds qui ne sont PAS des sites de reviews
const REVIEW_PATTERNS = [
  /^review[:\s]/i,
  /\balbum review\b/i,
  /\bep review\b/i,
  /\bsingle review\b/i,
  /\btrack review\b/i,
];

// Patterns à EXCLURE (listes, quizzes, pub, hors-sujet, etc.)
const EXCLUDE_PATTERNS = [
  /\b(top|best)\s+\d+\b/i,
  /\b\d+\s+(best|worst|greatest|heaviest)\b/i,
  /\branked[:\s]/i,
  /\bquiz[:\s]/i,
  /\bfeature[:\s]/i,
  /\bcolumn[:\s]/i,
  /\bopinion[:\s]/i,
  /\bthis week in\b/i,
  /\bthis day in\b/i,
  /\bthis month in\b/i,
  /\brig rundown\b/i,
  /\bsponsored\b/i,
  /\bgiveaway\b/i,
  /\bcontest\b/i,
  /\bpodcast[:\s]/i,
  /\beditorial[:\s]/i,
  /\bphoto\s+gallery\b/i,
  /\bgallery[:\s]/i,
  /\bpodcast[:\s]/i,
  // Tech / consumer / hors-sujet
  /\bairpods?\b/i,
  /\bearbuds?\b/i,
  /\bheadphones?\b/i,
  /\bwireless\s+(audio|headphones?|earphones?|earbuds?|speaker)/i,
  /\bdrop[s]?\s+to\s+\$\d+/i,
  /\bsave\s+(big|up\s+to|\d+%)/i,
  /\bmemorial\s+day\s+(sale|deal)/i,
  /\bblack\s+friday\b/i,
  /\bcyber\s+monday\b/i,
  /\bbest\s+\w+\s+(deal|sale|buy|price|discount)/i,
  /\b(sale|deal)[s]?[:\s]/i,
  /\bdiscount[s]?\b/i,
  /\bbuy\s+(now|today|online)\b/i,
  /\bstreaming\s+(service|platform|app)\b/i,
  /\bboxset\b/i,
  /\bgear\s+(guide|review)\b/i,
  /\bhow\s+to\b/i,
  /\bwhat\s+is\b/i,
  /\bwhy\s+(you|we)\b/i,
  // Genres hors metal/rock
  /\brapper\b/i,
  /\bhip[\s-]?hop\b/i,
  /\b(hip|hop)\s+artist\b/i,
  /\br&b\b/i,
  /\brnb\b/i,
  /\bcountry\s+(artist|singer|star|band|music)\b/i,
  /\bjazz\s+(artist|musician|band|album)\b/i,
  /\bpop\s+(star|princess|king|queen|idol|act)\b/i,
  /\bedm\b/i,
  /\belectronic\s+dance\b/i,
  /\brap\s+(album|song|track|music|artist|star)\b/i,
  /\bmcs?\b.*\b(dead|dies|passes|tour|signs)\b/i,
  /\bclassical\s+(music|composer|orchestra)\b/i,
  /\bk-?pop\b/i,
  /\bsoul\s+(singer|artist|music|album)\b/i,
  /\breggae\b/i,
  /\bboyband\b/i,
  /\bboy\s+band\b/i,
];

// Mots-clés OBLIGATOIRES — l'article doit en contenir au moins un pour être posté
const MUSIC_KEYWORDS = [
  /\bband\b/i, /\balbum\b/i, /\bsingle\b/i, /\bep\b/i, /\btour\b/i,
  /\bconcert\b/i, /\bshow\b/i, /\bgig\b/i, /\blive\b/i, /\bmusic\b/i,
  /\bsong\b/i, /\btrack\b/i, /\bvocal/i, /\bguitar/i, /\bdrum/i,
  /\bbass\b/i, /\briff\b/i, /\bmetal\b/i, /\brock\b/i, /\bpunk\b/i,
  /\bhardcore\b/i, /\bgrunge\b/i, /\bfest(ival)?\b/i, /\blabel\b/i,
  /\blyric/i, /\bchord/i, /\brecord/i, /\brelease/i,
  /\bartist\b/i, /\bmusician\b/i, /\bplaylist\b/i,
  /\bvenue\b/i, /\bstage\b/i, /\bperform/i, /\bsignature\b/i,
];

// Mots-clés exigeant rock/metal pour les feeds généralistes (strict:true)
const STRICT_ROCK_METAL_KEYWORDS = [
  /\bmetal\b/i, /\brock\b/i, /\bpunk\b/i, /\bhardcore\b/i, /\bgrunge\b/i,
  /\bthrash\b/i, /\bdoom\b/i, /\bsludge\b/i, /\bblack\s*metal\b/i,
  /\bdeath\s*metal\b/i, /\bpower\s*metal\b/i, /\bfolk\s*metal\b/i,
  /\bprog(ressive)?\s*(metal|rock)\b/i, /\bmetalcore\b/i, /\bdeathcore\b/i,
  /\bpost[\s-]?(rock|metal|punk|hardcore)\b/i, /\bstoner\b/i, /\bpsychedelic\s*rock\b/i,
  /\balt(ernative)?\s*rock\b/i, /\bindierock\b/i, /\bindie\s*rock\b/i,
  /\bemo\b/i, /\bscreamo\b/i, /\bshoegaze\b/i, /\bgothic\s*(rock|metal)\b/i,
  /\bindustrial\s*(rock|metal)\b/i, /\bnu[\s-]?metal\b/i, /\bglam\s*(rock|metal)\b/i,
  /\bguitar\b/i, /\bdrummer\b/i, /\briff\b/i, /\bheavy\b/i,
  /\bdistortion\b/i, /\bambassador\b.*\brock\b/i,
];
const PRIORITY_KEYWORDS = [
  /\bnew album\b/i,
  /\bnouvel album\b/i,
  /\bnew ep\b/i,
  /\bnew single\b/i,
  /\bnouveau single\b/i,
  /\bannounce[sd]?\b/i,
  /\bannonce\b/i,
  /\brelease[sd]?\b/i,
  /\bsortie\b/i,
  /\btour\b/i,
  /\btournée\b/i,
  /\bsign[s]?\s+to\b/i,
  /\bsigned\s+to\b/i,
  /\bjoin[s]?\b.*\bband\b/i,
  /\bbreaks?\s+up\b/i,
  /\bdisband[s]?\b/i,
  /\breunion\b/i,
  /\bréunion\b/i,
  /\bnew\s+(member|vocalist|guitarist|bassist|drummer)\b/i,
  /\bdeath\b/i,
  /\bpasses?\s+away\b/i,
  /\bdécède\b/i,
  /\bnew\s+(music\s+)?video\b/i,
  /\bofficial\s+video\b/i,
  /\blyric\s+video\b/i,
  /\bfull\s+album\s+stream\b/i,
  /\bworld\s+premiere\b/i,
];

/**
 * Évalue si un article est suffisamment important pour être posté.
 * Retourne false si l'article doit être ignoré.
 */
function isImportant(item, feed = {}) {
  const title = (item.title || '').trim();
  if (!title) return false;

  // Exclure les patterns non-news / hors-sujet
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(title)) return false;
  }

  // Exclure les reviews sauf pour les sites dédiés aux reviews
  if (!feed.allowReviews) {
    for (const pattern of REVIEW_PATTERNS) {
      if (pattern.test(title)) return false;
    }
  }

  // Filtre positif : le titre ou le résumé doit mentionner la musique
  const haystack = title + ' ' + (item.contentSnippet || item.summary || '');
  const isMusicRelated = MUSIC_KEYWORDS.some(p => p.test(haystack));
  if (!isMusicRelated) return false;

  return true;
}

/**
 * Retourne true si l'article est prioritaire (annonce/release/etc.).
 */
function isPriority(item) {
  const title = (item.title || '').trim();
  return PRIORITY_KEYWORDS.some(p => p.test(title));
}

/**
 * Génère un identifiant unique pour un item RSS.
 */
function getItemId(item) {
  return item.guid || item.id || item.link || item.title;
}

/**
 * Récupère les nouveaux items d'un seul flux RSS.
 * Retourne un tableau d'objets { item, feed }.
 */
async function fetchFeed(feed) {
  const sourceKey = `rss_${feed.name}`;
  try {
    const parsed = await parser.parseURL(feed.url);
    feedStats[feed.name] = { ok: true, lastCheck: new Date() };

    const newItems = [];
    let feedCount = 0;
    for (const item of parsed.items || []) {
      const id = getItemId(item);
      if (!id) continue;
      if (isAlreadySeen(sourceKey, id)) continue;
      // Filtrer les articles sans importance — marquer vus immédiatement pour éviter le re-check
      if (!isImportant(item, feed)) { markAsSeen(sourceKey, id); continue; }
      // Pour les feeds généralistes, exiger un mot-clé rock/metal
      if (feed.strict) {
        const haystack = (item.title || '') + ' ' + (item.contentSnippet || item.summary || '');
        if (!STRICT_ROCK_METAL_KEYWORDS.some(p => p.test(haystack))) { markAsSeen(sourceKey, id); continue; }
      }
      // Déduplication globale par titre (évite les doublons cross-feeds)
      const normTitle = normalizeTitle(item.title);
      if (normTitle && globalSeenTitles.has(normTitle)) { markAsSeen(sourceKey, id); continue; }
      if (normTitle) globalSeenTitles.add(normTitle);
      // Limite par feed — NE PAS marquer vu : sera repris au prochain cycle
      if (feedCount >= MAX_ITEMS_PER_FEED) continue;
      feedCount++;
      // Marquer comme vu seulement quand l'article sera posté
      newItems.push({ item, feed, priority: isPriority(item), _sourceKey: sourceKey, _id: id });
    }

    if (newItems.length > 0) {
      logger.info(`[RSS] ${feed.name}: ${newItems.length} nouveau(x) item(s)`);
    }
    return newItems;
  } catch (err) {
    feedStats[feed.name] = { ok: false, error: err.message, lastCheck: new Date() };
    logger.warn(`[RSS] Erreur sur "${feed.name}" (${feed.url}): ${err.message}`);
    return [];
  }
}

/**
 * Récupère tous les flux RSS en parallèle par lots.
 * Retourne tous les nouveaux items triés par date.
 */
async function fetchAllFeeds() {
  const BATCH_SIZE = 8; // requêtes simultanées max
  const allNew = [];
  const activeFeeds = RSS_FEEDS.filter(f => !f.disabled);

  for (let i = 0; i < activeFeeds.length; i += BATCH_SIZE) {
    const batch = activeFeeds.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(feed => fetchFeed(feed)));
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allNew.push(...result.value);
      }
    }
    // Petite pause entre les lots pour éviter de surcharger
    if (i + BATCH_SIZE < activeFeeds.length) {
    }
  }

  // Trier : prioritaires d'abord, puis par date
  allNew.sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    const da = a.item.pubDate ? new Date(a.item.pubDate) : new Date(0);
    const db = b.item.pubDate ? new Date(b.item.pubDate) : new Date(0);
    return db - da;
  });

  // Limiter le total d'articles par cycle
  const limited = allNew.slice(0, MAX_ITEMS_PER_CHECK);
  // Marquer comme vus UNIQUEMENT les articles qui vont être postés
  for (const entry of limited) {
    markAsSeen(entry._sourceKey, entry._id);
  }
  // Les articles au-delà de la limite ne sont PAS marqués vus → repris au prochain cycle
  if (allNew.length > MAX_ITEMS_PER_CHECK) {
    logger.info(`[RSS] ${allNew.length} items → limité à ${MAX_ITEMS_PER_CHECK} par cycle (${allNew.length - MAX_ITEMS_PER_CHECK} reportés)`);
  }

  logger.info(`[RSS] Total: ${limited.length} nouveau(x) item(s) sur ${activeFeeds.length} flux actifs`);;
  return limited;
}

/**
 * Initialise tous les flux RSS (marque les items existants comme vus
 * pour ne pas spammer au démarrage).
 */
async function initializeFeeds() {
  logger.info('[RSS] Initialisation — marquage des anciens items comme vus (< 24h conservés)...');
  const BATCH_SIZE = 6;
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const activeFeeds = RSS_FEEDS.filter(f => !f.disabled);

  for (let i = 0; i < activeFeeds.length; i += BATCH_SIZE) {
    const batch = activeFeeds.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(batch.map(async (feed) => {
      const sourceKey = `rss_${feed.name}`;
      try {
        const parsed = await parser.parseURL(feed.url);
        const { markManyAsSeen } = require('../utils/storage');
        // Marquer uniquement les articles de plus de 24h comme vus
        const oldIds = (parsed.items || [])
          .filter(item => {
            const pub = item.pubDate ? new Date(item.pubDate).getTime() : 0;
            return pub > 0 && pub < cutoff;
          })
          .map(getItemId)
          .filter(Boolean);
        if (oldIds.length > 0) markManyAsSeen(sourceKey, oldIds);
        feedStats[feed.name] = { ok: true, lastCheck: new Date() };
      } catch (err) {
        feedStats[feed.name] = { ok: false, error: err.message, lastCheck: new Date() };
        logger.warn(`[RSS Init] Erreur sur "${feed.name}": ${err.message}`);
      }
    }));
    if (i + BATCH_SIZE < activeFeeds.length) {
    }
  }

  const ok = Object.values(feedStats).filter(s => s.ok).length;
  const ko = Object.values(feedStats).filter(s => !s.ok).length;
  logger.success(`[RSS] Initialisation terminée: ${ok} flux OK, ${ko} flux en erreur`);
}

function getFeedStats() {
  return feedStats;
}

module.exports = { fetchAllFeeds, initializeFeeds, getFeedStats };
