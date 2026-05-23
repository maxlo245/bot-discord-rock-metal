// generate-avatar.js — Génère l'avatar du bot (skull metal)
// Usage: node generate-avatar.js

const sharp = require('sharp');
const path = require('path');

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#1e0000"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff2200"/>
      <stop offset="60%" stop-color="#cc0000"/>
      <stop offset="100%" stop-color="#440000"/>
    </radialGradient>
    <linearGradient id="metalText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff6644"/>
      <stop offset="40%" stop-color="#cc2200"/>
      <stop offset="100%" stop-color="#880000"/>
    </linearGradient>
    <filter id="redGlow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softGlow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Fond cercle -->
  <circle cx="256" cy="256" r="256" fill="url(#bg)"/>

  <!-- Anneau extérieur -->
  <circle cx="256" cy="256" r="244" fill="none" stroke="#7a0000" stroke-width="5"/>
  <circle cx="256" cy="256" r="236" fill="none" stroke="#cc0000" stroke-width="1.5" opacity="0.4"/>

  <!-- Tête du skull (crâne) -->
  <ellipse cx="256" cy="205" rx="110" ry="108" fill="#120000" stroke="#cc2200" stroke-width="3.5" filter="url(#softGlow)"/>

  <!-- Cheekbones -->
  <ellipse cx="175" cy="248" rx="30" ry="18" fill="#0d0000" stroke="#991100" stroke-width="2"/>
  <ellipse cx="337" cy="248" rx="30" ry="18" fill="#0d0000" stroke="#991100" stroke-width="2"/>

  <!-- Orbites des yeux -->
  <ellipse cx="220" cy="200" rx="36" ry="32" fill="#000000" stroke="#cc0000" stroke-width="2"/>
  <ellipse cx="292" cy="200" rx="36" ry="32" fill="#000000" stroke="#cc0000" stroke-width="2"/>

  <!-- Lueur rouge dans les yeux -->
  <ellipse cx="220" cy="200" rx="26" ry="22" fill="url(#eyeGlow)" opacity="0.9" filter="url(#redGlow)"/>
  <ellipse cx="292" cy="200" rx="26" ry="22" fill="url(#eyeGlow)" opacity="0.9" filter="url(#redGlow)"/>

  <!-- Reflet yeux -->
  <ellipse cx="213" cy="193" rx="8" ry="6" fill="#ff8866" opacity="0.7"/>
  <ellipse cx="285" cy="193" rx="8" ry="6" fill="#ff8866" opacity="0.7"/>

  <!-- Cavité nasale -->
  <path d="M 248,235 L 256,255 L 264,235 Q 260,230 256,232 Q 252,230 248,235 Z" fill="#000000"/>

  <!-- Mâchoire -->
  <path d="M 163,262 Q 160,310 175,330 Q 210,355 256,356 Q 302,355 337,330 Q 352,310 349,262 Z"
        fill="#0d0000" stroke="#cc2200" stroke-width="3"/>

  <!-- Fissure sur le crâne -->
  <path d="M 256,97 L 260,130 L 252,160 L 258,190 L 254,210" fill="none" stroke="#aa1100" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Dents -->
  <rect x="192" y="318" width="22" height="32" rx="4" ry="8" fill="#d4cfc8" stroke="#999" stroke-width="1"/>
  <rect x="218" y="320" width="22" height="34" rx="4" ry="8" fill="#e0dbd4" stroke="#999" stroke-width="1"/>
  <rect x="244" y="321" width="24" height="35" rx="4" ry="8" fill="#e8e4de" stroke="#999" stroke-width="1"/>
  <rect x="272" y="320" width="22" height="34" rx="4" ry="8" fill="#e0dbd4" stroke="#999" stroke-width="1"/>
  <rect x="298" y="318" width="22" height="32" rx="4" ry="8" fill="#d4cfc8" stroke="#999" stroke-width="1"/>

  <!-- Séparation gencive/dents -->
  <line x1="168" y1="320" x2="344" y2="320" stroke="#880000" stroke-width="2"/>

  <!-- Texte METAL -->
  <text x="256" y="415"
        font-family="Arial Black, Impact, sans-serif"
        font-size="58"
        font-weight="900"
        fill="url(#metalText)"
        text-anchor="middle"
        letter-spacing="8"
        filter="url(#softGlow)">METAL</text>

  <!-- Ligne décorative -->
  <line x1="105" y1="427" x2="407" y2="427" stroke="#880000" stroke-width="1.5"/>

  <!-- Étoiles décoratives -->
  <polygon points="118,422 122,432 132,432 124,438 127,448 118,442 109,448 112,438 104,432 114,432"
           fill="#cc0000" opacity="0.8"/>
  <polygon points="394,422 398,432 408,432 400,438 403,448 394,442 385,448 388,438 380,432 390,432"
           fill="#cc0000" opacity="0.8"/>

  <!-- Texte & ROCK -->
  <text x="256" y="470"
        font-family="Arial Black, Impact, sans-serif"
        font-size="38"
        font-weight="900"
        fill="#888888"
        text-anchor="middle"
        letter-spacing="5">&amp; ROCK</text>
</svg>`;

(async () => {
  const outputPath = path.join(__dirname, 'avatar.png');
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  console.log('✅ avatar.png généré avec succès !');
  console.log('📁 Chemin:', outputPath);
})().catch(err => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});
