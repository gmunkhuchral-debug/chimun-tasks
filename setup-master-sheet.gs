/**
 * Чимун_ХХК_Ажилтны_бүртгэл_Master — Apps Script setup
 *
 * Нэг товчоор Sheet-ийн validation, dropdown, formatting,
 * conditional formatting, freeze header — бүгдийг тохируулна.
 *
 * Бас өгөгдлийн 3 жижиг алдааг автомат засна:
 *   - Дэлгэрбат-ийн "Хавсарсан бүлэг = Store" cell цэвэрлэх
 *   - Цэлмэг-ийн comma-той role-ийг засах
 *   - Анужин-ы давхардсан "Camp/Camp" хавсаргыг засах
 *
 * АШИГЛАХ ЗААВАР:
 * 1. Master Sheet нээх: https://docs.google.com/spreadsheets/d/1so0IBwfok7_Tss3y25a-40qybGe9SGHimkuXrihuWvM/edit
 * 2. Дээд цэснээс: Extensions → Apps Script
 * 3. Шинэ tab нээгдэнэ. Code.gs дотор бүх кодыг устгаад энэ файлыг бүхэлд нь copy/paste хийх
 * 4. Дээр баруун буланд Save (💾) товч дарах
 * 5. Function dropdown-аас `setupMasterSheet` сонгох → Run (▶)
 * 6. Эрх асуувал Allow / Authorize дарах (Google account-аа баталгаажуулна)
 * 7. ~5 секундын дотор бүх validation, formatting тохируулагдана
 *
 * Дахин ажиллуулж болно — idempotent (давтан ажиллуулж болохгүй гэмтэхгүй).
 */

function setupMasterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0]; // Эхний sheet (хуудас1)

  Logger.log('Setup эхлэв: ' + sheet.getName());

  // ───── 1. Header freeze ─────
  sheet.setFrozenRows(1);

  // Header мөрийг bold + хөнгөн фонтой болгох
  const lastCol = sheet.getLastColumn();
  const headerRange = sheet.getRange(1, 1, 1, lastCol);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#e8eaed');
  headerRange.setHorizontalAlignment('center');

  Logger.log('1/8 Header freeze + format OK');

  // ───── 2. Data fixes (3 known issues) ─────
  fixKnownDataIssues(sheet);

  Logger.log('2/8 Data fixes хийгдсэн');

  // ───── 3. Бүлэг (D) dropdown ─────
  const lastRow = Math.max(sheet.getLastRow(), 50); // 50 хүртэл validation барина
  applyDropdown(sheet, 'D', 2, lastRow, ['Нэгдсэн', 'M Event', 'Camp']);
  Logger.log('3/8 Бүлэг dropdown OK');

  // ───── 4. Хавсарсан бүлэг (E) dropdown — допускает хоосон ─────
  applyDropdown(sheet, 'E', 2, lastRow, ['Нэгдсэн', 'M Event', 'Camp'], true);
  Logger.log('4/8 Хавсарсан dropdown OK');

  // ───── 5. Зэрэглэл (F) dropdown ─────
  applyDropdown(sheet, 'F', 2, lastRow, ['100', '80', '60', '50', '40']);
  Logger.log('5/8 Зэрэглэл dropdown OK');

  // ───── 6. Төлөв (J) dropdown ─────
  applyDropdown(sheet, 'J', 2, lastRow, ['идэвхтэй', 'улирлын', 'амралттай', 'гарсан', 'нээлттэй']);
  Logger.log('6/8 Төлөв dropdown OK');

  // ───── 7. Currency (N) + Date (K, L, M) formatting ─────
  sheet.getRange('N2:N' + lastRow).setNumberFormat('[$₮]#,##0;[red][$₮]-#,##0');
  sheet.getRange('K2:M' + lastRow).setNumberFormat('yyyy-mm-dd');
  Logger.log('7/8 Currency + Date format OK');

  // ───── 8. Conditional formatting (status-аар өнгө) ─────
  applyConditionalFormat(sheet, lastRow);
  Logger.log('8/8 Conditional formatting OK');

  // ───── Дуусгал ─────
  SpreadsheetApp.flush();
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Чимун Master Sheet тохируулагдсан! Бүгд бэлэн.',
    '✅ Амжилттай',
    5
  );
  Logger.log('БҮГД OK ✅');
}

/**
 * Data issue засагч.
 */
function fixKnownDataIssues(sheet) {
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(1, 1, lastRow, 18).getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const id = String(row[0]).trim();
    const name = String(row[1]).trim();
    const role = String(row[2]).trim();
    const primary = String(row[3]).trim();
    const secondary = String(row[4]).trim();

    let changed = false;

    // Fix 1: Дэлгэрбат — clear Store from Хавсарсан
    if (id === 'C01' && secondary === 'Store') {
      sheet.getRange(i + 1, 5).clearContent();
      changed = true;
      Logger.log('Дэлгэрбат: Хавсарсан=Store цэвэрлэгдсэн');
    }

    // Fix 2: Цэлмэг — split comma-separated role
    if (id === 'C06' && role.indexOf(',') > -1) {
      // "Кемп туслах,Бартендер" → role="Кемп туслах", тэмдэглэл-д "Бартендер хавсарсан"
      const parts = role.split(',').map(s => s.trim()).filter(Boolean);
      sheet.getRange(i + 1, 3).setValue(parts[0]);
      const noteCol = 18;
      const currentNote = String(row[noteCol - 1] || '').trim();
      const extras = parts.slice(1).join(' + ');
      const newNote = currentNote
        ? (currentNote + ' · ' + extras + ' хавсарсан')
        : (extras + ' хавсарсан');
      sheet.getRange(i + 1, noteCol).setValue(newNote);
      changed = true;
      Logger.log('Цэлмэг: role-аас Бартендер тэмдэглэлд шилжсэн');
    }

    // Fix 3: Анужин — Camp/Camp давхардал → Нэгдсэн/Camp болгох
    if (id === 'S01' && primary === 'Camp' && secondary === 'Camp') {
      sheet.getRange(i + 1, 4).setValue('Нэгдсэн');
      // Хавсарсан хэвээр Camp үлдээх (она finance year-round + Camp manager during summer)
      changed = true;
      Logger.log('Анужин: Бүлэг=Camp→Нэгдсэн (Хавсарсан=Camp хэвээр)');
    }
  }
}

/**
 * Багана column-н range-д dropdown validation тавих.
 */
function applyDropdown(sheet, colLetter, startRow, endRow, options, allowEmpty) {
  const range = sheet.getRange(colLetter + startRow + ':' + colLetter + endRow);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(options, true) // showDropdown=true
    .setAllowInvalid(allowEmpty || false) // буруу утга оруулах боломжтой эсэх
    .setHelpText('Зөвхөн жагсаалтаас сонгоно уу: ' + options.join(', '))
    .build();
  range.setDataValidation(rule);
}

/**
 * Status-аар conditional formatting тавих.
 */
function applyConditionalFormat(sheet, lastRow) {
  const range = sheet.getRange('A2:R' + lastRow);
  const rules = sheet.getConditionalFormatRules();

  // Хуучин Чимун rule-уудыг арилгая (давхрахаас сэргийлэх)
  const filtered = rules.filter(r => {
    const cs = r.getRanges()[0].getA1Notation();
    return !cs.startsWith('A2');
  });

  // Rule 1: гарсан — саарал + strikethrough
  filtered.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$J2="гарсан"')
      .setBackground('#e0e0e0')
      .setFontColor('#888888')
      .setStrikethrough(true)
      .setRanges([range])
      .build()
  );

  // Rule 2: нээлттэй — шар
  filtered.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$J2="нээлттэй"')
      .setBackground('#fff2cc')
      .setItalic(true)
      .setRanges([range])
      .build()
  );

  // Rule 3: улирлын — цэнхэр
  filtered.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$J2="улирлын"')
      .setBackground('#d0e0f0')
      .setRanges([range])
      .build()
  );

  // Rule 4: амралттай — улбар шар
  filtered.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$J2="амралттай"')
      .setBackground('#fce5cd')
      .setRanges([range])
      .build()
  );

  sheet.setConditionalFormatRules(filtered);
}
