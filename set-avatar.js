// set-avatar.js — Applique avatar.png comme photo de profil du bot
// Usage: node set-avatar.js

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const avatarPath = path.join(__dirname, 'avatar.png');

if (!fs.existsSync(avatarPath)) {
  console.error('❌ avatar.png introuvable. Lance d\'abord: node generate-avatar.js');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
  try {
    await client.user.setAvatar(avatarPath);
    console.log('✅ Avatar mis à jour avec succès !');
  } catch (err) {
    if (err.message.includes('You are being rate limited')) {
      console.error('⏳ Rate limit Discord — réessaie dans 10 minutes (limite Discord: 2 changements/heure)');
    } else {
      console.error('❌ Erreur:', err.message);
    }
  }
  client.destroy();
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
