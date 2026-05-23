// ecosystem.config.js — Configuration PM2 pour le bot Metal & Rock

module.exports = {
  apps: [
    {
      name: 'bot-metal',
      script: 'src/index.js',
      cwd: __dirname,

      // ─── Redémarrage automatique ──────────────────────────────────────────
      autorestart: true,           // redémarre si crash
      watch: false,                // ne surveille PAS les fichiers (évite boucle)
      max_memory_restart: '300M',  // redémarre si > 300 Mo RAM

      // ─── Délai entre redémarrages (évite boucle infinie) ─────────────────
      restart_delay: 5000,         // attend 5s avant de relancer
      max_restarts: 10,            // max 10 redémarrages consécutifs
      min_uptime: '30s',           // doit tenir 30s pour réinitialiser le compteur

      // ─── Variables d'environnement ────────────────────────────────────────
      env: {
        NODE_ENV: 'production',
      },

      // ─── Logs ─────────────────────────────────────────────────────────────
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,

      // ─── Interpréteur ─────────────────────────────────────────────────────
      interpreter: 'node',
    },
  ],
};
