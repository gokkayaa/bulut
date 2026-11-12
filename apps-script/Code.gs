/**
 * Dijital BULUT — cevap toplama servisi
 * Bu kod "BULUT Cevaplar" Google E-Tablosuna bağlı çalışır.
 * Kurulum: E-Tablo > Uzantılar > Apps Script > bu kodu yapıştır > Dağıt > Yeni dağıtım > Web uygulaması
 *   Yürüten: Ben · Erişimi olan: Herkes
 */

const FOTO_KLASOR = 'BULUT Fotoğrafları';

const SAYFALAR = {
  oy:   ['Oylar',        ['Tarih', 'Soru', 'Seçim']],
  avi:  ['BULUT Avı',    ['Tarih', 'Ad Soyad', 'Sınıf', 'Cevap', 'Doğru mu?']],
  soz:  ['Söz Sende',    ['Tarih', 'Ad Soyad', 'Sınıf', 'Balon 1', 'Balon 2', 'Balon 3', 'Balon 4']],
  foto: ['Fotoğraflar',  ['Tarih', 'Ad Soyad', 'Sınıf', 'Tür', 'Dosya', 'Bağlantı']],
};
const DOGRU_CEVAP = 'HEDEFİNBULUTLAROLSUN';

function sayfa_(tur) {
  const [ad, basliklar] = SAYFALAR[tur];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
    const d = JSON.parse(e.postData.contents);
    const now = new Date();
    if (d.tur === 'oy') {
      sayfa_('oy').appendRow([now, temiz_(d.soru, 40), temiz_(d.secim, 60)]);
      return json_({ ok: true, sonuc: sonuc_(d.soru) });
    }
    if (d.tur === 'avi') {
      const cevap = temiz_(d.cevap, 80);
      const norm = cevap.toLocaleUpperCase('tr-TR').replace(/[^A-ZÇĞİÖŞÜ]/g, '');
      sayfa_('avi').appendRow([now, temiz_(d.ad, 60), temiz_(d.sinif, 10), cevap, norm === DOGRU_CEVAP ? 'EVET' : 'hayır']);
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
  const sh = sayfa_('oy');
  const n = sh.getLastRow();
  const say = {};
  if (n > 1) sh.getRange(2, 2, n - 1, 2).getValues().forEach(([s, c]) => { if (s === soru) say[c] = (say[c] || 0) + 1; });
  return say;
}

function doGet(e) {
  const soru = e && e.parameter && e.parameter.soru;
  if (soru) return json_({ ok: true, sonuc: sonuc_(soru) });
  return json_({ ok: true, mesaj: 'Dijital BULUT servisi çalışıyor.' });
}
