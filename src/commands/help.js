// src/commands/help.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const colors = require('../config/colors');
const { RSS_FEEDS } = require('../config/feeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche l\'aide du bot Metal & Rock'),

  async execute(interaction) {
    const activeFeeds = RSS_FEEDS.filter(f => !f.disabled);
    const metalCount  = activeFeeds.filter(f => f.category === 'metal').length;
    const rockCount   = activeFeeds.filter(f => f.category === 'rock').length;
    const labelCount  = activeFeeds.filter(f => f.category === 'label').length;
    const activeLabels = activeFeeds
      .filter(f => f.category === 'label')
      .map(f => f.name)
      .join(', ');

    const rssMin  = parseInt(process.env.RSS_INTERVAL_MINUTES)             || 15;
    const spotMin = parseInt(process.env.SPOTIFY_INTERVAL_MINUTES)         || 60;
    const lfmMin  = parseInt(process.env.LASTFM_INTERVAL_MINUTES)          || 60;
    const maMin   = parseInt(process.env.METALARCHIVES_INTERVAL_MINUTES)   || 120;
    const fmtMin  = m => m < 60 ? `toutes les ${m} min` : `toutes les ${m / 60}h`;

    const embed = new EmbedBuilder()
      .setColor(colors.METAL)
      .setTitle('🤘 Metal & Rock Bot — Aide')
      .setDescription(
        'Je surveille en permanence **toutes les plateformes** pour t\'annoncer les nouvelles sorties, ' +
        'les news et les nouveaux groupes Metal & Rock du monde entier.'
      )
      .addFields(
        {
          name: '📡 Sources surveillées',
          value:
            `🎸 **${metalCount}** webzines Metal\n` +
            `🪨 **${rockCount}** sites Rock\n` +
            `🏷️ **${labelCount}** labels (${activeLabels})\n` +
            `🟢 **Spotify** — Nouvelles sorties filtrées par genre\n` +
            `🔴 **Last.fm** — Top albums par tags metal/rock\n` +
            `💀 **Metal Archives** — Sorties & nouveaux groupes`,
          inline: false,
        },
        {
          name: '⚙️ Commandes',
          value:
            '`/setup channel #canal` — Définir le canal d\'annonces\n' +
            '`/setup categories` — Activer/désactiver des catégories\n' +
            '`/setup status` — Voir la configuration\n' +
            '`/setup reset` — Réinitialiser\n' +
            '`/sources` — Lister toutes les sources surveillées\n' +
            '`/status` — Statut et stats du bot\n' +
            '`/check` — Forcer une vérification immédiate\n' +
            '`/help` — Ce message',
          inline: false,
        },
        {
          name: '⏰ Fréquences de vérification',
          value:
            `🔄 **RSS** : ${fmtMin(rssMin)}\n` +
            `🟢 **Spotify** : ${fmtMin(spotMin)}\n` +
            `🔴 **Last.fm** : ${fmtMin(lfmMin)}\n` +
            `💀 **Metal Archives** : ${fmtMin(maMin)}`,
          inline: false,
        },
      )
      .setFooter({ text: `Metal & Rock Bot • ${activeFeeds.length} sources actives • discord.js` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
