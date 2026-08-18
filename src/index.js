// src/index.js
// Point d'entrée principal du bot Metal & Rock Discord

require('dotenv').config();

const { Client, GatewayIntentBits, Collection, REST, Routes, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const Scheduler = require('./scheduler');
const { RSS_FEEDS } = require('./config/feeds');
let statusInterval = null;

// ─── Validation de l'environnement ───────────────────────────────────────────
if (!process.env.DISCORD_TOKEN) {
  logger.error('DISCORD_TOKEN manquant dans .env !');
  process.exit(1);
}
if (!process.env.DISCORD_CLIENT_ID) {
  logger.error('DISCORD_CLIENT_ID manquant dans .env !');
  process.exit(1);
}

// ─── Création du client Discord ──────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

// ─── Chargement des commandes ─────────────────────────────────────────────────
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
    logger.info(`[Commands] Chargé: /${command.data.name}`);
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────
client.once('ready', async () => {
  logger.success(`\n${'═'.repeat(50)}`);
  logger.success(`  🤘 Metal & Rock Bot connecté en tant que ${client.user.tag}`);
  logger.success(`  📡 Présent sur ${client.guilds.cache.size} serveur(s)`);
  logger.success(`${'═'.repeat(50)}\n`);

  // Statut tournant
  const activeFeeds = RSS_FEEDS.filter(f => !f.disabled).length;
  const statusMessages = [
    { name: `🤘 ${activeFeeds} flux Metal & Rock actifs`,      type: ActivityType.Watching  },
    { name: '📰 Nouvelles sorties & news 24/7',                type: ActivityType.Watching  },
    { name: '🎸 Metal · Rock · Hardcore · Doom · Black Metal', type: ActivityType.Listening },
    { name: '💀 Metal Archives · Spotify · Last.fm',           type: ActivityType.Watching  },
    { name: '🔔 Tape /help pour commencer',                    type: ActivityType.Playing   },
    { name: `🎵 ${client.guilds.cache.size} serveur(s) écoutent`,type: ActivityType.Listening},
  ];
  let statusIndex = 0;
  const updateStatus = () => {
    const s = statusMessages[statusIndex % statusMessages.length];
    client.user.setPresence({ activities: [s], status: 'online' });
    statusIndex++;
  };
  updateStatus();
  statusInterval = setInterval(updateStatus, 5 * 60 * 1000); // rotation toutes les 5 min

  // Initialiser les services (marquer les items existants comme vus)
  logger.info('[Init] Initialisation des services...');
  const { initializeFeeds } = require('./services/rss');
  const { initializeSpotify } = require('./services/spotify');
  const { initializeLastfm } = require('./services/lastfm');
  const { initializeMetalArchives } = require('./services/metalArchives');

  await initializeFeeds();
  await initializeSpotify();
  await initializeLastfm();
  await initializeMetalArchives();

  // Démarrer le scheduler
  const scheduler = new Scheduler(client);
  client.scheduler = scheduler;
  scheduler.start();

  logger.success('[Bot] Prêt ! En attente de nouvelles annonces...\n');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`[Commands] Commande inconnue: /${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    logger.error(`[Commands] Erreur /${interaction.commandName}:`, err.message);
    const errorMsg = { content: '❌ Une erreur est survenue.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMsg).catch(() => {});
    } else {
      await interaction.reply(errorMsg).catch(() => {});
    }
  }
});

// Déploiement automatique des commandes au démarrage (en mode guild pour le dev)
async function deployCommands() {
  const commands = client.commands.map(c => c.data.toJSON());
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  try {
    logger.info(`[Deploy] Déploiement de ${commands.length} commande(s) slash...`);
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );
    logger.success('[Deploy] Commandes slash déployées globalement.');

    // Supprime les anciennes commandes de développement qui apparaissent en double
    // à côté des commandes globales dans le serveur configuré.
    if (process.env.DISCORD_GUILD_ID) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
          { body: [] }
        );
        logger.success('[Deploy] Anciennes commandes locales supprimées.');
      } catch (err) {
        logger.warn(`[Deploy] Impossible de supprimer les commandes locales: ${err.message}`);
      }
    }
  } catch (err) {
    logger.error('[Deploy] Erreur déploiement:', err.message);
  }
}

// ─── Arrêt contrôlé et redémarrage supervisé ─────────────────────────────────
let isShuttingDown = false;

function stopBot(exitCode, reason) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info(`[Process] Arrêt du bot (${reason}).`);
  if (statusInterval) clearInterval(statusInterval);
  client.scheduler?.stop();
  client.destroy();
  process.exitCode = exitCode;
  // Évite qu'un handle tiers bloque indéfiniment le redémarrage supervisé.
  setTimeout(() => process.exit(exitCode), 5000).unref();
}

function restartAfterFatalError(type, err) {
  logger.error(`[Process] ${type}:`, err?.message || err);
  // PM2 et Railway relancent le processus après sa sortie avec le code 1.
  stopBot(1, `erreur fatale: ${type}`);
}

process.on('unhandledRejection', (err) => restartAfterFatalError('unhandledRejection', err));
process.on('uncaughtException', (err) => restartAfterFatalError('uncaughtException', err));
process.once('SIGINT', () => stopBot(0, 'SIGINT'));
process.once('SIGTERM', () => stopBot(0, 'SIGTERM'));

// Evite le crash si discord.js émet un event 'error' sans listener
client.on('error', (err) => {
  logger.error('[Discord] Erreur client:', err?.message || err);
});
client.on('warn', (msg) => {
  logger.warn('[Discord] Avertissement:', msg);
});

// ─── Connexion ────────────────────────────────────────────────────────────────
(async () => {
  await deployCommands();
  await client.login(process.env.DISCORD_TOKEN);
})();
