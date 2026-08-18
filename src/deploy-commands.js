// src/deploy-commands.js
// Déploie les commandes slash manuellement (utile pour dev / reset)
// Usage: node src/deploy-commands.js

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const token    = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId  = process.env.DISCORD_GUILD_ID; // Optionnel: nettoyage des anciennes commandes locales

if (!token || !clientId) {
  console.error('❌ DISCORD_TOKEN et DISCORD_CLIENT_ID requis dans .env');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const cmd = require(path.join(commandsPath, file));
  if (cmd.data) commands.push(cmd.data.toJSON());
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`🔄 Déploiement de ${commands.length} commande(s)...`);

    // Une seule portée évite que Discord affiche chaque commande deux fois.
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('✅ Commandes déployées globalement (peut prendre jusqu\'à 1 heure)');

    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
      console.log(`✅ Anciennes commandes locales supprimées du serveur ${guildId}`);
    }
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
})();
