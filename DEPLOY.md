# Déploiement 24/7 — Bot Discord Metal & Rock

## Option recommandée : Railway.app

Railway détecte automatiquement Node.js et lance `npm start` depuis GitHub.
**Coût** : ~$5 crédit offert/mois (largement suffisant pour un bot Discord).

### Étapes

1. **Créer un compte** sur [railway.app](https://railway.app) (login GitHub)

2. **Nouveau projet**
   - Dashboard → **New Project** → **Deploy from GitHub repo**
   - Sélectionner `maxlo245/bot-discord-rock-metal`
   - Railway détecte Node.js et installe les dépendances automatiquement

3. **Ajouter les variables d'environnement**
   - Onglet **Variables** du service → **Raw Editor** → coller :
   ```
   DISCORD_TOKEN=<ton token>
   DISCORD_CLIENT_ID=<ton client id>
   DISCORD_GUILD_ID=1507524438235549727
   SPOTIFY_CLIENT_ID=<ton id spotify>
   SPOTIFY_CLIENT_SECRET=<ton secret spotify>
   LASTFM_API_KEY=<ta clé lastfm>
   RSS_INTERVAL_MINUTES=2
   SPOTIFY_INTERVAL_MINUTES=2
   LASTFM_INTERVAL_MINUTES=2
   METALARCHIVES_INTERVAL_MINUTES=60
   ```

4. **Déploiement automatique**
   - Railway lance `npm start` (= `node src/index.js`)
   - Chaque `git push` sur `main` redéploie automatiquement

5. **Vérifier les logs**
   - Onglet **Deployments** → cliquer sur le déploiement actif → onglet **Logs**
   - Tu dois voir : `✅ Bot connecté en tant que bot rock/metal#9450`

---

## Option gratuite : Discloud.app

Hébergement gratuit spécialisé pour les bots Discord.

1. Créer un compte sur [discloud.app](https://discloud.app)
2. Créer un fichier `discloud.config` à la racine :
   ```
   ID=metal-rock-bot
   TYPE=bot
   MAIN=src/index.js
   RAM=256
   AUTORESTART=true
   VERSION=current
   ```
3. Zipper le projet **sans** `node_modules/` et `.env`
4. Upload sur Discloud → onglet **Apps** → **Upload**
5. Ajouter les variables d'environnement dans le panel Discloud

---

## Option VPS (contrôle total) : Oracle Cloud Free Tier

Oracle offre **2 VMs ARM gratuites à vie** (4 OCPU, 24 GB RAM).

1. Créer un compte sur [cloud.oracle.com](https://cloud.oracle.com) (carte bancaire requise, pas de débit)
2. Créer une instance Ubuntu ARM
3. Installer Node.js et PM2 :
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
4. Cloner le repo :
   ```bash
   git clone https://github.com/maxlo245/bot-discord-rock-metal.git
   cd bot-discord-rock-metal
   npm install
   cp .env.example .env
   nano .env  # Remplir les vraies valeurs
   ```
5. Lancer avec PM2 :
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

---

## Persistance des données

Sur Railway et Discloud, le fichier `data/seen.json` (cache de déduplication) est **éphémère** — il se recrée à chaque déploiement. Ce n'est pas un problème : au démarrage, `initializeFeeds()` marque tous les articles existants comme déjà vus sans les poster.

`data/config.json` (ID canal Discord) est versionné dans git et sera disponible.
