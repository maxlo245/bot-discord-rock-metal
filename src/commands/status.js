// src/commands/status.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getFeedStats } = require('../services/rss');
const { buildStatusEmbed } = require('../utils/embed');
const { RSS_FEEDS } = require('../config/feeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Affiche le statut et les statistiques du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const feedStats = getFeedStats();
    const activeFeeds  = RSS_FEEDS.filter(f => !f.disabled);
    const errorFeedCount = Object.values(feedStats).filter(s => !s.ok).length;
    const activeFeedCount = activeFeeds.length - errorFeedCount;

    // Calculer le nombre total d'items vus
    let totalSeen = 0;
    try {
      const fs = require('fs');
      const path = require('path');
      const seenFile = path.join(__dirname, '../../data/seen.json');
      if (fs.existsSync(seenFile)) {
        const seen = JSON.parse(fs.readFileSync(seenFile, 'utf-8'));
        totalSeen = Object.values(seen).reduce((acc, arr) => acc + (arr?.length || 0), 0);
      }
    } catch (_) {}

    const rssMin = parseInt(process.env.RSS_INTERVAL_MINUTES)           || 15;
    const maMin  = parseInt(process.env.METALARCHIVES_INTERVAL_MINUTES) || 120;
    const fmtMin = m => m < 60 ? `${m} min` : `${m / 60}h`;

    const stats = {
      feedCount: activeFeeds.length,
      activeFeedCount,
      errorFeedCount,
      totalSeen,
      nextRssCheck: `Intervalle: ${fmtMin(rssMin)}`,
      nextSpotifyCheck: `Intervalle: ${fmtMin(maMin)} (MA)`,
    };

    // Lister les flux en erreur
    const errFeeds = Object.entries(feedStats)
      .filter(([, s]) => !s.ok)
      .map(([name, s]) => `❌ **${name}**: ${s.error}`)
      .slice(0, 10);

    const embed = buildStatusEmbed(stats);
    if (errFeeds.length > 0) {
      embed.addFields({ name: '⚠️ Flux en erreur', value: errFeeds.join('\n').slice(0, 1000), inline: false });
    }

    return interaction.editReply({ embeds: [embed] });
  },
};
