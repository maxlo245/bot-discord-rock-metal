// src/commands/check.js
// Commande /check — force une vérification immédiate de toutes les sources

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('Force une vérification immédiate de toutes les sources')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName('source')
        .setDescription('Source spécifique à vérifier')
        .setRequired(false)
        .addChoices(
          { name: 'RSS (tous les flux)', value: 'rss' },
          { name: 'Spotify', value: 'spotify' },
          { name: 'Last.fm', value: 'lastfm' },
          { name: 'Metal Archives', value: 'metalarchives' },
          { name: 'Toutes les sources', value: 'all' },
        )
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const source = interaction.options.getString('source') || 'all';

    // Le scheduler est accessible via le client
    const scheduler = interaction.client.scheduler;
    if (!scheduler) {
      return interaction.editReply('❌ Scheduler non disponible.');
    }

    try {
      await interaction.editReply(`🔄 Vérification **${source}** en cours…`);

      let count = 0;
      if (source === 'rss' || source === 'all') {
        count += await scheduler.runRss(interaction.guildId);
      }
      if (source === 'spotify' || source === 'all') {
        count += await scheduler.runSpotify(interaction.guildId);
      }
      if (source === 'lastfm' || source === 'all') {
        count += await scheduler.runLastfm(interaction.guildId);
      }
      if (source === 'metalarchives' || source === 'all') {
        count += await scheduler.runMetalArchives(interaction.guildId);
      }

      return interaction.editReply(
        count > 0
          ? `✅ Vérification terminée: **${count}** nouvelle(s) annonce(s) postée(s).`
          : `✅ Vérification terminée: aucune nouvelle annonce pour le moment.`
      );
    } catch (err) {
      logger.error('[Check] Erreur:', err.message);
      return interaction.editReply(`❌ Erreur lors de la vérification: ${err.message}`);
    }
  },
};
