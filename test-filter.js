/**
 * Test complet de tous les feeds RSS — sans poster sur Discord
 * Lance avec: node test-filter.js
 */
require('dotenv').config();
const Parser = require('rss-parser');
const parser = new Parser({ timeout: 12000 });

// Copie des listes depuis rss.js
const REVIEW_PATTERNS = [
  /^review[:\s]/i,
  /\balbum review\b/i,
  /\bep review\b/i,
  /\bsingle review\b/i,
  /\btrack review\b/i,
  /\breview\b/i,
];

const EXCLUDE_PATTERNS = [
  /\btop\s+\d+\b/i, /\bbest\s+(albums?|songs?|tracks?|bands?)/i,
  /\bquiz\b/i, /\bpoll\b/i, /\bvote\b/i,
  /\brated\s+\d/i,
  /\bairpods?\b/i, /\bearbuds?\b/i, /\bheadphones?\b/i,
  /\bwireless\s+(audio|headphones?|earphones?|earbuds?|speaker)/i,
  /\bdrop[s]?\s+to\s+\$\d+/i, /\bsave\s+(big|up\s+to|\d+%)/i,
  /\bmemorial\s+day\s+(sale|deal)/i, /\bblack\s+friday\b/i,
  /\bbest\s+\w+\s+(deal|sale|buy|price|discount)/i,
  /\b(sale|deal)[s]?[:\s]/i, /\bdiscount[s]?\b/i,
  /\bhow\s+to\b/i, /\bwhat\s+is\b/i, /\bwhy\s+(you|we)\b/i,
  /\brapper\b/i, /\bhip[\s-]?hop\b/i, /\br&b\b/i, /\brnb\b/i,
  /\bcountry\s+(artist|singer|star|band|music)\b/i,
  /\bjazz\s+(artist|musician|band|album)\b/i,
  /\bpop\s+(star|princess|king|queen|idol|act)\b/i,
  /\bedm\b/i, /\belectronic\s+dance\b/i,
  /\brap\s+(album|song|track|music|artist|star)\b/i,
  /\bclassical\s+(music|composer|orchestra)\b/i,
  /\bk-?pop\b/i, /\bsoul\s+(singer|artist|music|album)\b/i,
  /\breggae\b/i, /\bboyband\b/i, /\bboy\s+band\b/i,
];
const MUSIC_KEYWORDS = [
  /\bband\b/i, /\balbum\b/i, /\bsingle\b/i, /\bep\b/i, /\btour\b/i,
  /\bconcert\b/i, /\bgig\b/i, /\bmusic\b/i, /\bsong\b/i, /\btrack\b/i,
  /\bguitar/i, /\bdrum/i, /\bbass\b/i, /\briff\b/i, /\bmetal\b/i,
  /\brock\b/i, /\bpunk\b/i, /\bhardcore\b/i, /\bgrunge\b/i,
  /\bfest(ival)?\b/i, /\brelease/i, /\brecord/i, /\bperform/i,
];
const STRICT_ROCK_METAL_KEYWORDS = [
  /\bmetal\b/i, /\brock\b/i, /\bpunk\b/i, /\bhardcore\b/i, /\bgrunge\b/i,
  /\bthrash\b/i, /\bdoom\b/i, /\bsludge\b/i, /\bblack\s*metal\b/i,
  /\bdeath\s*metal\b/i, /\bpower\s*metal\b/i, /\bmetalcore\b/i, /\bdeathcore\b/i,
  /\bpost[\s-]?(rock|metal|punk|hardcore)\b/i, /\bstoner\b/i, /\balt(ernative)?\s*rock\b/i,
  /\bguitar\b/i, /\bdrummer\b/i, /\briff\b/i, /\bheavy\b/i,
];

function isImportant(title, snippet = '', feed = {}) {
  for (const p of EXCLUDE_PATTERNS) if (p.test(title)) return { pass: false, reason: `EXCLUDED: ${p}` };
  if (!feed.allowReviews) {
    for (const p of REVIEW_PATTERNS) if (p.test(title)) return { pass: false, reason: `REVIEW: ${p}` };
  }
  const hay = title + ' ' + snippet;
  if (!MUSIC_KEYWORDS.some(p => p.test(hay))) return { pass: false, reason: 'NOT_MUSIC' };
  return { pass: true, reason: 'OK' };
}

function isStrictOk(title, snippet = '') {
  const hay = title + ' ' + snippet;
  return STRICT_ROCK_METAL_KEYWORDS.some(p => p.test(hay));
}

const FEEDS = [
  // Nouveaux remplaçants à valider
  { name: 'Metal Hammer',       url: 'https://www.loudersound.com/metal-hammer/feed',   category: 'metal' },
  { name: 'Terrorizer',         url: 'https://terrorizer.com/feed/',                    category: 'metal' },
  { name: 'The PRP',            url: 'https://theprp.com/feed/',                        category: 'metal' },
  { name: 'Century Media',      url: 'https://www.centurymedia.com/feed/',              category: 'label' },
  { name: 'Relapse Records',    url: 'https://www.relapse.com/feed/',                   category: 'label' },
  { name: 'Prosthetic Records', url: 'https://prostheticrecords.com/feed/',             category: 'label' },
  { name: 'Upset Magazine',     url: 'https://www.upsetmagazine.com/feed/',             category: 'rock'  },
  // Feeds existants OK pour contrôle
  { name: 'Blabbermouth',       url: 'https://www.blabbermouth.net/feed/',              category: 'metal' },
  { name: 'Metal Injection',    url: 'https://metalinjection.net/feed',                 category: 'metal' },
  { name: 'Angry Metal Guy',    url: 'https://www.angrymetalguy.com/feed/',             category: 'metal', allowReviews: true },
  { name: 'Bandcamp Daily',     url: 'https://daily.bandcamp.com/feed',                 category: 'metal', strict: true },
  { name: 'Stereogum',          url: 'https://www.stereogum.com/feed/',                 category: 'rock',  strict: true },
];

(async () => {
  const results = { ok: [], error: [] };

  for (const feed of FEEDS) {
    const label = `${feed.category.toUpperCase()} | ${feed.name}${feed.strict ? ' [STRICT]' : ''}`;
    process.stdout.write(`\n${'─'.repeat(62)}\n📡 ${label}\n${'─'.repeat(62)}\n`);
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = (parsed.items || []).slice(0, 8);
      let passed = 0;
      for (const item of items) {
        const title = (item.title || '').trim();
        const snippet = item.contentSnippet || '';
        const imp = isImportant(title, snippet, feed);
        const strictOk = !feed.strict || isStrictOk(title, snippet);
        const pass = imp.pass && strictOk;
        if (pass) passed++;
        const icon = pass ? '✅' : '❌';
        const reason = !imp.pass ? imp.reason : (!strictOk ? 'NOT_ROCK_METAL' : '');
        console.log(`  ${icon} [${reason || 'PASS'}] ${title.slice(0, 80)}`);
      }
      console.log(`  → ${passed}/${items.length} articles passeraient le filtre`);
      results.ok.push(`✅ ${feed.name} (${passed}/${items.length} pass)`);
    } catch (e) {
      const err = e.message.includes('Status code') ? e.message : e.message.slice(0, 60);
      console.log(`  ⚠️  ERREUR: ${err}`);
      results.error.push(`❌ ${feed.name} — ${err}`);
    }
  }

  console.log(`\n${'═'.repeat(62)}`);
  console.log(`RÉSUMÉ — ${results.ok.length} feeds OK, ${results.error.length} en erreur`);
  console.log('─'.repeat(62));
  results.ok.forEach(l => console.log(l));
  console.log('─'.repeat(62));
  results.error.forEach(l => console.log(l));
  console.log('═'.repeat(62));
})();
