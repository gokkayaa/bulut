/**
 * Dijital BULUT — cevap toplama servisi
 * Cevaplar "BULUT Cevaplar" Google E-Tablosuna yazılır (TABLO_ID).
 * Kurulum: script.google.com > Yeni proje > bu kodu yapıştır > Dağıt > Yeni dağıtım > Web uygulaması
 *   Yürüten: Ben · Erişimi olan: Herkes
 */

const FOTO_KLASOR = 'BULUT Fotoğrafları';
const TABLO_ID = '1H6JOTwX2jp6jkBpCdEj_wMOBvDA_E6ejq7VPm1wEQaw';   // BULUT Cevaplar tablosu

const SAYFALAR = {
  oy:   ['Oylar',        ['Tarih', 'Soru', 'Seçim']],
  avi:  ['BULUT Avı',    ['Tarih', 'Ad Soyad', 'Sınıf', 'Cevap', 'Doğru mu?']],
  soz:  ['Söz Sende',    ['Tarih', 'Ad Soyad', 'Sınıf', 'Balon 1', 'Balon 2', 'Balon 3', 'Balon 4']],
  foto: ['Fotoğraflar',  ['Tarih', 'Ad Soyad', 'Sınıf', 'Tür', 'Dosya', 'Bağlantı']],
};
// Doğru cevabın kendisi burada yazmıyor; yalnızca parmak izi (SHA-256) var. Kod herkese açık olsa da cevap görünmez.
const CEVAP_IZI = '4e91fcc9b079a9b94ecadb9a8c121f167b487066f9f6c33de694920625a2b49a';

function iz_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('');
}
// Büyük harfe çevirir, Türkçe harfleri sadeleştirir (İ/I, Ş/S…): farklı klavyeden yazan da doğru sayılır.
function normal_(s) {
  const T = { 'İ': 'I', 'ı': 'I', 'i': 'I', 'Ç': 'C', 'ç': 'C', 'Ğ': 'G', 'ğ': 'G', 'Ö': 'O', 'ö': 'O', 'Ş': 'S', 'ş': 'S', 'Ü': 'U', 'ü': 'U' };
  return String(s || '').replace(/[İıiÇçĞğÖöŞşÜü]/g, c => T[c]).toUpperCase().replace(/[^A-Z]/g, '');
}

// Tek seferlik düzenleme: tablo saatini Bişkek'e ayarla, "conflict" sekmelerini ve TEST satırlarını sil.
function kur_() {
  const pr = PropertiesService.getScriptProperties();
  if (pr.getProperty('kurulum') === '3') return;
  const ss = SpreadsheetApp.openById(TABLO_ID);
  ss.setSpreadsheetTimeZone('Asia/Bishkek');
  ss.getSheets().forEach(sh => { if (/_conflict/i.test(sh.getName()) && ss.getSheets().length > 1) ss.deleteSheet(sh); });
  const oy = ss.getSheetByName(SAYFALAR.oy[0]);
  if (oy && oy.getLastRow() > 1) {
    const v = oy.getRange(2, 2, oy.getLastRow() - 1, 1).getValues();
    for (let r = v.length - 1; r >= 0; r--) if (String(v[r][0]).toUpperCase() === 'TEST') oy.deleteRow(r + 2);
  }
  pr.setProperty('kurulum', '3');
}

function sayfa_(tur) {
  const [ad, basliklar] = SAYFALAR[tur];
  const ss = SpreadsheetApp.openById(TABLO_ID);
  let sh = ss.getSheetByName(ad);
  if (!sh) {
    sh = ss.insertSheet(ad);
    sh.appendRow(basliklar);
    sh.getRange(1, 1, 1, basliklar.length).setFontWeight('bold').setBackground('#00adb9').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

function temiz_(s, n) { return String(s || '').replace(/[<>]/g, '').trim().slice(0, n || 200); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    try { kur_(); } catch (x) {}
    const d = JSON.parse(e.postData.contents);
    const now = new Date();
    if (d.tur === 'oy') {
      sayfa_('oy').appendRow([now, temiz_(d.soru, 40), temiz_(d.secim, 60)]);
      return json_({ ok: true, sonuc: sonuc_(d.soru) });
    }
    if (d.tur === 'avi') {
      const cevap = temiz_(d.cevap, 80), ad = temiz_(d.ad, 60), sinif = temiz_(d.sinif, 10);
      let dogru = iz_(normal_(cevap)) === CEVAP_IZI ? 'EVET' : 'hayır';
      if (dogru === 'EVET') {   // aynı öğrenci ikinci kez doğru gönderirse "tekrar" yazılır (çekilişte bir kez sayılsın)
        const sh = sayfa_('avi'), n = sh.getLastRow(), kim = normal_(ad) + '|' + normal_(sinif);
        if (n > 1 && sh.getRange(2, 2, n - 1, 4).getValues().some(([a, s2, , e]) => String(e).indexOf('EVET') === 0 && normal_(a) + '|' + normal_(s2) === kim)) dogru = 'EVET (tekrar)';
      }
      sayfa_('avi').appendRow([now, ad, sinif, cevap, dogru]);
      return json_({ ok: true });
    }
    if (d.tur === 'soz') {
      const b = (d.balonlar || []).map(x => temiz_(x, 120));
      sayfa_('soz').appendRow([now, temiz_(d.ad, 60), temiz_(d.sinif, 10), b[0] || '', b[1] || '', b[2] || '', b[3] || '']);
      return json_({ ok: true });
    }
    if (d.tur === 'foto') {
      const it = DriveApp.getFoldersByName(FOTO_KLASOR);
      const klasor = it.hasNext() ? it.next() : DriveApp.createFolder(FOTO_KLASOR);
      const ad = temiz_(d.ad, 60), sinif = temiz_(d.sinif, 10);
      const dosyaAdi = `${Utilities.formatDate(now, 'Asia/Bishkek', 'yyyy-MM-dd_HH-mm')}_${sinif}_${ad}_${temiz_(d.dosya, 80)}`.replace(/[\\/:*?"<>|]/g, '');
      const blob = Utilities.newBlob(Utilities.base64Decode(d.veri), temiz_(d.mime, 40) || 'image/jpeg', dosyaAdi);
      const f = klasor.createFile(blob);   // orijinal boyutunda kaydedilir
      sayfa_('foto').appendRow([now, ad, sinif, temiz_(d.konu, 40), dosyaAdi, f.getUrl()]);
      return json_({ ok: true });
    }
    return json_({ ok: false, hata: 'bilinmeyen tür' });
  } catch (err) {
    return json_({ ok: false, hata: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Oy sonuçları: ?soru=cay  → {secim: sayı, ...}
function sonuc_(soru) {
  const sh = SpreadsheetApp.openById(TABLO_ID).getSheetByName(SAYFALAR.oy[0]);
  if (!sh) return {};
  const n = sh.getLastRow();
  const say = {};
  if (n > 1) sh.getRange(2, 2, n - 1, 2).getValues().forEach(([s, c]) => { if (s === soru) say[c] = (say[c] || 0) + 1; });
  return say;
}

function doGet(e) {
  try { kur_(); } catch (x) {}
  const sayac = e && e.parameter && e.parameter.sayac;
  if (sayac !== undefined) {
    const lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      const pr = PropertiesService.getScriptProperties();
      let n = Number(pr.getProperty('ziyaret') || 0);
      if (sayac === '1') { n++; pr.setProperty('ziyaret', String(n)); }
      return json_({ ok: true, ziyaret: n });
    } finally { lock.releaseLock(); }
  }
  const soru = e && e.parameter && e.parameter.soru;
  if (soru) return json_({ ok: true, sonuc: sonuc_(soru) });
  return json_({ ok: true, mesaj: 'Dijital BULUT servisi çalışıyor.' });
}
