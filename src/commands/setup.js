// src/commands/setup.js
// Commande /setup — configure le canal d'annonces pour un serveur

const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { setGuildConfig, getGuildConfig } = require('../utils/storage');
const colors = require('../config/colors');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure le bot Metal & Rock pour ce serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub.setName('channel')
        .setDescription('Définit le canal où seront postées les annonces')
        .addChannelOption(opt =>
          opt.setName('canal')
            .setDescription('Canal texte pour les annonces')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption(opt =>
          opt.setName('role')
            .setDescription('Rôle à mentionner pour les nouvelles sorties (optionnel)')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub.setName('categories')
        .setDescription('Active/désactive des catégories de news')
        .addBooleanOption(opt => opt.setName('metal').setDescription('News Metal').setRequired(false))
        .addBooleanOption(opt => opt.setName('rock').setDescription('News Rock').setRequired(false))
        .addBooleanOption(opt => opt.setName('labels').setDescription('Annonces des labels').setRequired(false))
        .addBooleanOption(opt => opt.setName('spotify').setDescription('Nouvelles sorties Spotify').setRequired(false))
        .addBooleanOption(opt => opt.setName('metalarchives').setDescription('Sorties & nouveaux groupes Metal Archives').setRequired(false))
    )
    .addSubcommand(sub =>
      sub.setName('status')
        .setDescription('Affiche la configuration actuelle du serveur')
    )
    .addSubcommand(sub =>
      sub.setName('reset')
        .setDescription('Réinitialise la configuration du serveur')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (sub === 'channel') {
      const channel = interaction.options.getChannel('canal');
      const role = interaction.options.getRole('role');

      // Vérifier les permissions du bot dans ce canal
      const botMember = interaction.guild.members.me;
      if (!channel.permissionsFor(botMember).has(['SendMessages', 'EmbedLinks'])) {
        return interaction.reply({
          content: `❌ Je n'ai pas les permissions **Envoyer des messages** et **Intégrer des liens** dans ${channel}.`,
          ephemeral: true,
        });
      }

      setGuildConfig(guildId, {
        channelId: channel.id,
        roleId: role?.id || null,
        categories: { metal: true, rock: true, labels: true, spotify: true, metalarchives: true },
      });

      const embed = new EmbedBuilder()
        .setColor(colors.METAL)
        .setTitle('✅ Configuration sauvegardée')
        .setDescription(`Les annonces Metal & Rock seront postées dans ${channel}.`)
        .addFields(
          { name: '📢 Canal', value: `${channel}`, inline: true },
          { name: '🔔 Rôle', value: role ? `${role}` : 'Aucun', inline: true },
        )
        .setFooter({ text: 'Utilise /setup categories pour filtrer les catégories' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'categories') {
      const config = getGuildConfig(guildId);
      if (!config?.channelId) {
        return interaction.reply({
          content: '❌ Configure d\'abord un canal avec `/setup channel`.',
          ephemeral: true,
        });
      }

      const updates = {};
      for (const cat of ['metal', 'rock', 'labels', 'spotify', 'metalarchives']) {
        const val = interaction.options.getBoolean(cat);
        if (val !== null) updates[cat] = val;
      }

      const newCategories = { ...(config.categories || {}), ...updates };
      setGuildConfig(guildId, { categories: newCategories });

      const lines = Object.entries(newCategories)
        .map(([k, v]) => `${v ? '✅' : '❌'} **${k}**`)
        .join('\n');

      const embed = new EmbedBuilder()
        .setColor(colors.METAL)
        .setTitle('⚙️ Catégories mises à jour')
        .setDescription(lines)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'status') {
      const config = getGuildConfig(guildId);
      if (!config) {
        return interaction.reply({
          content: '⚠️ Aucune configuration. Utilise `/setup channel` pour commencer.',
          ephemeral: true,
        });
      }

      const channel = config.channelId ? `<#${config.channelId}>` : '❌ Non défini';
      const role = config.roleId ? `<@&${config.roleId}>` : 'Aucun';
      const cats = config.categories || {};

      const embed = new EmbedBuilder()
        .setColor(colors.METAL)
        .setTitle('🤘 Configuration du serveur')
        .addFields(
          { name: '📢 Canal', value: channel, inline: true },
          { name: '🔔 Rôle', value: role, inline: true },
          { name: '⚙️ Catégories', value: Object.entries(cats).map(([k, v]) => `${v ? '✅' : '❌'} ${k}`).join('\n') || 'Toutes actives', inline: false },
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === 'reset') {
      const { removeGuildConfig } = require('../utils/storage');
      removeGuildConfig(guildId);
      return interaction.reply({
        content: '✅ Configuration réinitialisée. Utilise `/setup channel` pour reconfigurer.',
        ephemeral: true,
      });
    }
  },
};
