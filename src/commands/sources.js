// src/commands/sources.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { RSS_FEEDS } = require('../config/feeds');
const colors = require('../config/colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sources')
    .setDescription('Liste toutes les sources surveillées par le bot')
    .addStringOption(opt =>
      opt.setName('categorie')
        .setDescription('Filtrer par catégorie')
        .setRequired(false)
        .addChoices(
          { name: '🎸 Metal', value: 'metal' },
          { name: '🪨 Rock', value: 'rock' },
          { name: '🏷️ Labels', value: 'label' },
        )
    ),

  async execute(interaction) {
    const cat = interaction.options.getString('categorie');
    const allActive = RSS_FEEDS.filter(f => !f.disabled);
    const feeds = cat ? allActive.filter(f => f.category === cat) : allActive;

    const grouped = {
      metal: feeds.filter(f => f.category === 'metal'),
      rock:  feeds.filter(f => f.category === 'rock'),
      label: feeds.filter(f => f.category === 'label'),
    };

    const embed = new EmbedBuilder()
      .setColor(colors.METAL)
      .setTitle('📡 Sources surveillées')
      .setDescription(`**${feeds.length}** sources actives`)
      .setTimestamp();

    if (grouped.metal.length > 0) {
      embed.addFields({
        name: `🎸 Webzines Metal (${grouped.metal.length})`,
        value: grouped.metal.map(f => `${f.icon} ${f.name}`).join(' • ').slice(0, 1024),
        inline: false,
      });
    }
    if (grouped.rock.length > 0) {
      embed.addFields({
        name: `🪨 Sites Rock (${grouped.rock.length})`,
        value: grouped.rock.map(f => `${f.icon} ${f.name}`).join(' • ').slice(0, 1024),
        inline: false,
      });
    }
    if (grouped.label.length > 0) {
      embed.addFields({
        name: `🏷️ Labels (${grouped.label.length})`,
        value: grouped.label.map(f => `${f.icon} ${f.name}`).join(' • ').slice(0, 1024),
        inline: false,
      });
    }

    embed.addFields({
      name: '🌐 Plateformes supplémentaires',
      value: '🟢 **Spotify** • 🔴 **Last.fm** • 💀 **Metal Archives (Encyclopaedia Metallum)**',
      inline: false,
    });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
