// נוצר אוטומטית מ-luach/tet-a/build.mjs – לא לערוך ידנית
const EVENTS = [{"id":"e01","date":"2026-10-14","type":"day","title":"אסיפת הורים כללית – היכרות הר\"מ"},{"id":"e02","date":"2026-10-15","type":"exam","title":"גמרא"},{"id":"e03","date":"2026-10-22","type":"exam","title":"נביא"},{"id":"e04","date":"2026-10-25","type":"exam","title":"הסטוריה"},{"id":"e05","date":"2026-10-25","type":"day","title":"שיחה הרב נתנאל אלישיב – יום רבין"},{"id":"e06","date":"2026-10-27","type":"day","title":"בחירות"},{"id":"e07","date":"2026-10-28","type":"exam","title":"אנגלית"},{"id":"e08","date":"2026-10-29","type":"day","title":"טיול גיבוש"},{"id":"e09","date":"2026-11-01","type":"exam","title":"לשון"},{"id":"e10","date":"2026-11-03","type":"exam","title":"מתמטיקה"},{"id":"e11","date":"2026-11-09","type":"exam","title":"הלכה"},{"id":"e12","date":"2026-11-11","type":"exam","title":"ביולוגיה"},{"id":"e13","date":"2026-11-17","type":"day","title":"מפקד מזכ\"ל בני עקיבא"},{"id":"e14","date":"2026-11-21","type":"day","title":"שבת ארגון"},{"id":"e15","date":"2026-11-24","type":"exam","title":"מחשבת ישראל"},{"id":"e16","date":"2026-11-25","type":"day","title":"יום ההוקרה לפצועי צה\"ל"},{"id":"e17","date":"2026-11-26","type":"exam","title":"פיסיקה"},{"id":"e18","date":"2026-11-29","type":"day","title":"יום ספורט"},{"id":"e19","date":"2026-11-30","type":"exam","title":"תורה"},{"id":"e20","date":"2026-12-01","type":"day","title":"אסיפת הורים"},{"id":"e21","date":"2026-12-02","type":"day","title":"מסיבת חנוכה בבתי הרמי\"ם"},{"id":"e22","date":"2026-12-03","type":"exam","title":"מבחן ראש ישיבה"},{"id":"e23","date":"2026-12-05","type":"day","title":"חופשת חנוכה","until":"2026-12-12"},{"id":"e24","date":"2026-12-13","type":"exam","title":"חינוך פיננסי"},{"id":"e25","date":"2026-12-14","type":"exam","title":"אנגלית"},{"id":"e26","date":"2026-12-16","type":"day","title":"שם עולם – קרון בישיבה (ט1-3)"},{"id":"e27","date":"2026-12-17","type":"day","title":"שם עולם – קרון בישיבה (ט4-5)"},{"id":"e28","date":"2026-12-22","type":"exam","title":"מתמטיקה"},{"id":"e29","date":"2026-12-24","type":"exam","title":"אזרחות"},{"id":"e30","date":"2026-12-27","type":"day","title":"סמינריון בירוחם – \"תנו לי קדושת אהבת ישראל\"","until":"2026-12-28"},{"id":"e31","date":"2026-12-31","type":"exam","title":"מחשבת ישראל"},{"id":"e32","date":"2027-01-03","type":"exam","title":"לשון"},{"id":"e33","date":"2027-01-05","type":"exam","title":"ביולוגיה"},{"id":"e34","date":"2027-01-10","type":"exam","title":"גמרא"},{"id":"e35","date":"2027-01-12","type":"exam","title":"מתמטיקה"},{"id":"e36","date":"2027-01-18","type":"exam","title":"ספרות"},{"id":"e37","date":"2027-01-19","type":"day","title":"נטיעות"},{"id":"e38","date":"2027-01-21","type":"exam","title":"פיסיקה"},{"id":"e39","date":"2027-01-24","type":"exam","title":"הסטוריה"},{"id":"e40","date":"2027-01-26","type":"day","title":"סיור תנ\"ך – שמואל ב'"},{"id":"e41","date":"2027-01-27","type":"exam","title":"נביא"},{"id":"e42","date":"2027-01-31","type":"exam","title":"הלכה"},{"id":"e43","date":"2027-02-04","type":"day","title":"טיול מחצית וחלוקת תעודות"}];
const OPTS = {"site":"dvir-hadraha.netlify.app","calName":"מבחנים ט׳ – מחצית א׳ תשפ\"ז","examStart":"10:00","examEnd":"12:00","stamp":"20261013T120439Z"};
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
export default async (req) => {
  const url = new URL(req.url);
  const skip = new Set((url.searchParams.get('skip') || '').split(/[.,]/).filter(Boolean).map(n => 'e' + n.padStart(2, '0')));
  const body = buildICS(EVENTS.filter(e => !skip.has(e.id)), OPTS);
  const headers = { 'content-type': 'text/calendar; charset=utf-8', 'cache-control': 'public, max-age=900' };
  if (url.searchParams.has('dl')) headers['content-disposition'] = 'attachment; filename="mivchanim-tet.ics"';
  return new Response(body, { headers });
};
export const config = { path: '/luach/tet-a/feed.ics' };
