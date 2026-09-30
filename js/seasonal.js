/* באנרים עונתיים — מופיעים בדף הבית אוטומטית לפי התאריך העברי.
 *
 * להוספת באנר חדש: מוסיפים עוד אובייקט לרשימה SEASONAL.
 *   from / to — { month, day } בלוח העברי, כולל שני הקצוות.
 *   month — אחד מהמפתחות של HEB_MONTHS (למשל 'Tishri', 'Nisan', 'Adar').
 *   טווח שעובר את סוף השנה (למשל מאלול לתשרי) נתמך.
 *
 * לבדיקה בלי לחכות לתאריך: index.html?season=sukkah  או  index.html?season=all
 * רשימת כל התכנים העונתיים: pages/seasonal.html (לא מקושר מהאתר).
 */
(function(){
  var SEASONAL = [
    {
      id: 'yom-kippur',
      title: 'הלכות טהרה, אישות ויום הכיפורים',
      href: 'pages/yom-kippur.html',
      img: 'media/images/home-yom-kippur.jpeg',
      from: { month: 'Tishri', day: 2 },
      to:   { month: 'Tishri', day: 10 }
    },
    {
      id: 'sukkah',
      title: 'האם חתן חייב לישון בסוכה?',
      href: 'pages/sukkah.html',
      img: 'media/images/home-sukkah.jpeg',
      from: { month: 'Tishri', day: 11 },
      to:   { month: 'Tishri', day: 23 }
    }
  ];

  // month order within the Hebrew year (Tishri first); Adar I/II sit around Adar
  var HEB_MONTHS = {
    'Tishri':  { order: 1,   he: 'תשרי' },
    'Heshvan': { order: 2,   he: 'חשוון' },
    'Kislev':  { order: 3,   he: 'כסלו' },
    'Tevet':   { order: 4,   he: 'טבת' },
    'Shevat':  { order: 5,   he: 'שבט' },
    'Adar I':  { order: 6,   he: 'אדר א׳' },
    'Adar':    { order: 6.5, he: 'אדר' },
    'Adar II': { order: 7,   he: 'אדר ב׳' },
    'Nisan':   { order: 8,   he: 'ניסן' },
    'Iyar':    { order: 9,   he: 'אייר' },
    'Sivan':   { order: 10,  he: 'סיוון' },
    'Tamuz':   { order: 11,  he: 'תמוז' },
    'Av':      { order: 12,  he: 'אב' },
    'Elul':    { order: 13,  he: 'אלול' }
  };

  function hebrewToday(date){
    var parts = new Intl.DateTimeFormat('en-u-ca-hebrew', { month: 'long', day: 'numeric' }).formatToParts(date || new Date());
    var month = '', day = 0;
    parts.forEach(function(p){ if (p.type === 'month') month = p.value; if (p.type === 'day') day = parseInt(p.value, 10); });
    return { month: month, day: day };
  }

  function key(md){ var m = HEB_MONTHS[md.month]; return m ? m.order * 100 + md.day : -1; }

  function isActive(item, today){
    var t = key(today), a = key(item.from), b = key(item.to);
    if (t < 0 || a < 0 || b < 0) return false;
    return a <= b ? (t >= a && t <= b) : (t >= a || t <= b);   // wraps past Elul → Tishri
  }

  function bannerHTML(item, base){
    base = base || '';
    return '<a class="season-banner" href="' + base + item.href + '">' +
             '<div class="season-circle"><span class="halo"></span>' +
               '<img src="' + base + item.img + '" alt="' + item.title + '"></div>' +
             '<div class="season-title">' + item.title + '</div>' +
             '<span class="season-badge">חדש</span>' +
           '</a>';
  }

  function render(containerId){
    var el = document.getElementById(containerId);
    if (!el) return;
    var force = (new URLSearchParams(location.search)).get('season');
    var today = hebrewToday();
    var html = SEASONAL.filter(function(item){
      if (force) return force === 'all' || force === item.id;
      return isActive(item, today);
    }).map(function(item){ return bannerHTML(item); }).join('');
    el.innerHTML = html;
  }

  function rangeLabel(item){
    return item.from.day + ' ' + HEB_MONTHS[item.from.month].he + ' – ' + item.to.day + ' ' + HEB_MONTHS[item.to.month].he;
  }

  window.Seasonal = { list: SEASONAL, render: render, isActive: isActive, hebrewToday: hebrewToday, rangeLabel: rangeLabel, bannerHTML: bannerHTML };
})();
