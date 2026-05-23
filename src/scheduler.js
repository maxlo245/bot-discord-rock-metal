// src/scheduler.js
// Gestion des tâches planifiées (RSS, Spotify, Last.fm, Metal Archives)

const cron = require('node-cron');
const { fetchAllFeeds } = require('./services/rss');
const { fetchNewReleases: fetchSpotifyReleases } = require('./services/spotify');
const { fetchNewReleases: fetchLastfmReleases } = require('./services/lastfm');
const { fetchRecentReleases: fetchMARelases, fetchNewBands } = require('./services/metalArchives');
const { buildNewsEmbed, buildSpotifyReleaseEmbed, buildLastfmReleaseEmbed, buildMetalArchivesReleaseEmbed, buildReleaseComponents } = require('./utils/embed');
const { getAllGuilds } = require('./utils/storage');
const { EmbedBuilder } = require('discord.js');
const colors = require('./config/colors');
const logger = require('./utils/logger');

/**
 * Poste un embed dans tous les serveurs configurés qui acceptent cette catégorie.
 * Retourne le nombre de serveurs qui ont reçu le message.
 */
async function broadcastToGuilds(client, embed, category, mentionRole = false, components = null) {
  const guilds = getAllGuilds();
  let count = 0;

  for (const [guildId, config] of Object.entries(guilds)) {
    if (!config?.channelId) continue;

    // Vérifier si la catégorie est activée pour ce serveur
    const cats = config.categories || { metal: true, rock: true, labels: true, spotify: true, metalarchives: true };
    if (cats[category] === false) continue;

    try {
      const channel = await client.channels.fetch(config.channelId).catch(() => null);
      if (!channel) continue;

      const content = (mentionRole && config.roleId) ? `<@&${config.roleId}>` : undefined;
      const payload = { content, embeds: [embed] };
      if (components?.length) payload.components = components;
      await channel.send(payload);
      count++;
    } catch (err) {
      logger.warn(`[Broadcast] Erreur sur le serveur ${guildId}: ${err.message}`);
    }
  }
  return count;
}

/**
 * Catégorie RSS → catégorie config serveur
 */
function feedCategoryToConfigKey(category) {
  if (category === 'metal') return 'metal';
  if (category === 'rock') return 'rock';
  if (category === 'label') return 'labels';
  return 'metal';
}

class Scheduler {
  constructor(client) {
    this.client = client;
    this.jobs = [];
  }

  /**
   * Démarre toutes les tâches planifiées.
   */
  start() {
    const rssMinutes  = parseInt(process.env.RSS_INTERVAL_MINUTES)  || 15;
    const spotMin     = parseInt(process.env.SPOTIFY_INTERVAL_MINUTES) || 60;
    const lastfmMin   = parseInt(process.env.LASTFM_INTERVAL_MINUTES) || 60;
    const maMin       = parseInt(process.env.METALARCHIVES_INTERVAL_MINUTES) || 120;

    // ─── RSS ────────────────────────────────────────────────────────────────
    const rssJob = cron.schedule(`*/${rssMinutes} * * * *`, async () => {
      logger.info('[Scheduler] ▶ Check RSS');
      await this.runRss();
    }, { scheduled: false });
    rssJob.start();
    this.jobs.push(rssJob);

    // ─── SPOTIFY ────────────────────────────────────────────────────────────
    const spotJob = cron.schedule(`*/${spotMin} * * * *`, async () => {
      logger.info('[Scheduler] ▶ Check Spotify');
      await this.runSpotify();
    }, { scheduled: false });
    spotJob.start();
    this.jobs.push(spotJob);

    // ─── LAST.FM ────────────────────────────────────────────────────────────
    const lastfmJob = cron.schedule(`*/${lastfmMin} * * * *`, async () => {
      logger.info('[Scheduler] ▶ Check Last.fm');
      await this.runLastfm();
    }, { scheduled: false });
    lastfmJob.start();
    this.jobs.push(lastfmJob);

    // ─── METAL ARCHIVES ─────────────────────────────────────────────────────
    const maJob = cron.schedule(`*/${maMin} * * * *`, async () => {
      logger.info('[Scheduler] ▶ Check Metal Archives');
      await this.runMetalArchives();
    }, { scheduled: false });
    maJob.start();
    this.jobs.push(maJob);

    logger.success(`[Scheduler] Démarré: RSS/${rssMinutes}min, Spotify/${spotMin}min, Last.fm/${lastfmMin}min, MA/${maMin}min`);
  }

  stop() {
    this.jobs.forEach(j => j.stop());
    logger.info('[Scheduler] Arrêté');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Méthodes publiques (aussi utilisées par /check)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Lance le check RSS et poste les nouveaux items.
   * @param {string|null} targetGuildId — si fourni, poste uniquement sur ce serveur
   * @returns {number} nombre d'annonces postées
   */
  async runRss(targetGuildId = null) {
    let posted = 0;
    try {
      const items = await fetchAllFeeds();
      for (const { item, feed } of items) {
        const embed = buildNewsEmbed(item, feed);
        const configKey = feedCategoryToConfigKey(feed.category);
        posted += await this._sendToGuilds(embed, configKey, false, targetGuildId);
        // Délai de 10 secondes entre chaque annonce
        await new Promise(r => setTimeout(r, 10000));
      }
    } catch (err) {
      logger.error('[Scheduler] Erreur runRss:', err.message);
    }
    return posted;
  }

  /**
   * Lance le check Spotify.
   */
  async runSpotify(targetGuildId = null) {
    let posted = 0;
    try {
      const albums = await fetchSpotifyReleases();
      for (const album of albums) {
        const embed = buildSpotifyReleaseEmbed(album);
        const artists = album.artists?.map(a => a.name).join(', ') || '';
        const components = buildReleaseComponents(artists, album.name);
        posted += await this._sendToGuilds(embed, 'spotify', true, targetGuildId, components);
        await new Promise(r => setTimeout(r, 10000));
      }
    } catch (err) {
      logger.error('[Scheduler] Erreur runSpotify:', err.message);
    }
    return posted;
  }

  /**
   * Lance le check Last.fm.
   */
  async runLastfm(targetGuildId = null) {
    let posted = 0;
    try {
      const releases = await fetchLastfmReleases();
      for (const release of releases) {
        const embed = buildLastfmReleaseEmbed(release);
        // Mapper lastfm sur la catégorie metal ou rock selon le tag
        const cat = release.tag?.includes('rock') ? 'rock' : 'metal';
        posted += await this._sendToGuilds(embed, cat, false, targetGuildId);
        await new Promise(r => setTimeout(r, 10000));
      }
    } catch (err) {
      logger.error('[Scheduler] Erreur runLastfm:', err.message);
    }
    return posted;
  }

  /**
   * Lance le check Metal Archives (sorties + nouveaux groupes).
   */
  async runMetalArchives(targetGuildId = null) {
    let posted = 0;
    try {
      // Nouvelles sorties
      const releases = await fetchMARelases();
      for (const release of releases) {
        const embed = buildMetalArchivesReleaseEmbed(release);
        const components = buildReleaseComponents(release.band, release.title);
        posted += await this._sendToGuilds(embed, 'metalarchives', true, targetGuildId, components);
        await new Promise(r => setTimeout(r, 10000));
      }

      // Nouveaux groupes
      const newBands = await fetchNewBands();
      for (const band of newBands) {
        const embed = new EmbedBuilder()
          .setColor(colors.NEW_BAND)
          .setTitle(`🆕 NOUVEAU GROUPE — ${band.name}`)
          .setURL(band.url || null)
          .addFields(
            { name: '🌍 Pays', value: band.country || 'Inconnu', inline: true },
            { name: '🎵 Genre', value: band.genre || 'Metal', inline: true },
          )
          .setFooter({ text: '💀 Metal Archives — Nouveau groupe ajouté' })
          .setTimestamp();

        posted += await this._sendToGuilds(embed, 'metalarchives', false, targetGuildId);
        await new Promise(r => setTimeout(r, 300));
      }
    } catch (err) {
      logger.error('[Scheduler] Erreur runMetalArchives:', err.message);
    }
    return posted;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Méthode privée d'envoi
  // ─────────────────────────────────────────────────────────────────────────

  async _sendToGuilds(embed, category, mentionRole, targetGuildId, components = null) {
    if (targetGuildId) {
      // Envoi sur un seul serveur (commande /check)
      const { getGuildConfig } = require('./utils/storage');
      const config = getGuildConfig(targetGuildId);
      if (!config?.channelId) return 0;
      const cats = config.categories || { metal: true, rock: true, labels: true, spotify: true, metalarchives: true };
      if (cats[category] === false) return 0;
      try {
        const channel = await this.client.channels.fetch(config.channelId).catch(() => null);
        if (!channel) return 0;
        const content = (mentionRole && config.roleId) ? `<@&${config.roleId}>` : undefined;
        const payload = { content, embeds: [embed] };
        if (components?.length) payload.components = components;
        await channel.send(payload);
        return 1;
      } catch {
        return 0;
      }
    }
    return broadcastToGuilds(this.client, embed, category, mentionRole, components);
  }
}

module.exports = Scheduler;
