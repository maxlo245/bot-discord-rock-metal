// test-annonce.js — Poste une annonce de test dans ton channel Discord
// Usage: node test-annonce.js

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { buildNewsEmbed } = require('./src/utils/embed');

const CHANNEL_ID = '1507524438990786693';

// ─── Faux article de test ─────────────────────────────────────────────────────
const fakeItem = {
  title: '🔥 [TEST] Metallica annonce un nouvel album "Death Magnetic II"',
  link: 'https://www.blabbermouth.net',
  contentSnippet: 'Metallica a officiellement annoncé la sortie de leur prochain album studio prévu pour l\'automne 2026. L\'album contiendra 12 nouvelles chansons enregistrées à San Francisco.',
  pubDate: new Date().toISOString(),
  enclosure: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Metallica_at_The_O2_Arena_London_2008.jpg/320px-Metallica_at_The_O2_Arena_London_2008.jpg' },
};

const fakeFeed = {
  name: 'Blabbermouth',
  icon: '🎸',
  category: 'metal',
  url: 'https://www.blabbermouth.net',
};

// ─── Connexion et envoi ───────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) throw new Error('Channel introuvable');

    const embed = buildNewsEmbed(fakeItem, fakeFeed);
    await channel.send({ embeds: [embed] });
    console.log('✅ Annonce de test envoyée dans #' + channel.name);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }

  client.destroy();
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
