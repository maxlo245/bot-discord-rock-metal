// src/utils/genreDetector.js
// Détecte automatiquement le genre/sous-genre d'un article RSS

const { GENRE_PATTERNS, SOURCE_DEFAULT_GENRES, ARTIST_GENRE_OVERRIDES } = require('../config/genres');

/**
 * Détecte le genre et sous-genre d'un article RSS.
 * Cherche d'abord dans le titre, puis dans la description.
 * Retourne le genre le plus spécifique trouvé, sinon le genre par défaut de la source.
 *
 * @param {object} item  - item RSS (title, contentSnippet, etc.)
 * @param {object} feed  - feed config (name, category)
 * @returns {{ genre, subgenre, icon, color }}
 */
function detectGenre(item, feed) {
  const haystack = [
    item.title || '',
    item.contentSnippet || item.summary || '',
    item.content || '',
  ].join(' ');

  // Les artistes connus priment sur le genre supposé de la source RSS.
  for (const artist of ARTIST_GENRE_OVERRIDES) {
    if (artist.pattern.test(haystack)) {
      return {
        genre: artist.genre,
        subgenre: artist.subgenre,
        icon: artist.icon,
        color: artist.color,
      };
    }
  }

  // Parcourir les patterns du plus spécifique au plus générique
  for (const entry of GENRE_PATTERNS) {
    for (const pattern of entry.patterns) {
      if (pattern.test(haystack)) {
        return {
          genre:    entry.genre,
          subgenre: entry.subgenre,
          icon:     entry.icon,
          color:    entry.color,
        };
      }
    }
  }

  // Fallback → genre par défaut de la source
  if (SOURCE_DEFAULT_GENRES[feed.name]) {
    return SOURCE_DEFAULT_GENRES[feed.name];
  }

  // Fallback final selon la catégorie du feed
  if (feed.category === 'metal') return { genre: 'Metal', subgenre: 'Metal',     icon: '🤘', color: 0xe74c3c };
  if (feed.category === 'label') return { genre: 'Metal', subgenre: 'Metal',     icon: '🏷️', color: 0x9b59b6 };
  return                                { genre: 'Rock',  subgenre: 'Rock',       icon: '🎸', color: 0xe67e22 };
}

module.exports = { detectGenre };
