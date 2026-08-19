// src/utils/embed.js
// Constructeurs d'embeds Discord pour chaque type d'annonce

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const colors = require('../config/colors');
const { detectGenre } = require('./genreDetector');

/**
 * Tronque un texte à maxLen caractères.
 */
function truncate(text, maxLen = 300) {
  if (!text) return '';
  const clean = text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
  return clean.length > maxLen ? clean.slice(0, maxLen - 1) + '…' : clean;
}

// Badge de catégorie
const CATEGORY_LABELS = {
  metal: '🤘 METAL',
  rock:  '🎸 ROCK',
  label: '🏷️ LABEL',
};

// Préfixe émoji selon le contenu du titre (priorité)
function getPriorityPrefix(title) {
  const t = title.toLowerCase();
  if (/new album|nouvel album|announce[sd]?|annonce/.test(t)) return '🔥';
  if (/tour|tournée/.test(t))                                  return '🎟️';
  if (/new single|single|ep/.test(t))                         return '🎵';
  if (/new video|official video|lyric video/.test(t))         return '🎬';
  if (/break[s]? up|disband|réunion|reunion/.test(t))         return '⚡';
  if (/death|passes? away|décède/.test(t))                    return '🕯️';
  if (/sign[s]? to|signed to/.test(t))                        return '✍️';
  return '📰';
}

/**
 * Embed pour une news RSS (article de webzine / label)
 */
function buildNewsEmbed(item, feed) {
  const title   = truncate(item.title, 256);
  const desc    = truncate(item.contentSnippet || item.summary || item.content || '', 400);
  const url     = item.link || item.url || null;
  const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
  const prefix  = getPriorityPrefix(title);

  // Détection du genre
  const genreInfo = detectGenre(item, feed);

  // Image de l'article
  const imageUrl =
    item.enclosure?.url ||
    item.itunes?.image ||
    item.mediaThumbnail?.$ ?.url ||
    item.mediaContent?.$ ?.url ||
    null;

  const embed = new EmbedBuilder()
    .setColor(genreInfo.color)
    .setAuthor({
      name: `${feed.icon || '🎸'}  ${feed.name}`,
    })
    .setTitle(`${prefix}  ${title}`)
    .setURL(url)
    .setTimestamp(pubDate);

  if (desc) {
    embed.setDescription(`> ${desc}`);
  }

  // Champ genre / sous-genre
  embed.addFields({
    name: '🎵 Genre',
    value: `**${genreInfo.genre}**${genreInfo.subgenre !== genreInfo.genre ? `  ›  ${genreInfo.subgenre}` : ''}`,
    inline: true,
  });

  if (imageUrl) {
    embed.setImage(imageUrl);
  }

  const dateStr = pubDate.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    timeZone: 'Europe/Paris',
  });
  embed.setFooter({ text: `${genreInfo.icon}  ${genreInfo.subgenre}  ·  📅 ${dateStr}` });

  return embed;
}

/**
 * Embed quotidien des actualités RSS livrées au cours des dernières 24 heures.
 */
function buildDailyDigestEmbed(items) {
  const byImportanceAndRecency = (a, b) => {
    const importance = Number(Boolean(b.urgent)) - Number(Boolean(a.urgent))
      || Number(Boolean(b.priority)) - Number(Boolean(a.priority));
    if (importance) return importance;
    return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
  };
  const essentialItems = items.filter(entry => entry.urgent || entry.priority);
  const selectedItems = [
    ...essentialItems.sort(byImportanceAndRecency),
    ...items.filter(entry => !entry.urgent && !entry.priority).sort(byImportanceAndRecency),
  ].slice(0, 10);
  const lines = selectedItems.map(entry => {
    const title = truncate(entry.title, 180).replace(/[[\]]/g, '\\$&');
    const source = truncate(entry.source, 60);
    return entry.link
      ? `• [${title}](${entry.link}) — ${source}\n  🔗 <${entry.link}>`
      : `• **${title}** — ${source}`;
  });

  return new EmbedBuilder()
    .setColor(colors.METAL)
    .setTitle('📋 L’essentiel Metal & Rock — dernières 24 h')
    .setDescription(lines.join('\n') || 'Aucune actualité essentielle n’a été publiée au cours des dernières 24 heures.')
    .setFooter({ text: `${selectedItems.length} information(s) essentielle(s) sélectionnée(s) parmi ${items.length} · Les alertes critiques restent immédiates.` })
    .setTimestamp();
}

/**
 * Embed pour une sortie d'album Spotify
 */
function buildSpotifyReleaseEmbed(album) {
  const artists = album.artists.map(a => a.name).join(', ');
  const embed = new EmbedBuilder()
    .setColor(colors.SPOTIFY)
    .setTitle(`💿 NOUVELLE SORTIE — ${artists} — ${album.name}`)
    .setURL(album.external_urls?.spotify || null)
    .addFields(
      { name: '🎤 Artiste(s)', value: artists, inline: true },
      { name: '📅 Date', value: album.release_date || 'Inconnue', inline: true },
      { name: '📀 Type', value: translateAlbumType(album.album_type), inline: true },
    )
    .setFooter({ text: '🟢 Spotify New Releases' })
    .setTimestamp();

  if (album.images?.[0]?.url) {
    embed.setThumbnail(album.images[0].url);
  }

  return embed;
}

/**
 * Embed pour une sortie d'album Last.fm
 */
function buildLastfmReleaseEmbed(album) {
  const embed = new EmbedBuilder()
    .setColor(colors.LASTFM)
    .setTitle(`💿 NOUVELLE SORTIE — ${album.artist} — ${album.name}`)
    .setURL(album.url || null)
    .addFields(
      { name: '🎤 Artiste', value: album.artist, inline: true },
    )
    .setFooter({ text: '🔴 Last.fm New Releases' })
    .setTimestamp();

  if (album.image) {
    embed.setThumbnail(album.image);
  }

  return embed;
}

/**
 * Embed pour une sortie Metal Archives
 */
function buildMetalArchivesReleaseEmbed(release) {
  const embed = new EmbedBuilder()
    .setColor(colors.RELEASE)
    .setTitle(`🤘 NOUVELLE SORTIE METAL — ${release.band} — ${release.title}`)
    .setURL(release.url || null)
    .addFields(
      { name: '🎤 Groupe', value: release.band, inline: true },
      { name: '📀 Type', value: release.type || 'Album', inline: true },
      { name: '📅 Date', value: release.date || 'À venir', inline: true },
      { name: '🎵 Genre', value: release.genre || 'Metal', inline: true },
      { name: '🏷️ Label', value: release.label || 'Inconnu', inline: true },
    )
    .setFooter({ text: '💀 Metal Archives (Encyclopaedia Metallum)' })
    .setTimestamp();

  if (release.cover) {
    embed.setThumbnail(release.cover);
  }

  return embed;
}

/**
 * Embed de statut du bot
 */
function buildStatusEmbed(stats) {
  const embed = new EmbedBuilder()
    .setColor(colors.METAL)
    .setTitle('🤘 Metal & Rock Bot — Statut')
    .addFields(
      { name: '📡 Flux RSS surveillés', value: String(stats.feedCount), inline: true },
      { name: '🟢 Flux actifs', value: String(stats.activeFeedCount), inline: true },
      { name: '🔴 Flux en erreur', value: String(stats.errorFeedCount), inline: true },
      { name: '📰 Items traités', value: String(stats.totalSeen), inline: true },
      { name: '⏰ Prochain check RSS', value: stats.nextRssCheck || 'N/A', inline: true },
      { name: '⏰ Prochain check Spotify', value: stats.nextSpotifyCheck || 'N/A', inline: true },
    )
    .setFooter({ text: 'Metal & Rock Bot v1.0.0' })
    .setTimestamp();

  return embed;
}

function translateAlbumType(type) {
  const map = { album: 'Album complet', single: 'Single', ep: 'EP', compilation: 'Compilation' };
  return map[type?.toLowerCase()] || type || 'Album';
}

/**
 * Génère une ligne de boutons "Écouter sur..." pour une sortie.
 * @param {string} artist  Nom de l'artiste / groupe
 * @param {string} title   Titre de l'album / EP / single
 * @returns {ActionRowBuilder[]}
 */
function buildReleaseComponents(artist, title) {
  const query = encodeURIComponent(`${artist} ${title}`);
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Spotify')
      .setEmoji('🟢')
      .setStyle(ButtonStyle.Link)
      .setURL(`https://open.spotify.com/search/${query}`),
    new ButtonBuilder()
      .setLabel('YouTube')
      .setEmoji('▶️')
      .setStyle(ButtonStyle.Link)
      .setURL(`https://www.youtube.com/results?search_query=${query}`),
    new ButtonBuilder()
      .setLabel('Apple Music')
      .setEmoji('🎵')
      .setStyle(ButtonStyle.Link)
      .setURL(`https://music.apple.com/search?term=${query}`),
  );
  return [row];
}

module.exports = {
  buildNewsEmbed,
  buildDailyDigestEmbed,
  buildSpotifyReleaseEmbed,
  buildLastfmReleaseEmbed,
  buildMetalArchivesReleaseEmbed,
  buildStatusEmbed,
  buildReleaseComponents,
  truncate,
};
