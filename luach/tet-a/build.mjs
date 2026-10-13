// מחולל לוח מבחנים ט' מחצית א' תשפ"ז
// מייצר: mivchanim.ics (יומן מלא) · index.html (דף בחירה) · netlify/functions/luach-tet-a.mjs (יומן מסונן לפי בחירה)
// לעדכון: לערוך את EVENTS ולהריץ:  node build.mjs
// חשוב: לא לשנות id של אירוע קיים – גם היומנים של המנויים וגם הבחירות שלהם (skip) נשענים עליו. אירוע חדש = id חדש.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = join(HERE, '..', '..');
const SITE = 'dvir-hadraha.netlify.app';
const STATIC_PATH = '/luach/tet-a/mivchanim.ics';
const FEED_PATH = '/luach/tet-a/feed.ics';
const OPTS = { site: SITE, calName: 'מבחנים ט׳ – מחצית א׳ תשפ"ז', examStart: '10:00', examEnd: '12:00',
               stamp: new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '') };

// type: 'exam' = שעות (ברירת מחדל 10–12, אפשר start/end לאירוע ספציפי) | 'day' = יום שלם (until = יום אחרון כולל)
// desc = חומר למידה / פרטים (אופציונלי)
const EVENTS = [
  { id: 'e01', date: '2026-10-14', type: 'day',  title: 'אסיפת הורים כללית – היכרות הר"מ' },
  { id: 'e02', date: '2026-10-15', type: 'exam', title: 'גמרא' },
  { id: 'e03', date: '2026-10-22', type: 'exam', title: 'נביא' },
  { id: 'e04', date: '2026-10-25', type: 'exam', title: 'הסטוריה' },
  { id: 'e05', date: '2026-10-25', type: 'day',  title: 'שיחה הרב נתנאל אלישיב – יום רבין' },
  { id: 'e06', date: '2026-10-27', type: 'day',  title: 'בחירות' },
  { id: 'e07', date: '2026-10-28', type: 'exam', title: 'אנגלית' },
  { id: 'e08', date: '2026-10-29', type: 'day',  title: 'טיול גיבוש' },
  { id: 'e09', date: '2026-11-01', type: 'exam', title: 'לשון' },
  { id: 'e10', date: '2026-11-03', type: 'exam', title: 'מתמטיקה' },
  { id: 'e11', date: '2026-11-09', type: 'exam', title: 'הלכה' },
  { id: 'e12', date: '2026-11-11', type: 'exam', title: 'ביולוגיה' },
  { id: 'e13', date: '2026-11-17', type: 'day',  title: 'מפקד מזכ"ל בני עקיבא' },
  { id: 'e14', date: '2026-11-21', type: 'day',  title: 'שבת ארגון' },
  { id: 'e15', date: '2026-11-24', type: 'exam', title: 'מחשבת ישראל' },
  { id: 'e16', date: '2026-11-25', type: 'day',  title: 'יום ההוקרה לפצועי צה"ל' },
  { id: 'e17', date: '2026-11-26', type: 'exam', title: 'פיסיקה' },
  { id: 'e18', date: '2026-11-29', type: 'day',  title: 'יום ספורט' },
  { id: 'e19', date: '2026-11-30', type: 'exam', title: 'תורה' },
  { id: 'e20', date: '2026-12-01', type: 'day',  title: 'אסיפת הורים' },
  { id: 'e21', date: '2026-12-02', type: 'day',  title: 'מסיבת חנוכה בבתי הרמי"ם' },
  { id: 'e22', date: '2026-12-03', type: 'exam', title: 'מבחן ראש ישיבה' },
  { id: 'e23', date: '2026-12-05', type: 'day',  title: 'חופשת חנוכה', until: '2026-12-12' },
  { id: 'e24', date: '2026-12-13', type: 'exam', title: 'חינוך פיננסי' },
  { id: 'e25', date: '2026-12-14', type: 'exam', title: 'אנגלית' },
  { id: 'e26', date: '2026-12-16', type: 'day',  title: 'שם עולם – קרון בישיבה (ט1-3)' },
  { id: 'e27', date: '2026-12-17', type: 'day',  title: 'שם עולם – קרון בישיבה (ט4-5)' },
  { id: 'e28', date: '2026-12-22', type: 'exam', title: 'מתמטיקה' },
  { id: 'e29', date: '2026-12-24', type: 'exam', title: 'אזרחות' },
  { id: 'e30', date: '2026-12-27', type: 'day',  title: 'סמינריון בירוחם – "תנו לי קדושת אהבת ישראל"', until: '2026-12-28' },
  { id: 'e31', date: '2026-12-31', type: 'exam', title: 'מחשבת ישראל' },
  { id: 'e32', date: '2027-01-03', type: 'exam', title: 'לשון' },
  { id: 'e33', date: '2027-01-05', type: 'exam', title: 'ביולוגיה' },
  { id: 'e34', date: '2027-01-10', type: 'exam', title: 'גמרא' },
  { id: 'e35', date: '2027-01-12', type: 'exam', title: 'מתמטיקה' },
  { id: 'e36', date: '2027-01-18', type: 'exam', title: 'ספרות' },
  { id: 'e37', date: '2027-01-19', type: 'day',  title: 'נטיעות' },
  { id: 'e38', date: '2027-01-21', type: 'exam', title: 'פיסיקה' },
  { id: 'e39', date: '2027-01-24', type: 'exam', title: 'הסטוריה' },
  { id: 'e40', date: '2027-01-26', type: 'day',  title: 'סיור תנ"ך – שמואל ב\'' },
  { id: 'e41', date: '2027-01-27', type: 'exam', title: 'נביא' },
  { id: 'e42', date: '2027-01-31', type: 'exam', title: 'הלכה' },
  { id: 'e43', date: '2027-02-04', type: 'day',  title: 'טיול מחצית וחלוקת תעודות' },
];

// ---------- ICS (פונקציה עצמאית – מועתקת כמו שהיא גם לפונקציית השרת) ----------
function buildICS(events, o) {
  const ymd = d => d.replaceAll('-', '');
  const hm = t => t.replace(':', '') + '00';
  const nextDay = d => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + 1); return x.toISOString().slice(0, 10); };
  const esc = s => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  // קיפול שורות ל-75 בתים לפי התקן (בלי לחתוך תו UTF-8 באמצע)
  const enc = new TextEncoder();
  const fold = line => {
    const out = []; let cur = '', bytes = 0;
    for (const ch of line) {
      const b = enc.encode(ch).length;
      if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
      cur += ch; bytes += b;
    }
    out.push(cur);
    return out.join('\r\n ');
  };
  const L = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//dvir-hadraha//luach tet-a//HE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(o.calName)}`, 'X-WR-TIMEZONE:Asia/Jerusalem',
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H', 'X-PUBLISHED-TTL:PT6H',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Jerusalem',
    'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0300', 'TZNAME:IDT', 'DTSTART:19700327T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=23,24,25,26,27,28,29;BYDAY=FR', 'END:DAYLIGHT',
    'BEGIN:STANDARD', 'TZOFFSETFROM:+0300', 'TZOFFSETTO:+0200', 'TZNAME:IST', 'DTSTART:19701025T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD',
    'END:VTIMEZONE',
  ];
  for (const e of events) {
    L.push('BEGIN:VEVENT', `UID:${e.id}-tet-a-5787@${o.site}`, `DTSTAMP:${o.stamp}`);
    if (e.type === 'exam') {
      L.push(`DTSTART;TZID=Asia/Jerusalem:${ymd(e.date)}T${hm(e.start || o.examStart)}`,
             `DTEND;TZID=Asia/Jerusalem:${ymd(e.date)}T${hm(e.end || o.examEnd)}`,
             `SUMMARY:${esc('מבחן ' + e.title.replace(/^מבחן /, ''))}`);
    } else {
      L.push(`DTSTART;VALUE=DATE:${ymd(e.date)}`, `DTEND;VALUE=DATE:${ymd(nextDay(e.until || e.date))}`,
             `SUMMARY:${esc(e.title)}`, 'TRANSP:TRANSPARENT');
    }
    if (e.desc) L.push(`DESCRIPTION:${esc(e.desc)}`);
    L.push('END:VEVENT');
  }
  L.push('END:VCALENDAR');
  return L.map(fold).join('\r\n') + '\r\n';
}

// 1) יומן מלא סטטי
writeFileSync(join(HERE, 'mivchanim.ics'), buildICS(EVENTS, OPTS));

// 2) פונקציית שרת: /luach/tet-a/feed.ics?skip=5.6.13  → היומן בלי האירועים האלה
const fnDir = join(SITE_ROOT, 'netlify', 'functions');
mkdirSync(fnDir, { recursive: true });
writeFileSync(join(fnDir, 'luach-tet-a.mjs'), `// נוצר אוטומטית מ-luach/tet-a/build.mjs – לא לערוך ידנית
const EVENTS = ${JSON.stringify(EVENTS)};
const OPTS = ${JSON.stringify(OPTS)};
${buildICS.toString()}
export default async (req) => {
  const url = new URL(req.url);
  const skip = new Set((url.searchParams.get('skip') || '').split(/[.,]/).filter(Boolean).map(n => 'e' + n.padStart(2, '0')));
  const body = buildICS(EVENTS.filter(e => !skip.has(e.id)), OPTS);
  const headers = { 'content-type': 'text/calendar; charset=utf-8', 'cache-control': 'public, max-age=900' };
  if (url.searchParams.has('dl')) headers['content-disposition'] = 'attachment; filename="mivchanim-tet.ics"';
  return new Response(body, { headers });
};
export const config = { path: '${FEED_PATH}' };
`);

// 3) דף בחירה
const heDate = d => new Date(d + 'T12:00:00Z').toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric', month: 'numeric', timeZone: 'UTC' });
const h = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const rows = EVENTS.map(e => `      <li class="${e.type}"><label><input type="checkbox" data-id="${e.id}" data-type="${e.type}" checked><span class="d">${heDate(e.date)}${e.until ? ' – ' + heDate(e.until) : ''}</span><span class="t">${h(e.title)}</span><span class="k">${e.type === 'exam' ? (e.start || OPTS.examStart) + '–' + (e.end || OPTS.examEnd) : 'יום שלם'}</span></label></li>`).join('\n');

writeFileSync(join(HERE, 'index.html'), `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>לוח מבחנים ט׳ – מחצית א׳</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root { --bg:#F4F6FA; --card:#fff; --text:#1d2433; --muted:#6b7385; --line:#e3e7ef; --navy:#1F2A44; --green:#1e8a4c; --g:#1a73e8; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font-family:Heebo,system-ui,sans-serif; line-height:1.5; }
  main { max-width:560px; margin:0 auto; padding:28px 16px 48px; }
  h1 { font-size:1.5rem; margin:0 0 4px; color:var(--navy); }
  .sub { color:var(--muted); margin:0 0 20px; }
  h2 { font-size:1.1rem; margin:0 0 4px; }
  .step { color:var(--muted); font-size:.92rem; margin:0 0 10px; }
  .chips { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px; }
  .chip { font:inherit; font-size:.9rem; padding:6px 14px; border-radius:999px; border:1px solid var(--line); background:var(--card); color:var(--text); cursor:pointer; }
  .chip:active { background:var(--line); }
  ul { list-style:none; margin:0 0 8px; padding:0; background:var(--card); border:1px solid var(--line); border-radius:14px; overflow:hidden; }
  li { border-top:1px solid var(--line); }
  li:first-child { border-top:0; }
  label { display:grid; grid-template-columns:auto 6.6em 1fr auto; gap:10px; align-items:center; padding:9px 14px; font-size:.95rem; cursor:pointer; }
  input[type=checkbox] { width:20px; height:20px; margin:0; accent-color:var(--navy); }
  .d { color:var(--muted); font-size:.86rem; }
  li.exam .t { font-weight:700; }
  li.day .t { color:var(--green); font-weight:500; }
  .k { color:var(--muted); font-size:.78rem; white-space:nowrap; }
  li.off .t, li.off .d, li.off .k { opacity:.4; text-decoration:line-through; }
  .count { color:var(--muted); font-size:.9rem; margin:0 0 24px; }
  .bar { position:sticky; bottom:0; background:linear-gradient(transparent, var(--bg) 18px); padding:22px 0 8px; }
  .btn { display:flex; align-items:center; justify-content:center; width:100%; padding:15px 18px; border-radius:14px; font-size:1.08rem; font-weight:700; text-decoration:none; margin-bottom:10px; }
  .btn.google { background:var(--g); color:#fff; }
  .btn.apple { background:var(--navy); color:#fff; }
  .btn.other { background:var(--card); color:var(--text); border:1px solid var(--line); font-weight:500; font-size:.95rem; padding:11px; }
  .btn.disabled { opacity:.35; pointer-events:none; }
  .note { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:14px 16px; font-size:.92rem; color:var(--muted); margin-top:18px; }
  .note b { color:var(--text); }
  @media (max-width:380px) { label { grid-template-columns:auto 5.8em 1fr; } .k { display:none; } }
</style>
</head>
<body>
<main>
  <h1>לוח מבחנים כיתה ט׳</h1>
  <p class="sub">מחצית א׳ תשפ"ז · בוחרים מה להכניס, ולוחצים על הכפתור למטה</p>

  <h2>1. מה להכניס ליומן?</h2>
  <p class="step">ההסרה של הסימון תשאיר את האירוע מחוץ ליומן שלך</p>
  <div class="chips">
    <button class="chip" data-pick="all">הכל</button>
    <button class="chip" data-pick="exam">רק מבחנים</button>
    <button class="chip" data-pick="day">רק אירועים</button>
    <button class="chip" data-pick="none">נקה הכל</button>
  </div>
  <ul id="list">
${rows}
  </ul>
  <p class="count" id="count"></p>

  <div class="bar">
    <h2>2. הוספה ליומן</h2>
    <a class="btn google" id="google" href="#">הוספה ליומן גוגל</a>
    <a class="btn apple" id="apple" href="#">הוספה ליומן אייפון</a>
    <a class="btn other" id="dl" href="#">הורדת קובץ יומן (לכל יומן אחר)</a>
  </div>

  <div class="note">
    <b>היומן מתעדכן לבד.</b> אם מבחן יזוז – השינוי יופיע אצלך אוטומטית (בגוגל זה יכול לקחת עד יום).
    אירועים חדשים שיתווספו ללוח בהמשך ייכנסו גם הם. היומן נוסף כיומן נפרד, ואפשר להסיר אותו בכל רגע.<br>
    <b>רוצים לשנות בחירה אחרי שנרשמתם?</b> מסירים את היומן ונרשמים שוב מהדף הזה.<br>
    <b>באנדרואיד:</b> אם הכפתור לא עובד בטלפון – פתחו את הדף במחשב ולחצו שם על "הוספה ליומן גוגל". היומן יופיע גם בטלפון.
  </div>
</main>
<script>
(function () {
  var HOST = '${SITE}', STATIC = '${STATIC_PATH}', FEED = '${FEED_PATH}', KEY = 'luach-tet-a-skip';
  var boxes = [].slice.call(document.querySelectorAll('#list input'));
  try { var saved = JSON.parse(localStorage.getItem(KEY) || '[]'); boxes.forEach(function (b) { if (saved.indexOf(b.dataset.id) > -1) b.checked = false; }); } catch (e) {}

  function update() {
    var skip = [], on = 0;
    boxes.forEach(function (b) { b.closest('li').classList.toggle('off', !b.checked); if (b.checked) on++; else skip.push(b.dataset.id); });
    try { localStorage.setItem(KEY, JSON.stringify(skip)); } catch (e) {}
    var path = skip.length ? FEED + '?skip=' + skip.map(function (id) { return +id.slice(1); }).join('.') : STATIC;
    var webcal = 'webcal://' + HOST + path;
    document.getElementById('google').href = 'https://calendar.google.com/calendar/r?cid=' + encodeURIComponent(webcal);
    document.getElementById('apple').href = webcal;
    document.getElementById('dl').href = skip.length ? path + '&dl=1' : STATIC;
    document.getElementById('count').textContent = 'נבחרו ' + on + ' מתוך ' + boxes.length;
    ['google', 'apple', 'dl'].forEach(function (id) { document.getElementById(id).classList.toggle('disabled', on === 0); });
  }
  boxes.forEach(function (b) { b.addEventListener('change', update); });
  [].forEach.call(document.querySelectorAll('[data-pick]'), function (c) {
    c.addEventListener('click', function () {
      var p = c.dataset.pick;
      boxes.forEach(function (b) { b.checked = p === 'all' || p === b.dataset.type; });
      update();
    });
  });
  update();
})();
</script>
</body>
</html>
`);
console.log(`ok: ${EVENTS.length} events`);
