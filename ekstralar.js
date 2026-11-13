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

// ---------- Servis (Google Apps Script) ----------
const SERVIS = 'https://script.google.com/macros/s/AKfycbxSTdCiB7F_x7b2nBfbUV8wJ-ZskhRQORiWWqHuy4w5uXkuiZSYcj1rbKjwQbLGxNXBlQ/exec';   // web uygulaması adresi gelince buraya yazılacak
async function gonder(veri) {
  if (!SERVIS) return null;
  try { const r = await fetch(SERVIS, { method: 'POST', body: JSON.stringify(veri) }); return await r.json(); }
  catch (e) { return null; }
}
const hafiza = { al: k => { try { return localStorage.getItem('bulut_' + k); } catch (e) { return null; } },
                 yaz: (k, v) => { try { localStorage.setItem('bulut_' + k, v); } catch (e) {} } };

// ---------- 8. sayfa: O mu, bu mu? ----------
const OMU = [
  ['cay', 'Çay', 'kahve', 0], ['simit', 'Simit', 'boorsok', 0], ['doner', 'Döner', 'plov', 0], ['kimiz', 'Kımız', 'ayran', 2],
  ['tatli', 'Tatlı', 'tuzlu', 1], ['istanbul', 'İstanbul', 'Bişkek', 0], ['yaz', 'Yaz', 'kış', 0], ['sahil', 'Sahil', 'yayla', 1],
  ['sabah', 'Sabah dersi', 'öğleden sonra', 0], ['kalem', 'Tahta kalemi', 'tebeşir', 0], ['futbol', 'Futbol', 'basketbol', 0],
  ['kedi', 'Kedi', 'köpek', 0], ['erken', 'Erken kalkmak', 'geç yatmak', 0],
];
function omu(el) {
  el.append(h(`<video class="vid" src="video/roportaj.mp4" poster="video/roportaj.jpg" controls playsinline preload="metadata"></video>
    <p class="lead">Şimdi sıra sende! Sen hangisini seçerdin? <span>Эми сенин кезегиң! Сен кайсынысын тандайт элең?</span></p><div class="omu"></div>`));
  const box = el.querySelector('.omu');
  OMU.forEach(([id, a, b, hoca], n) => {
    const row = h(`<div class="oq"><div class="on">${n + 1}</div><div class="ob"></div><div class="orz"></div></div>`).firstChild;
    const ob = row.querySelector('.ob'), orz = row.querySelector('.orz');
    const goster = (secim, sonuc) => {
      ob.querySelectorAll('button').forEach(x => { x.disabled = true; x.classList.toggle('sel', x.dataset.v === secim); });
      const hocaTxt = hoca === 2 ? `${a} da olur, ${b} da!` : (hoca === 0 ? a : b);
      let t = `<b>Bülent Hoca:</b> ${hocaTxt}`;
      if (sonuc) {
        const top = (sonuc[a] || 0) + (sonuc[b] || 0) || 1, pa = Math.round(100 * (sonuc[a] || 0) / top);
        t += `<div class="bar"><i style="width:${pa}%"></i></div><small>${a} %${pa} · ${b} %${100 - pa}</small>`;
      }
      orz.innerHTML = t;
    };
    [a, b].forEach(v => {
      const bt = document.createElement('button'); bt.textContent = v; bt.dataset.v = v;
      bt.onclick = async () => { hafiza.yaz('omu_' + id, v); goster(v); const r = await gonder({ tur: 'oy', soru: id, secim: v }); if (r && r.sonuc) goster(v, r.sonuc); };
      ob.appendChild(bt);
    });
    const onceki = hafiza.al('omu_' + id);
    if (onceki) { goster(onceki); if (SERVIS) fetch(SERVIS + '?soru=' + id).then(r => r.json()).then(r => r && r.sonuc && goster(onceki, r.sonuc)).catch(() => {}); }
    box.appendChild(row);
  });
}

// ---------- ortak: ad + sınıf alanları ----------
const kimlik = () => `<div class="frm2"><label>Adın ve soyadın · Атың<input name="ad" maxlength="60" required autocomplete="name"></label>
  <label>Sınıfın · Классың<input name="sinif" maxlength="10" placeholder="8-A" required></label></div>`;
const durum = (el, t, ok) => { el.textContent = t; el.className = 'st ' + (ok === true ? 'good' : ok === false ? 'bad' : ''); };

// ---------- fotoğraf gönderme (orijinal boyut) ----------
function fotoForm(el, konular, baslik) {
  const f = h(`<form class="frm"><div class="fh">${baslik}</div>${kimlik()}
    <label>Konu · Тема<select name="konu">${konular.map(k => `<option>${k}</option>`).join('')}</select></label>
    <label class="file">Fotoğraf seç · Сүрөт танда<input name="dosya" type="file" accept="image/*" required></label>
    <button type="submit">Gönder · Жөнөт</button><div class="pg"><i></i></div><div class="st"></div></form>`).firstChild;
  const st = f.querySelector('.st'), pg = f.querySelector('.pg'), bar = pg.querySelector('i');
  f.onsubmit = e => {
    e.preventDefault();
    const file = f.dosya.files[0]; if (!file) return;
    if (!SERVIS) return durum(st, 'Gönderme şu an kapalı.', false);
    if (file.size > 35e6) return durum(st, 'Fotoğraf çok büyük (35 MB üstü).', false);
    const btn = f.querySelector('button'); btn.disabled = true; durum(st, 'Hazırlanıyor…');
    const rd = new FileReader();
    rd.onload = () => {
      const veri = rd.result.split(',')[1];
      const x = new XMLHttpRequest(); x.open('POST', SERVIS);
      x.upload.onprogress = ev => { if (ev.lengthComputable) { pg.style.display = 'block'; bar.style.width = (100 * ev.loaded / ev.total) + '%'; durum(st, 'Yükleniyor… %' + Math.round(100 * ev.loaded / ev.total)); } };
      x.onload = () => { btn.disabled = false; let r = {}; try { r = JSON.parse(x.responseText); } catch (e) {}
        if (r.ok) { durum(st, 'Teşekkürler! Fotoğrafın bize ulaştı. · Рахмат!', true); f.reset(); bar.style.width = '0'; pg.style.display = 'none'; }
        else durum(st, 'Bir sorun oldu, tekrar dene.', false); };
      x.onerror = () => { btn.disabled = false; durum(st, 'İnternet bağlantını kontrol et, tekrar dene.', false); };
      x.send(JSON.stringify({ tur: 'foto', ad: f.ad.value, sinif: f.sinif.value, konu: f.konu.value, dosya: file.name, mime: file.type, veri }));
    };
    rd.readAsDataURL(file);
  };
  el.appendChild(f);
}

// ---------- rota anketi ----------
const ROTALAR = ['Kapadokya', 'Efes', 'Nemrut Dağı', 'İstanbul'];
function rota(el) {
  const f = h(`<div class="frm"><div class="fh">Bulut'un yeni rotasını sen seç! <span>Булуттун жаңы жолун сен танда!</span></div><div class="rts2"></div><div class="st"></div></div>`).firstChild;
  const box = f.querySelector('.rts2'), st = f.querySelector('.st');
  const goster = (sec, sonuc) => {
    const top = Object.values(sonuc || {}).reduce((a, b) => a + b, 0) || 1;
    box.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.toggle('sel', b.dataset.v === sec);
      if (sonuc) b.querySelector('small').textContent = '%' + Math.round(100 * (sonuc[b.dataset.v] || 0) / top); });
    durum(st, 'Oyun alındı! En çok oy alan yer gelecek sayıda. · Добушуң кабыл алынды!', true);
  };
  ROTALAR.forEach(r => { const b = h(`<button data-v="${r}">${r}<small></small></button>`).firstChild;
    b.onclick = async () => { hafiza.yaz('rota', r); goster(r); const x = await gonder({ tur: 'oy', soru: 'rota', secim: r }); if (x && x.sonuc) goster(r, x.sonuc); };
    box.appendChild(b); });
  const onceki = hafiza.al('rota');
  if (onceki) { goster(onceki); if (SERVIS) fetch(SERVIS + '?soru=rota').then(r => r.json()).then(r => r.sonuc && goster(onceki, r.sonuc)).catch(() => {}); }
  el.appendChild(f);
}

// ---------- BULUT Avı ----------
function avi(el) {
  const f = h(`<form class="frm"><div class="fh">BULUT Avı · Gizli sözü yaz! <span>Жашыруун сөздү жаз!</span></div>
    <p class="hint2">Dergideki mavi daktilo harfleri sırayla yaz. Sözün devamı: "…, ulaşamasan da göğe yükselirsin!"</p>
    ${kimlik()}<label>Gizli söz · Жашыруун сөз<input name="cevap" maxlength="80" required autocomplete="off" autocapitalize="characters"></label>
    <button type="submit">Çekilişe katıl · Катыш</button><div class="st"></div></form>`).firstChild;
  const st = f.querySelector('.st');
  if (hafiza.al('avi')) durum(st, 'Cevabını daha önce gönderdin. Çekilişte bol şans!', true);
  f.onsubmit = async e => { e.preventDefault(); const btn = f.querySelector('button'); btn.disabled = true; durum(st, 'Gönderiliyor…');
    const r = await gonder({ tur: 'avi', ad: f.ad.value, sinif: f.sinif.value, cevap: f.cevap.value });
    btn.disabled = false;
    if (r && r.ok) { hafiza.yaz('avi', '1'); durum(st, 'Cevabın alındı! Çekilişte bol şans! · Ийгилик!', true); f.reset(); }
    else durum(st, 'Bir sorun oldu, tekrar dene.', false); };
  el.appendChild(f);
}

// ---------- Söz Sende ----------
const SAHNE = ['1 · Zil çaldı!', '2 · Yeni arkadaş', '3 · Kantinde', '4 · Eyvah!'];
function soz(el) {
  const f = h(`<form class="frm"><div class="fh">Balonlara sen yaz! <span>Шарчаларга сен жаз!</span></div>
    <p class="hint2">Sence ne dediler? Her resim için bir cümle yaz.</p>${kimlik()}
    ${SAHNE.map((s, i) => `<label>${s}<input name="b${i}" maxlength="120"></label>`).join('')}
    <button type="submit">Gönder · Жөнөт</button><div class="st"></div><p class="hint2">En güzel balonlar gelecek sayıda!</p></form>`).firstChild;
  const st = f.querySelector('.st');
  f.onsubmit = async e => { e.preventDefault(); const btn = f.querySelector('button'); btn.disabled = true; durum(st, 'Gönderiliyor…');
    const r = await gonder({ tur: 'soz', ad: f.ad.value, sinif: f.sinif.value, balonlar: [0, 1, 2, 3].map(i => f['b' + i].value) });
    btn.disabled = false;
    if (r && r.ok) { durum(st, 'Teşekkürler! Balonların bize ulaştı. · Рахмат!', true); f.reset(); } else durum(st, 'Bir sorun oldu, tekrar dene.', false); };
  el.appendChild(f);
  fotoForm(el, ['Söz Sende balonlarım'], 'Kâğıda yazdıysan fotoğrafını gönder! <span>Сүрөтүн жөнөт!</span>');
}

// ---------- 17. sayfa: videolar ----------
const VIDEO = [
  ['Kar leoparı', 'Илбирс', 'Snow Leopard Trust', 'https://snowleopard.org/photos-and-videos/videos', '#5d8a6a'],
  ['Anadolu parsı', 'Анадолу илбирси', 'TRT Haber', 'https://www.trthaber.com/videolar/anadolu-parsi-yeniden-goruntulendi-67949.html', '#c2611f'],
  ['Kangal köpeği', 'Кангал ити', 'TRT Haber', 'https://www.trthaber.com/videolar/kangal-kopegi-bebudan-kuzulara-anne-sefkati-61136.html', '#8a6a3a'],
  ['Caretta caretta', 'Деңиз ташбакасы', 'DHA', 'https://www.dha.com.tr/video/akdenizde-yavru-caretta-heyecani-video-2916542', '#2f6fc1'],
];
function videolar(el) {
  el.append(h(`<p class="lead">Videoları izle! <span>Видеолорду көр!</span></p><div class="vids"></div>`));
  const box = el.querySelector('.vids');
  VIDEO.forEach(([t, k, src, url, c]) => box.append(h(`<a class="vcard" href="${url}" target="_blank" rel="noopener" style="--c:${c}">
    <span class="play">▶</span><span class="vt"><b>${t}</b><small>${k} · ${src}</small></span></a>`)));
}

window.BULUT_EXTRA = {
  12: () => { location.href = 'lezzet.html'; },
  13: () => { location.href = 'lezzet.html'; },
  8: omu,
  5: kulak,
  17: (el) => { videolar(el); cevap(el, 17); },
  18: (el) => { cevap(el, 18); rota(el); },
  9: soz,
  15: (el) => fotoForm(el, ['Gökyüzü', 'Bulut', 'Kış'], 'Gökyüzünün ya da bir bulutun fotoğrafını çek, bize gönder! <span>Асмандын же булуттун сүрөтүн жөнөт!</span>'),
  20: (el) => { avi(el); rota(el); fotoForm(el, ['Kış', 'Gökyüzü / bulut', 'Bulutta hayvan'], 'Gökyüzünü bize gönder! <span>Асманды бизге жөнөт!</span>'); },
  19: bilgi,
};
