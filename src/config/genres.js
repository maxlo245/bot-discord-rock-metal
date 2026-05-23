// src/config/genres.js
// Taxonomie complète des genres Metal & Rock — 600+ genre/sous-genre combinaisons
// Chaque entrée : { genre, subgenre, icon, color, patterns[] }
// Ordre : du plus spécifique au plus générique (premier match gagne)

const GENRE_PATTERNS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // DEATH METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Death Metal', subgenre: 'Slam Death Metal',          icon: '🔨', color: 0xa93226, patterns: [/slam death(?: metal)?/i, /slam metal/i, /\bslam\b/i] },
  { genre: 'Death Metal', subgenre: 'Technical Death Metal',     icon: '🔩', color: 0xc0392b, patterns: [/technical death(?: metal)?/i, /tech[\s-]?death/i, /techdeath/i, /\btech-dm\b/i] },
  { genre: 'Death Metal', subgenre: 'Melodic Death Metal',       icon: '🎸', color: 0xe74c3c, patterns: [/melodic death(?: metal)?/i, /melodeath/i, /melo[\s-]?death/i, /gothenburg(?: sound)?/i] },
  { genre: 'Death Metal', subgenre: 'Brutal Death Metal',        icon: '💀', color: 0x922b21, patterns: [/brutal death(?: metal)?/i, /\bbdm\b/i, /brutal dm/i] },
  { genre: 'Death Metal', subgenre: 'Old School Death Metal',    icon: '☠️', color: 0xc0392b, patterns: [/old[\s-]?school death/i, /\bosdm\b/i, /\boshm\b/i, /swedish death/i, /florida death/i, /death 'n' roll/i] },
  { genre: 'Death Metal', subgenre: 'Blackened Death Metal',     icon: '🖤', color: 0x5d1a1a, patterns: [/blackened death/i, /black[\s-]?death/i, /blacked death/i] },
  { genre: 'Death Metal', subgenre: 'Progressive Death Metal',   icon: '🌀', color: 0xd98880, patterns: [/prog(?:ressive)? death/i, /progressive death/i, /death.*prog/i] },
  { genre: 'Death Metal', subgenre: 'Death\/Doom Metal',         icon: '⚰️', color: 0x7b241c, patterns: [/death[\s/]?doom/i, /doom[\s/]?death/i] },
  { genre: 'Death Metal', subgenre: 'Goregrind',                 icon: '🩸', color: 0x6e2c00, patterns: [/goregrind/i, /gore.?grind/i, /gore metal/i] },
  { genre: 'Death Metal', subgenre: 'Deathgrind',                icon: '💢', color: 0x6e2c00, patterns: [/deathgrind/i, /death[\s-]?grind/i] },
  { genre: 'Death Metal', subgenre: 'Pornogrind',                icon: '💀', color: 0x6e2c00, patterns: [/pornogrind/i, /porno.?grind/i] },
  { genre: 'Death Metal', subgenre: 'Caveman Death Metal',       icon: '🦴', color: 0xc0392b, patterns: [/caveman death/i] },
  { genre: 'Death Metal', subgenre: 'War Metal',                 icon: '⚔️', color: 0x641e16, patterns: [/war metal/i, /bestial black/i, /bestial death/i, /war black/i] },
  { genre: 'Death Metal', subgenre: 'Death Metal',               icon: '💀', color: 0xc0392b, patterns: [/\bdeath metal\b/i, /death[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLACK METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Black Metal', subgenre: 'Symphonic Black Metal',     icon: '🎻', color: 0x4a235a, patterns: [/symphonic black(?: metal)?/i, /orchestral black/i] },
  { genre: 'Black Metal', subgenre: 'Atmospheric Black Metal',   icon: '🌫️', color: 0x1a1a2e, patterns: [/atmospheric black(?: metal)?/i, /atmo[\s-]?black/i, /atmoblack/i] },
  { genre: 'Black Metal', subgenre: 'Post-Black Metal',          icon: '🌑', color: 0x2c3e50, patterns: [/post[\s-]?black(?: metal)?/i, /blackgaze/i] },
  { genre: 'Black Metal', subgenre: 'DSBM',                      icon: '😔', color: 0x1c1c1c, patterns: [/\bdsbm\b/i, /depressive(?:[\s-]suicidal)? black/i, /suicidal black(?: metal)?/i, /depressive black(?: metal)?/i] },
  { genre: 'Black Metal', subgenre: 'Ambient Black Metal',       icon: '🌌', color: 0x0d0d1a, patterns: [/ambient black(?: metal)?/i] },
  { genre: 'Black Metal', subgenre: 'Blackened Thrash Metal',    icon: '⚡', color: 0x3b1a6b, patterns: [/blackened thrash/i, /black[\s-]?thrash/i, /blackthrash/i] },
  { genre: 'Black Metal', subgenre: 'Blackened Death Metal',     icon: '🖤', color: 0x5d1a1a, patterns: [/blackened death/i] },
  { genre: 'Black Metal', subgenre: 'Raw Black Metal',           icon: '🔴', color: 0x1a1a1a, patterns: [/raw black(?: metal)?/i, /lo[\s-]?fi black/i] },
  { genre: 'Black Metal', subgenre: 'Viking Metal',              icon: '⚔️', color: 0x1a3a5c, patterns: [/viking metal/i, /viking[\s-]?black/i, /norsemen/i] },
  { genre: 'Black Metal', subgenre: 'Pagan Black Metal',         icon: '🌲', color: 0x1a4a1a, patterns: [/pagan black(?: metal)?/i, /pagan[\s-]?metal/i] },
  { genre: 'Black Metal', subgenre: 'Folk Black Metal',          icon: '🪈', color: 0x2a4a2a, patterns: [/folk black(?: metal)?/i] },
  { genre: 'Black Metal', subgenre: 'Cascadian Black Metal',     icon: '🏔️', color: 0x1e3a2a, patterns: [/cascadian black/i, /cascadia/i] },
  { genre: 'Black Metal', subgenre: 'Icelandic Black Metal',     icon: '🧊', color: 0x1a2a3a, patterns: [/icelandic black/i] },
  { genre: 'Black Metal', subgenre: 'Blackened Doom',            icon: '🌑', color: 0x2c1654, patterns: [/blackened doom/i, /black[\s-]?doom/i] },
  { genre: 'Black Metal', subgenre: 'Black\/Death Metal',        icon: '☠️', color: 0x641e16, patterns: [/black\/death/i, /black and death/i] },
  { genre: 'Black Metal', subgenre: 'Norwegian Black Metal',     icon: '🇳🇴', color: 0x1c2833, patterns: [/norwegian black/i, /norsk black/i, /second wave black/i] },
  { genre: 'Black Metal', subgenre: 'Black Metal',               icon: '🖤', color: 0x1c2833, patterns: [/\bblack metal\b/i, /black[\s-]metal/i, /\bnsbm\b/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOOM METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Doom Metal', subgenre: 'Funeral Doom',               icon: '⚰️', color: 0x17202a, patterns: [/funeral doom(?: metal)?/i, /funeral[\s-]doom/i] },
  { genre: 'Doom Metal', subgenre: 'Drone Doom',                 icon: '🔊', color: 0x1b1b1b, patterns: [/drone doom/i, /drone metal/i, /\bdrone\b.*metal/i] },
  { genre: 'Doom Metal', subgenre: 'Sludge Metal',               icon: '🐢', color: 0x2e4057, patterns: [/sludge(?: metal)?/i, /sludge[\s-]doom/i, /southern doom/i, /southern sludge/i] },
  { genre: 'Doom Metal', subgenre: 'Stoner Doom',                icon: '🌿', color: 0x1e8449, patterns: [/stoner doom/i] },
  { genre: 'Doom Metal', subgenre: 'Gothic Doom',                icon: '🥀', color: 0x4a1942, patterns: [/gothic doom/i, /doom[\s-]?gothic/i] },
  { genre: 'Doom Metal', subgenre: 'Death\/Doom',                icon: '⚰️', color: 0x7b241c, patterns: [/death[\s/]doom/i, /doom[\s/]death/i] },
  { genre: 'Doom Metal', subgenre: 'Epic Doom',                  icon: '⚔️', color: 0x5d6d7e, patterns: [/epic doom(?: metal)?/i] },
  { genre: 'Doom Metal', subgenre: 'Traditional Doom',           icon: '🕯️', color: 0x7f8c8d, patterns: [/traditional doom/i, /trad doom/i, /classic doom/i, /proto[\s-]doom/i] },
  { genre: 'Doom Metal', subgenre: 'Occult Doom',                icon: '🔮', color: 0x4a1942, patterns: [/occult doom/i, /occult rock/i] },
  { genre: 'Doom Metal', subgenre: 'Psychedelic Doom',           icon: '🌀', color: 0x1e8449, patterns: [/psychedelic doom/i, /psych doom/i] },
  { genre: 'Doom Metal', subgenre: 'Post-Doom',                  icon: '🌑', color: 0x2c3e50, patterns: [/post[\s-]doom/i] },
  { genre: 'Doom Metal', subgenre: 'Doom Metal',                 icon: '🕯️', color: 0x566573, patterns: [/\bdoom metal\b/i, /doom[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // THRASH METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Thrash Metal', subgenre: 'Technical Thrash Metal',   icon: '⚙️', color: 0xf39c12, patterns: [/technical thrash/i, /tech[\s-]?thrash/i] },
  { genre: 'Thrash Metal', subgenre: 'Bay Area Thrash',          icon: '🌉', color: 0xe67e22, patterns: [/bay area thrash/i, /bay area metal/i, /california thrash/i] },
  { genre: 'Thrash Metal', subgenre: 'Teutonic Thrash',          icon: '🇩🇪', color: 0xe67e22, patterns: [/teutonic thrash/i, /german thrash/i] },
  { genre: 'Thrash Metal', subgenre: 'Brazilian Thrash',         icon: '🇧🇷', color: 0xe67e22, patterns: [/brazilian thrash/i, /brasil thrash/i] },
  { genre: 'Thrash Metal', subgenre: 'Crossover Thrash',         icon: '🤝', color: 0xf0b27a, patterns: [/crossover thrash/i, /crossover[\s-]metal/i, /\bcrossover\b/i] },
  { genre: 'Thrash Metal', subgenre: 'Speed\/Thrash Metal',      icon: '💨', color: 0xf39c12, patterns: [/speed[\s/]thrash/i, /thrash[\s/]speed/i] },
  { genre: 'Thrash Metal', subgenre: 'Groove Metal',             icon: '🎵', color: 0xf39c12, patterns: [/groove metal/i, /\bgroove\b.*metal/i] },
  { genre: 'Thrash Metal', subgenre: 'Thrashcore',               icon: '💥', color: 0xe67e22, patterns: [/thrashcore/i, /thrash[\s-]?hardcore/i] },
  { genre: 'Thrash Metal', subgenre: 'Thrash Metal',             icon: '⚡', color: 0xe67e22, patterns: [/\bthrash metal\b/i, /thrash[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // HEAVY METAL / TRADITIONAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Heavy Metal', subgenre: 'NWOBHM',                    icon: '🇬🇧', color: 0xf1c40f, patterns: [/\bnwobhm\b/i, /new wave of british heavy metal/i] },
  { genre: 'Heavy Metal', subgenre: 'NWOTHM',                    icon: '🆕', color: 0xf1c40f, patterns: [/\bnwothm\b/i, /new wave of traditional heavy metal/i] },
  { genre: 'Heavy Metal', subgenre: 'Glam Metal',                icon: '✨', color: 0xf8c471, patterns: [/glam metal/i, /hair metal/i, /sleaze metal/i, /glam rock.*metal/i, /\bsleaze\b/i] },
  { genre: 'Heavy Metal', subgenre: 'Speed Metal',               icon: '💨', color: 0xf39c12, patterns: [/\bspeed metal\b/i, /speed[\s-]metal/i] },
  { genre: 'Heavy Metal', subgenre: 'Epic Metal',                icon: '⚔️', color: 0xf1c40f, patterns: [/epic metal/i, /epic heavy/i] },
  { genre: 'Heavy Metal', subgenre: 'Proto-Metal',               icon: '🎸', color: 0xd4ac0d, patterns: [/proto[\s-]metal/i, /proto metal/i, /early metal/i, /heavy rock/i] },
  { genre: 'Heavy Metal', subgenre: 'Arena Metal',               icon: '🏟️', color: 0xf1c40f, patterns: [/arena metal/i, /arena rock/i, /stadium metal/i] },
  { genre: 'Heavy Metal', subgenre: 'Traditional Heavy Metal',   icon: '⚙️', color: 0xf1c40f, patterns: [/traditional heavy metal/i, /trad(?:itional)? metal/i, /classic heavy metal/i, /classic metal/i] },
  { genre: 'Heavy Metal', subgenre: 'Heavy Metal',               icon: '⚙️', color: 0xf1c40f, patterns: [/\bheavy metal\b/i, /heavy[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // POWER METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Power Metal', subgenre: 'Symphonic Power Metal',     icon: '🎻', color: 0x8e44ad, patterns: [/symphonic power(?: metal)?/i] },
  { genre: 'Power Metal', subgenre: 'Progressive Power Metal',   icon: '🌀', color: 0x8e44ad, patterns: [/progressive power/i, /prog(?:ressive)?[\s-]power/i] },
  { genre: 'Power Metal', subgenre: 'Neoclassical Metal',        icon: '🎹', color: 0x9b59b6, patterns: [/neoclassical metal/i, /neo[\s-]?classical metal/i, /baroque metal/i] },
  { genre: 'Power Metal', subgenre: 'European Power Metal',      icon: '🇪🇺', color: 0x8e44ad, patterns: [/european power metal/i, /euro power/i, /german power/i] },
  { genre: 'Power Metal', subgenre: 'US Power Metal',            icon: '🇺🇸', color: 0x8e44ad, patterns: [/us power metal/i, /american power metal/i] },
  { genre: 'Power Metal', subgenre: 'Power Metal',               icon: '⚡', color: 0x8e44ad, patterns: [/\bpower metal\b/i, /power[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESSIVE METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Progressive Metal', subgenre: 'Djent',               icon: '🎛️', color: 0x1abc9c, patterns: [/\bdjent\b/i, /djent.?metal/i] },
  { genre: 'Progressive Metal', subgenre: 'Math Metal',          icon: '📐', color: 0x1abc9c, patterns: [/math metal/i, /math[\s-]?core/i, /\bmathcore\b/i] },
  { genre: 'Progressive Metal', subgenre: 'Avant-Garde Metal',   icon: '🎭', color: 0x148f77, patterns: [/avant[\s-]?garde metal/i, /avantgarde metal/i, /experimental metal/i] },
  { genre: 'Progressive Metal', subgenre: 'Progressive Death Metal', icon: '🌀', color: 0x1abc9c, patterns: [/prog(?:ressive)? death/i] },
  { genre: 'Progressive Metal', subgenre: 'Progressive Thrash',  icon: '⚙️', color: 0x1abc9c, patterns: [/prog(?:ressive)? thrash/i] },
  { genre: 'Progressive Metal', subgenre: 'Progressive Metal',   icon: '🌀', color: 0x1abc9c, patterns: [/prog(?:ressive)? metal/i, /progressive metal/i, /\bprog metal\b/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // SYMPHONIC METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Symphonic Metal', subgenre: 'Orchestral Metal',      icon: '🎼', color: 0x7d3c98, patterns: [/orchestral metal/i, /orchestral[\s-]rock/i] },
  { genre: 'Symphonic Metal', subgenre: 'Symphonic Death Metal',  icon: '💀', color: 0x7d3c98, patterns: [/symphonic death metal/i] },
  { genre: 'Symphonic Metal', subgenre: 'Symphonic Black Metal',  icon: '🎻', color: 0x4a235a, patterns: [/symphonic black(?: metal)?/i] },
  { genre: 'Symphonic Metal', subgenre: 'Symphonic Gothic Metal', icon: '🥀', color: 0x6c3483, patterns: [/symphonic gothic(?: metal)?/i] },
  { genre: 'Symphonic Metal', subgenre: 'Symphonic Metal',        icon: '🎻', color: 0x7d3c98, patterns: [/symphonic metal/i, /symphonic[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // GOTHIC METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Gothic Metal', subgenre: 'Dark Metal',               icon: '🌑', color: 0x4a235a, patterns: [/dark metal/i] },
  { genre: 'Gothic Metal', subgenre: 'Romantic Metal',           icon: '🥀', color: 0x6c3483, patterns: [/romantic metal/i, /darkwave metal/i, /dark wave metal/i] },
  { genre: 'Gothic Metal', subgenre: 'Gothic\/Doom Metal',       icon: '⚰️', color: 0x4a1942, patterns: [/gothic[\s/]doom/i, /doom[\s/]gothic/i] },
  { genre: 'Gothic Metal', subgenre: 'Gothic Metal',             icon: '🖤', color: 0x6c3483, patterns: [/gothic metal/i, /goth metal/i, /gothic[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // FOLK / PAGAN / VIKING METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Folk Metal', subgenre: 'Viking Metal',               icon: '🪓', color: 0x1a5276, patterns: [/viking metal/i, /\bviking\b.*metal/i] },
  { genre: 'Folk Metal', subgenre: 'Pagan Metal',                icon: '🌲', color: 0x1e8449, patterns: [/pagan metal/i, /\bpagan\b.*metal/i] },
  { genre: 'Folk Metal', subgenre: 'Celtic Metal',               icon: '☘️', color: 0x1e8449, patterns: [/celtic metal/i, /celtic[\s-]metal/i, /celtic rock/i] },
  { genre: 'Folk Metal', subgenre: 'Medieval Metal',             icon: '🏰', color: 0x7d6608, patterns: [/medieval metal/i, /mittelalter metal/i, /medieval rock/i] },
  { genre: 'Folk Metal', subgenre: 'Pirate Metal',               icon: '🏴‍☠️', color: 0x1a5276, patterns: [/pirate metal/i] },
  { genre: 'Folk Metal', subgenre: 'Oriental Folk Metal',        icon: '🌙', color: 0xb7950b, patterns: [/oriental metal/i, /middle eastern metal/i, /arabic metal/i] },
  { genre: 'Folk Metal', subgenre: 'Nordic Folk Metal',          icon: '❄️', color: 0x1a5276, patterns: [/nordic folk metal/i, /scandinavian folk metal/i] },
  { genre: 'Folk Metal', subgenre: 'Folk Metal',                 icon: '🪈', color: 0x27ae60, patterns: [/folk metal/i, /folk[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // INDUSTRIAL METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Industrial Metal', subgenre: 'Neue Deutsche Härte',  icon: '🇩🇪', color: 0x717d7e, patterns: [/neue deutsche h[äa]rte/i, /\bndh\b/i] },
  { genre: 'Industrial Metal', subgenre: 'Cyber Metal',          icon: '🤖', color: 0x717d7e, patterns: [/cyber metal/i, /cyber[\s-]metal/i] },
  { genre: 'Industrial Metal', subgenre: 'Electronic Metal',     icon: '⚡', color: 0x717d7e, patterns: [/electronic metal/i, /electro metal/i, /electro[\s-]metal/i] },
  { genre: 'Industrial Metal', subgenre: 'Aggrotech',            icon: '🔧', color: 0x717d7e, patterns: [/aggrotech/i, /aggro[\s-]industrial/i] },
  { genre: 'Industrial Metal', subgenre: 'Industrial Metal',     icon: '⚙️', color: 0x717d7e, patterns: [/industrial metal/i, /industrial[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // METALCORE / POST-HARDCORE
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Metalcore', subgenre: 'Deathcore',                   icon: '💀', color: 0x1a1a2e, patterns: [/\bdeathcore\b/i] },
  { genre: 'Metalcore', subgenre: 'Melodic Metalcore',           icon: '🎸', color: 0x2980b9, patterns: [/melodic metalcore/i, /melo[\s-]?metalcore/i] },
  { genre: 'Metalcore', subgenre: 'Electronicore',               icon: '💻', color: 0x2980b9, patterns: [/electronicore/i, /electro[\s-]?core/i] },
  { genre: 'Metalcore', subgenre: 'Nu-Metalcore',                icon: '🔀', color: 0x2980b9, patterns: [/nu[\s-]?metalcore/i] },
  { genre: 'Metalcore', subgenre: 'Beatdown Hardcore',           icon: '👊', color: 0x1f618d, patterns: [/beatdown hardcore/i, /beatdown/i] },
  { genre: 'Metalcore', subgenre: 'Mathcore',                    icon: '📐', color: 0x2471a3, patterns: [/mathcore/i, /math[\s-]?core/i] },
  { genre: 'Metalcore', subgenre: 'Metalcore',                   icon: '⚡', color: 0x2980b9, patterns: [/\bmetalcore\b/i] },
  { genre: 'Metalcore', subgenre: 'Post-Hardcore',               icon: '🎸', color: 0x1f618d, patterns: [/post[\s-]?hardcore/i, /post hardcore/i] },
  { genre: 'Metalcore', subgenre: 'Screamo',                     icon: '😱', color: 0x1f618d, patterns: [/\bscreamo\b/i] },
  { genre: 'Metalcore', subgenre: 'Hardcore',                    icon: '👊', color: 0x1f618d, patterns: [/\bhardcore\b.*(?:metal|punk|band)/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // NU-METAL / ALTERNATIVE METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Nu-Metal', subgenre: 'Rap Metal',                    icon: '🎤', color: 0x7fb3d3, patterns: [/rap metal/i, /rap[\s-]metal/i, /hip[\s-]?hop metal/i] },
  { genre: 'Nu-Metal', subgenre: 'Funk Metal',                   icon: '🎺', color: 0x7fb3d3, patterns: [/funk metal/i, /funk[\s-]metal/i] },
  { genre: 'Nu-Metal', subgenre: 'Alternative Metal',            icon: '🔀', color: 0x85c1e9, patterns: [/alternative metal/i, /alt[\s-]?metal/i] },
  { genre: 'Nu-Metal', subgenre: 'Nu-Metal',                     icon: '🔀', color: 0x7fb3d3, patterns: [/nu[\s-]?metal/i, /\bnu metal\b/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // SLUDGE / POST-METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Post-Metal', subgenre: 'Atmospheric Post-Metal',     icon: '🌫️', color: 0x2e4057, patterns: [/atmospheric post[\s-]?metal/i, /atmospheric sludge/i] },
  { genre: 'Post-Metal', subgenre: 'Post-Metal',                 icon: '🌑', color: 0x2e4057, patterns: [/post[\s-]?metal/i, /\bpostmetal\b/i] },
  { genre: 'Post-Metal', subgenre: 'Noise Metal',                icon: '📢', color: 0x2e4057, patterns: [/noise metal/i, /noise[\s-]metal/i] },
  { genre: 'Post-Metal', subgenre: 'Sludge Metal',               icon: '🐢', color: 0x3d5a4a, patterns: [/\bsludge(?:\s+metal)?\b/i, /sludge[\s-]metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // STONER / DESERT ROCK
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Stoner Rock', subgenre: 'Desert Rock',               icon: '🏜️', color: 0xe59866, patterns: [/desert rock/i, /desert metal/i, /palm desert/i] },
  { genre: 'Stoner Rock', subgenre: 'Fuzz Rock',                 icon: '🎸', color: 0xe59866, patterns: [/fuzz rock/i, /fuzz metal/i, /\bfuzz\b.*(?:rock|metal)/i] },
  { genre: 'Stoner Rock', subgenre: 'Space Rock',                icon: '🚀', color: 0x1a5276, patterns: [/space rock/i, /space metal/i, /space[\s-]rock/i] },
  { genre: 'Stoner Rock', subgenre: 'Stoner Metal',              icon: '🌿', color: 0x27ae60, patterns: [/stoner metal/i, /stoner[\s-]metal/i] },
  { genre: 'Stoner Rock', subgenre: 'Psychedelic Stoner',        icon: '🌀', color: 0x1e8449, patterns: [/psychedelic stoner/i, /psych stoner/i, /stoner psych/i] },
  { genre: 'Stoner Rock', subgenre: 'Stoner Rock',               icon: '🌿', color: 0xe59866, patterns: [/stoner rock/i, /stoner[\s-]rock/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRINDCORE / EXTREME PUNK
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Grindcore', subgenre: 'Powerviolence',               icon: '💢', color: 0x6e2c00, patterns: [/powerviolence/i, /power violence/i] },
  { genre: 'Grindcore', subgenre: 'Noisecore',                   icon: '📢', color: 0x6e2c00, patterns: [/noisecore/i, /noise[\s-]?core/i] },
  { genre: 'Grindcore', subgenre: 'Crust Punk',                  icon: '🔩', color: 0x5d4037, patterns: [/crust punk/i, /crust metal/i, /\bcrust\b/i, /d[\s-]?beat/i] },
  { genre: 'Grindcore', subgenre: 'Mincecore',                   icon: '💀', color: 0x6e2c00, patterns: [/mincecore/i, /mince[\s-]core/i] },
  { genre: 'Grindcore', subgenre: 'Black Metal\/Grind',          icon: '🖤', color: 0x4a1942, patterns: [/black(?:ened)?[\s-]grind/i, /grind(?:core)?[\s-]black/i] },
  { genre: 'Grindcore', subgenre: 'Grindcore',                   icon: '🔩', color: 0x6e2c00, patterns: [/\bgrindcore\b/i, /grind[\s-]?core/i, /\bgrind\b.*metal/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIMENTAL / AVANT-GARDE METAL
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Experimental Metal', subgenre: 'Jazz Metal',         icon: '🎷', color: 0x148f77, patterns: [/jazz metal/i, /jazz[\s-]metal/i, /jazz.*(?:thrash|death)/i] },
  { genre: 'Experimental Metal', subgenre: 'Ambient Metal',      icon: '🌌', color: 0x148f77, patterns: [/ambient metal/i, /ambient[\s-]metal/i] },
  { genre: 'Experimental Metal', subgenre: 'Noise Rock',         icon: '📢', color: 0x148f77, patterns: [/\bnoise rock\b/i, /no[\s-]?wave/i] },
  { genre: 'Experimental Metal', subgenre: 'Math Rock',          icon: '📐', color: 0x148f77, patterns: [/\bmath rock\b/i, /math[\s-]rock/i] },
  { genre: 'Experimental Metal', subgenre: 'Avant-Garde Metal',  icon: '🎭', color: 0x148f77, patterns: [/avant[\s-]?garde/i, /avantgarde/i, /\bexperimental metal\b/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROCK — CLASSIC / HARD ROCK
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Hard Rock', subgenre: 'Southern Rock',               icon: '🤠', color: 0xd35400, patterns: [/southern rock/i, /southern[\s-]rock/i] },
  { genre: 'Hard Rock', subgenre: 'Blues Rock',                  icon: '🎸', color: 0xa04000, patterns: [/blues rock/i, /blues[\s-]rock/i, /british blues/i] },
  { genre: 'Hard Rock', subgenre: 'Glam Rock',                   icon: '✨', color: 0xf8c471, patterns: [/glam rock/i, /glam[\s-]rock/i, /glam punk/i] },
  { genre: 'Hard Rock', subgenre: 'Boogie Rock',                 icon: '🕺', color: 0xd35400, patterns: [/boogie rock/i, /boogie metal/i] },
  { genre: 'Hard Rock', subgenre: 'Hard Rock',                   icon: '🎸', color: 0xe67e22, patterns: [/\bhard rock\b/i, /hard[\s-]rock/i, /\bclassic rock\b/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESSIVE ROCK
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Progressive Rock', subgenre: 'Art Rock',             icon: '🎨', color: 0x1abc9c, patterns: [/\bart rock\b/i, /art[\s-]rock/i] },
  { genre: 'Progressive Rock', subgenre: 'Symphonic Rock',       icon: '🎻', color: 0x7d3c98, patterns: [/symphonic rock/i, /symphonic[\s-]rock/i] },
  { genre: 'Progressive Rock', subgenre: 'Krautrock',            icon: '🇩🇪', color: 0x148f77, patterns: [/krautrock/i, /kosmische musik/i, /\bkraut\b/i] },
  { genre: 'Progressive Rock', subgenre: 'Canterbury Scene',     icon: '🏰', color: 0x148f77, patterns: [/canterbury/i] },
  { genre: 'Progressive Rock', subgenre: 'Post-Rock',            icon: '🌌', color: 0x2c3e50, patterns: [/\bpost[\s-]?rock\b/i, /postrock/i] },
  { genre: 'Progressive Rock', subgenre: 'Neo-Prog',             icon: '🌀', color: 0x1abc9c, patterns: [/neo[\s-]?prog/i, /neo[\s-]progressive/i] },
  { genre: 'Progressive Rock', subgenre: 'Progressive Rock',     icon: '🌀', color: 0x1abc9c, patterns: [/prog(?:ressive)? rock/i, /progressive rock/i, /\bprog rock\b/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // PUNK
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Punk', subgenre: 'Post-Punk',                        icon: '🖤', color: 0x5d6d7e, patterns: [/post[\s-]?punk/i, /post punk/i] },
  { genre: 'Punk', subgenre: 'Hardcore Punk',                    icon: '👊', color: 0x2c3e50, patterns: [/hardcore punk/i, /hardcore[\s-]punk/i, /\bhc\b.*punk/i] },
  { genre: 'Punk', subgenre: 'Anarcho-Punk',                     icon: '⭕', color: 0x2c3e50, patterns: [/anarcho[\s-]?punk/i, /anarcho punk/i] },
  { genre: 'Punk', subgenre: 'Oi! / Street Punk',                icon: '✊', color: 0x2c3e50, patterns: [/\boi[!]?\b/i, /street punk/i, /oi punk/i] },
  { genre: 'Punk', subgenre: 'Pop-Punk',                         icon: '🎵', color: 0x3498db, patterns: [/pop[\s-]?punk/i, /pop punk/i, /skate punk/i] },
  { genre: 'Punk', subgenre: 'Psychobilly',                      icon: '🎸', color: 0x5d6d7e, patterns: [/psychobilly/i, /horror punk/i, /\bgothbilly\b/i] },
  { genre: 'Punk', subgenre: 'New Wave',                         icon: '📻', color: 0x85c1e9, patterns: [/new wave/i, /\bnew[\s-]wave\b/i] },
  { genre: 'Punk', subgenre: 'Punk',                             icon: '✊', color: 0x2c3e50, patterns: [/\bpunk rock\b/i, /punk[\s-]rock/i, /\bpunk\b/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // ALTERNATIVE / INDIE ROCK
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Alternative Rock', subgenre: 'Grunge',               icon: '🌧️', color: 0x7f8c8d, patterns: [/\bgrunge\b/i, /grunge[\s-]rock/i] },
  { genre: 'Alternative Rock', subgenre: 'Shoegaze',             icon: '👟', color: 0x85929e, patterns: [/\bshoegaze\b/i, /shoe[\s-]gaze/i, /\bblackgaze\b/i] },
  { genre: 'Alternative Rock', subgenre: 'Dream Pop',            icon: '💭', color: 0xaab7b8, patterns: [/dream pop/i, /dream[\s-]pop/i, /dreampop/i, /\bdream\b.*(?:pop|rock)/i] },
  { genre: 'Alternative Rock', subgenre: 'Slowcore',             icon: '🐌', color: 0x85929e, patterns: [/slowcore/i, /slow[\s-]core/i, /sadcore/i] },
  { genre: 'Alternative Rock', subgenre: 'Indie Rock',           icon: '🎸', color: 0x85c1e9, patterns: [/indie rock/i, /indie[\s-]rock/i, /\bindie\b/i] },
  { genre: 'Alternative Rock', subgenre: 'College Rock',         icon: '🎓', color: 0x85c1e9, patterns: [/college rock/i] },
  { genre: 'Alternative Rock', subgenre: 'Alternative Rock',     icon: '🔀', color: 0x85c1e9, patterns: [/alternative rock/i, /alt[\s-]?rock/i, /\balternative\b/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // GOTHIC ROCK / DARKWAVE
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Gothic Rock', subgenre: 'Deathrock',                 icon: '💀', color: 0x4a1942, patterns: [/\bdeathrock\b/i, /death[\s-]rock/i] },
  { genre: 'Gothic Rock', subgenre: 'Coldwave',                  icon: '🥶', color: 0x4a1942, patterns: [/\bcoldwave\b/i, /cold[\s-]wave/i] },
  { genre: 'Gothic Rock', subgenre: 'Darkwave',                  icon: '🌑', color: 0x4a1942, patterns: [/\bdarkwave\b/i, /dark[\s-]wave/i, /\bbatcave\b/i] },
  { genre: 'Gothic Rock', subgenre: 'Gothic Rock',               icon: '🦇', color: 0x4a1942, patterns: [/gothic rock/i, /goth rock/i, /gothic[\s-]rock/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // EMO
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Emo', subgenre: 'Midwest Emo',                       icon: '🌾', color: 0x5dade2, patterns: [/midwest emo/i, /emo[\s-]revival/i] },
  { genre: 'Emo', subgenre: 'Emo Pop',                           icon: '💔', color: 0x5dade2, patterns: [/emo[\s-]pop/i, /pop[\s-]emo/i, /emo pop/i] },
  { genre: 'Emo', subgenre: 'Emocore',                           icon: '😤', color: 0x5dade2, patterns: [/\bemocore\b/i, /emo[\s-]core/i, /emotional hardcore/i] },
  { genre: 'Emo', subgenre: 'Emo',                               icon: '💔', color: 0x5dade2, patterns: [/\bemo\b/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTRONIC ROCK / SYNTH
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Electronic Rock', subgenre: 'Synth Rock',            icon: '🎹', color: 0x3498db, patterns: [/synth[\s-]?rock/i, /synthrock/i] },
  { genre: 'Electronic Rock', subgenre: 'Industrial Rock',       icon: '⚙️', color: 0x717d7e, patterns: [/industrial rock/i, /\bindustrial[\s-]rock\b/i] },
  { genre: 'Electronic Rock', subgenre: 'Electronic Rock',       icon: '💻', color: 0x3498db, patterns: [/electronic rock/i, /electro[\s-]rock/i, /digital rock/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // FOLK ROCK / AMERICANA
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Folk Rock', subgenre: 'Americana',                   icon: '🤠', color: 0xd4ac0d, patterns: [/\bamericana\b/i, /americana rock/i, /country rock/i] },
  { genre: 'Folk Rock', subgenre: 'Folk Rock',                   icon: '🪕', color: 0xd4ac0d, patterns: [/folk rock/i, /folk[\s-]rock/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // PSYCHEDELIC ROCK
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Psychedelic Rock', subgenre: 'Acid Rock',            icon: '🍄', color: 0x8e44ad, patterns: [/acid rock/i, /\bacid\b.*rock/i] },
  { genre: 'Psychedelic Rock', subgenre: 'Psychedelic Rock',     icon: '🌀', color: 0x8e44ad, patterns: [/psychedelic rock/i, /psych[\s-]?rock/i, /\bpsych\b.*rock/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // GARAGE ROCK / RETRO
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Garage Rock', subgenre: 'Proto-Punk',                icon: '🔌', color: 0xe74c3c, patterns: [/proto[\s-]punk/i, /protopunk/i] },
  { genre: 'Garage Rock', subgenre: 'Garage Punk',               icon: '🔧', color: 0xe74c3c, patterns: [/garage punk/i, /\bgarage punk\b/i] },
  { genre: 'Garage Rock', subgenre: 'Garage Rock',               icon: '🔧', color: 0xe74c3c, patterns: [/garage rock/i, /garage[\s-]rock/i, /retro rock/i, /garage revival/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // SKA / REGGAE ROCK
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Ska', subgenre: 'Ska-Punk',                          icon: '🎺', color: 0xf1c40f, patterns: [/ska[\s-]?punk/i, /\bskacore\b/i] },
  { genre: 'Ska', subgenre: 'Ska',                               icon: '🎺', color: 0xf1c40f, patterns: [/\bska\b/i, /\btwo[\s-]tone\b/i, /reggae rock/i] },

  // ═══════════════════════════════════════════════════════════════════════════
  // METAL / ROCK GÉNÉRIQUE (fallbacks)
  // ═══════════════════════════════════════════════════════════════════════════
  { genre: 'Metal', subgenre: 'Metal',                           icon: '🤘', color: 0xe74c3c, patterns: [/\bmetal\b/i] },
  { genre: 'Rock',  subgenre: 'Rock',                            icon: '🎸', color: 0xe67e22, patterns: [/\brock\b/i] },
];

/**
 * Correspondance source → genres par défaut
 * (utilisé quand l'article ne contient pas de mot-clé de genre)
 */
const SOURCE_DEFAULT_GENRES = {
  'Blabbermouth':         { genre: 'Metal',            subgenre: 'Heavy Metal / Hard Rock',      icon: '🤘', color: 0xe74c3c },
  'Metal Injection':      { genre: 'Metal',            subgenre: 'Extreme Metal',                icon: '🤘', color: 0xc0392b },
  'MetalSucks':           { genre: 'Metal',            subgenre: 'Modern Metal',                 icon: '🤘', color: 0xe74c3c },
  'Angry Metal Guy':      { genre: 'Metal',            subgenre: 'Extreme Metal',                icon: '😡', color: 0xc0392b },
  'No Clean Singing':     { genre: 'Metal',            subgenre: 'Extreme Metal',                icon: '🔇', color: 0xc0392b },
  'Invisible Oranges':    { genre: 'Metal',            subgenre: 'Extreme Metal',                icon: '🟠', color: 0xe74c3c },
  'Decibel Magazine':     { genre: 'Metal',            subgenre: 'Extreme Metal',                icon: '🔊', color: 0xe74c3c },
  'Metal Addicts':        { genre: 'Metal',            subgenre: 'Heavy Metal',                  icon: '⚗️', color: 0xe74c3c },
  'Bravewords':           { genre: 'Heavy Metal',      subgenre: 'Traditional Heavy Metal',      icon: '⚔️', color: 0xf1c40f },
  'The Obelisk':          { genre: 'Doom Metal',       subgenre: 'Stoner Rock / Doom',           icon: '🗿', color: 0xe59866 },
  'Lambgoat':             { genre: 'Metalcore',        subgenre: 'Metalcore / Hardcore',         icon: '🐐', color: 0x2980b9 },
  'Metal-Rules':          { genre: 'Heavy Metal',      subgenre: 'Traditional Heavy Metal',      icon: '📏', color: 0xf1c40f },
  'Bandcamp Daily':       { genre: 'Metal',            subgenre: 'Underground Metal',            icon: '🎵', color: 0x1abc9c },
  'Metal Underground':    { genre: 'Metal',            subgenre: 'Underground Metal',            icon: '⛏️', color: 0xe74c3c },
  'Metal Hammer':         { genre: 'Metal',            subgenre: 'Heavy Metal / British Metal',  icon: '🔨', color: 0xe74c3c },
  'The PRP':              { genre: 'Metal',            subgenre: 'Modern Metal / Post-Hardcore', icon: '📰', color: 0xe74c3c },
  'Loudwire':             { genre: 'Hard Rock',        subgenre: 'Hard Rock / Metal',            icon: '📣', color: 0xe67e22 },
  'NME':                  { genre: 'Rock',             subgenre: 'Indie Rock',                   icon: '🎤', color: 0xe67e22 },
  'Consequence of Sound': { genre: 'Rock',             subgenre: 'Alternative / Indie Rock',     icon: '🎼', color: 0xe67e22 },
  'Alternative Press':    { genre: 'Alternative Rock', subgenre: 'Post-Hardcore / Alt Rock',     icon: '🎸', color: 0x85c1e9 },
  'Louder Sound':         { genre: 'Hard Rock',        subgenre: 'Hard Rock / Metal',            icon: '🔉', color: 0xe67e22 },
  'Rock Sound':           { genre: 'Alternative Rock', subgenre: 'Post-Hardcore / Alt Rock',     icon: '🎚️', color: 0x85c1e9 },
  'Revolver Magazine':    { genre: 'Metal',            subgenre: 'Heavy Metal / Hard Rock',      icon: '🔫', color: 0xe74c3c },
  'Spin':                 { genre: 'Rock',             subgenre: 'Alternative Rock',             icon: '💿', color: 0xe67e22 },
  'The Pit':              { genre: 'Metal',            subgenre: 'Heavy Metal',                  icon: '🎪', color: 0xe74c3c },
  'Stereogum':            { genre: 'Alternative Rock', subgenre: 'Indie Rock',                   icon: '🎧', color: 0x85c1e9 },
  'Kerrang!':             { genre: 'Rock',             subgenre: 'Rock / Metal',                 icon: '💥', color: 0xe67e22 },
  'Sputnikmusic':         { genre: 'Rock',             subgenre: 'Progressive Rock',             icon: '🛸', color: 0x85c1e9 },
  'Season of Mist':       { genre: 'Metal',            subgenre: 'Extreme Metal',                icon: '🌫️', color: 0xc0392b },
  'Peaceville Records':   { genre: 'Doom Metal',       subgenre: 'Death/Doom Metal',             icon: '☮️', color: 0x566573 },
  'Dark Descent Records': { genre: 'Death Metal',      subgenre: 'Old School Death Metal',       icon: '🌑', color: 0xc0392b },
  'Nuclear Blast':        { genre: 'Metal',            subgenre: 'Heavy Metal / Extreme Metal',  icon: '☢️', color: 0xe74c3c },
  'Napalm Records':       { genre: 'Metal',            subgenre: 'Heavy Metal / Folk Metal',     icon: '🔥', color: 0xe74c3c },
  'Metal Blade Records':  { genre: 'Metal',            subgenre: 'Thrash / Death Metal',         icon: '🗡️', color: 0xc0392b },
  'Prosthetic Records':   { genre: 'Metal',            subgenre: 'Progressive / Extreme Metal',  icon: '🧪', color: 0xc0392b },
};

module.exports = { GENRE_PATTERNS, SOURCE_DEFAULT_GENRES };
