# 🤘 Metal & Rock Discord Bot

Bot Discord qui surveille **toutes les plateformes** pour annoncer en temps réel :
- 📰 News & articles des webzines Metal/Rock
- 💿 Nouvelles sorties d'albums (Spotify, Last.fm, Metal Archives)
- 🆕 Nouveaux groupes enregistrés sur Metal Archives
- 🏷️ Annonces des grands labels (Nuclear Blast, Metal Blade, Season of Mist, etc.)

---

## 📡 Sources surveillées

| Type | Sources |
|------|---------|
| 🎸 Webzines Metal | Blabbermouth, Metal Injection, MetalSucks, Angry Metal Guy, No Clean Singing, Decibel, Bravewords, Metal Storm… |
| 🪨 Sites Rock | Loudwire, Kerrang!, NME, Consequence of Sound, Alt Press, Louder Sound, Rock Sound, Revolver… |
| 🏷️ Labels | Nuclear Blast, Metal Blade, Century Media, Roadrunner, Season of Mist, Napalm Records, Earache, Relapse… |
| 🟢 Spotify | Nouvelles sorties filtrées par genres Metal/Rock |
| 🔴 Last.fm | Albums par tags metal, heavy metal, rock… |
| 💀 Metal Archives | Nouvelles sorties & nouveaux groupes (Encyclopaedia Metallum) |

**Total : 40+ sources RSS + 3 plateformes**

---

## ⚙️ Installation

### 1. Prérequis
- [Node.js](https://nodejs.org/) v18 ou supérieur
- Un bot Discord (créé sur [Discord Developer Portal](https://discord.com/developers/applications))

### 2. Cloner et installer
```bash
cd "bot discord"
npm install
```

### 3. Configurer le fichier `.env`
```bash
cp .env.example .env
```
Remplis les valeurs dans `.env` :

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `DISCORD_TOKEN` | Token du bot Discord | ✅ |
| `DISCORD_CLIENT_ID` | ID de l'application Discord | ✅ |
| `SPOTIFY_CLIENT_ID` | ID client Spotify | ⚪ Optionnel |
| `SPOTIFY_CLIENT_SECRET` | Secret client Spotify | ⚪ Optionnel |
| `LASTFM_API_KEY` | Clé API Last.fm | ⚪ Optionnel |

### 4. Permissions du bot Discord
Dans le Developer Portal, active les **Privileged Gateway Intents** :
- ✅ aucun intent privilégié requis (le bot n'a besoin que des événements de guilde)

OAuth2 Scopes nécessaires :
- `bot`
- `applications.commands`

Permissions bot :
- `Send Messages`
- `Embed Links`
- `Read Message History`

### 5. Démarrer
```bash
npm start
```

---

## 🎮 Commandes

| Commande | Description |
|----------|-------------|
| `/setup channel #canal` | Définit le canal d'annonces |
| `/setup categories` | Active/désactive des catégories |
| `/setup status` | Voir la configuration du serveur |
| `/setup reset` | Réinitialiser la configuration |
| `/sources` | Lister toutes les sources |
| `/status` | Statut et stats du bot |
| `/check [source]` | Forcer une vérification immédiate |
| `/help` | Aide complète |

---

## ⏱️ Veille continue

- Le flux RSS est vérifié toutes les **2 minutes** par défaut, et ne peut pas dépasser **5 minutes** : les décès et annonces critiques sont triés et publiés en premier, avec mention du rôle configuré.
- Un embed **« L'essentiel Metal & Rock »** est envoyé chaque jour à `19:00` (heure de Paris par défaut) avec les informations RSS livrées durant les dernières 24 heures et l'URL de chaque article.
- Pour que cette veille fonctionne 24/7, déploie le bot sur Railway, Discloud ou un VPS avec PM2 : voir [DEPLOY.md](DEPLOY.md).

Les variables `RSS_INTERVAL_MINUTES`, `DAILY_DIGEST_HOUR` et `DAILY_DIGEST_TIMEZONE` permettent d'adapter ces réglages. L'intervalle RSS reste plafonné à 5 minutes.

---

## 📋 Obtenir les clés API (optionnel)

### Spotify
1. Va sur [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Crée une application
3. Copie `Client ID` et `Client Secret`

### Last.fm
1. Va sur [last.fm/api/account/create](https://www.last.fm/api/account/create)
2. Crée une application
3. Copie la `API Key`

---

## 🗂️ Structure du projet

```
bot discord/
├── src/
│   ├── index.js              ← Point d'entrée
│   ├── scheduler.js          ← Tâches planifiées
│   ├── deploy-commands.js    ← Déploiement des commandes slash
│   ├── commands/
│   │   ├── setup.js          ← /setup
│   │   ├── help.js           ← /help
│   │   ├── status.js         ← /status
│   │   ├── sources.js        ← /sources
│   │   └── check.js          ← /check
│   ├── services/
│   │   ├── rss.js            ← Flux RSS (40+ sources)
│   │   ├── spotify.js        ← Nouvelles sorties Spotify
│   │   ├── lastfm.js         ← Last.fm API
│   │   └── metalArchives.js  ← Metal Archives scraper
│   ├── config/
│   │   ├── feeds.js          ← Liste des flux RSS + genres
│   │   └── colors.js         ← Couleurs des embeds
│   └── utils/
│       ├── embed.js          ← Constructeurs d'embeds Discord
│       ├── storage.js        ← Persistance JSON
│       └── logger.js         ← Logger coloré
└── data/
    ├── config.json           ← Config par serveur
    └── seen.json             ← Items déjà annoncés
```
