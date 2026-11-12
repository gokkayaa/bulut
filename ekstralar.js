// Dijital BULUT — sayfa ekstraları
// Her ekstra: bir kapsayıcı (el) alır ve içini doldurur.

const say = (txt) => {
  // Geçici Türkçe seslendirme (cihazın kendi sesi). ElevenLabs kayıtları gelince ses dosyalarıyla değişecek.
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(txt.replace(/[!()]/g, ''));
  u.lang = 'tr-TR'; u.rate = 0.85;
  const v = speechSynthesis.getVoices().find(v => /^tr/i.test(v.lang));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
};
if ('speechSynthesis' in window) speechSynthesis.getVoices();

const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content; };

// ---------- 5. sayfa: Kulağa Tanıdık ----------
const KULAK = [
  ['Sayılar', 'Сандар', '#5b4bd1', ['bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on']],
  ['Renkler', 'Түстөр', '#d23a77', ['beyaz', 'ak', 'siyah', 'kara', 'kırmızı', 'kızıl', 'sarı', 'mavi', 'gök', 'gri', 'boz', 'yeşil', 'alacalı', 'ala']],
  ['Bedenimiz', 'Денебиз', '#0f8a7a', ['baş', 'göz', 'kulak', 'burun', 'diş', 'dil', 'saç', 'kalp', 'yürek']],
  ['Sofrada', 'Дасторкондо', '#c2611f', ['çay', 'et', 'süt', 'bal', 'tuz', 'ayran', 'kazan', 'kaşık']],
  ['Gökyüzü ve yer', 'Асман жана жер', '#2f6fc1', ['ay', 'güneş', 'gün', 'yıldız', 'su', 'taş', 'göl', 'deniz', 'kış']],
  ['Hareket!', 'Кыймыл!', '#7a3db8', ['gel!', 'gör!', 'al!', 'ver!', 'oku!', 'otur!', 'iç!', 'bil!']],
];
function kulak(el) {
  el.append(h(`<p class="lead">Kelimeye dokun, Türkçesini dinle! <span>Сөзгө бас, түркчөсүн ук!</span></p>`));
  KULAK.forEach(([tr, kg, c, ws]) => {
    const g = h(`<div class="kg-grp"><div class="kg-h" style="color:${c}">${tr} <span>${kg}</span></div><div class="kg-ws"></div></div>`);
    const box = g.querySelector('.kg-ws');
    ws.forEach(w => {
      const b = document.createElement('button');
      b.className = 'chip'; b.style.setProperty('--c', c); b.textContent = w;
      b.onclick = () => { say(w); b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 700); };
      box.appendChild(b);
    });
    el.appendChild(g);
  });
}

// ---------- 19. sayfa: Bilgi Yağmuru ----------
const DAMLA = [
  ['İki kıtalı şehir', "İstanbul hem Avrupa'da hem Asya'dadır."],
  ['Kışın donmayan göl', 'Issık Göl en soğuk kışlarda bile donmaz.'],
  ['İki renkli gözler', 'Bazı Van kedilerinin iki gözü farklı renktedir.'],
  ['Aylarca süren destan', "Usta bir manasçının Manas'ın tamamını söylemesi yaklaşık altı ay sürer."],
  ['"Ğ" ile başlayan kelime yok', 'Türkçede "ğ" harfiyle başlayan tek bir kelime bile yoktur.'],
  ['Dev ceviz ormanı', "Arslanbob, dünyanın kendiliğinden yetişmiş en büyük ceviz ormanıdır."],
  ['Lale aslında Türk', 'İngilizce "tulip" kelimesi Türkçe "tülbent" kelimesinden gelir.'],
  ['Peri bacalarında periler', "Kapadokya'daki peri bacalarında hâlâ küçük periler yaşar."],
];
const SAKA = 7;
function bilgi(el) {
  el.append(h(`<p class="lead">8 damla düştü: 7'si gerçek, 1'i şaka. Şaka olana dokun! <span>Тамашасын тап!</span></p><div class="drops"></div><div class="res"></div>`));
  const box = el.querySelector('.drops'), res = el.querySelector('.res');
  let done = false;
  DAMLA.forEach(([t, d], i) => {
    const b = h(`<button class="drop"><b>${i + 1}</b><span>${t}</span><small>${d}</small></button>`).firstChild;
    b.onclick = () => {
      if (done) return;
      if (i === SAKA) {
        done = true; b.classList.add('ok');
        res.innerHTML = `<div class="win">Bravo! Doğru buldun! <span>Азаматсың!</span></div><p>Peri bacalarında periler yaşamaz, ama içlerinde otel odaları vardır. Geceleri yanan ışıklar otellerin ışıklarıdır.</p>`;
      } else {
        b.classList.add('no'); b.disabled = true;
        res.innerHTML = `<p class="try">Bu bilgi gerçek! Bir daha dene. <span>Бул чын! Дагы аракет кыл.</span></p>`;
      }
    };
    box.appendChild(b);
  });
}

// ---------- Cevaplar ----------
function cevap(el, which) {
  const C = {
    17: ['Kimin İzi?', [['1. iz', 'Anadolu parsı'], ['2. iz', 'Kangal köpeği'], ['3. iz', 'Caretta caretta (deniz kaplumbağası)']]],
    18: ['Taşta hangi hayvanı görüyorsun?', [['Cevap', 'Tilki! Göbeklitepe taşlarında tilki, yaban domuzu, yılan ve kuş resimleri vardır.']]],
  }[which];
  el.append(h(`<div class="ans-h">${C[0]}</div>`));
  C[1].forEach(([k, v]) => {
    const r = h(`<button class="reveal"><span class="k">${k}</span><span class="v">Görmek için dokun · Көрүү үчүн бас</span></button>`).firstChild;
    r.onclick = () => { r.querySelector('.v').textContent = v; r.classList.add('open'); };
    el.appendChild(r);
  });
}

window.BULUT_EXTRA = {
  5: kulak,
  17: (el) => { cevap(el, 17); el.append(h(`<p class="soon2">Kar leoparı videoları yakında! · Видеолор жакында!</p>`)); },
  18: (el) => { cevap(el, 18); el.append(h(`<p class="soon2">Rota anketi yakında! · Сурамжылоо жакында!</p>`)); },
  19: bilgi,
};
