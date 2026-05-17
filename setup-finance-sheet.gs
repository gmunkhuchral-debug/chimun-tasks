/**
 * Чимун_Финанс_Хүсэлт — Apps Script setup
 *
 * Sheet-ийн header-уудыг МОНГОЛЧИЛЖ, огноо/цагийн формат тохируулна,
 * Төлөв/Шийдвэр баганад dropdown суулгана, header freeze хийнэ.
 *
 * АШИГЛАХ:
 * 1. Sheet нээх: https://docs.google.com/spreadsheets/d/1ogJTucQ9BipiJU_kckjS4DmJ7b0BJbh1_eXuoLWZNEI/edit
 * 2. Extensions → Apps Script
 * 3. Бүх кодыг устгаад энэ файлыг paste
 * 4. Save → Function dropdown `setupFinanceSheet` сонгох → Run
 * 5. Authorize зөвшөөрөл өгөх
 * 6. ~3 секундын дотор бүгд тохируулагдана
 */

function setupFinanceSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];

  Logger.log('Setup эхлэв: ' + sheet.getName());

  // Энэ нь n8n workflow ашиглах ЯГ ИЖИЛ дараалал болон нэр байх ёстой
  const HEADERS_MN = [
    'ID',                       // A — системийн ID
    'Илгээгч',                  // B — requested_by (TEAM ID)
    'Илгээсэн огноо',           // C — requested_at (ISO datetime)
    'Дүн',                      // D — amount (тоо)
    'Хүлээн авагч',             // E — beneficiary
    'Зорилго',                  // F — purpose
    'Тайлбар',                  // G — justification
    'Хүссэн огноо',             // H — due_date (date)
    'Төлөв',                    // I — status (open/done/deleted)
    'Шийдвэр',                  // J — decision (pending/approved/rejected/deferred)
    'Шийдвэрийн огноо',         // K — decision_at (ISO datetime)
    'Шийдвэр гаргасан',         // L — decision_by (TEAM ID)
    'Шийдвэрийн шалтгаан',      // M — decision_reason
    'Гүйцэтгэсэн огноо',        // N — executed_at (ISO datetime)
    'Гүйцэтгэгч',               // O — executed_by (TEAM ID)
    'Хариуцагч',                // P — executor (default S03)
    'Худалдан авсан баримт',    // Q — purchase_proof_url (Drive URL)
    'Төлбөрийн баримт',         // R — payment_proof_url (Drive URL)
    'Шинэчилсэн',               // S — updated (ISO datetime)
  ];

  // ❶ Header мөрийг бүхэлд нь арилгаад монгол header-аар сольж бичих
  sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).clearContent();
  sheet.getRange(1, 1, 1, HEADERS_MN.length).setValues([HEADERS_MN]);
  Logger.log('1/5 Header монголжсон');

  // ❷ Header форматлах
  const headerRange = sheet.getRange(1, 1, 1, HEADERS_MN.length);
  headerRange.setFontWeight('bold')
             .setBackground('#e8eaed')
             .setHorizontalAlignment('center')
             .setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 36);
  Logger.log('2/5 Header формат + freeze');

  // ❸ Огноо/цагийн format — C, K, N, S = datetime; H = date only
  const lastRow = Math.max(sheet.getLastRow(), 100);
  ['C', 'K', 'N', 'S'].forEach(col => {
    sheet.getRange(`${col}2:${col}${lastRow}`).setNumberFormat('yyyy-mm-dd HH:mm');
  });
  sheet.getRange(`H2:H${lastRow}`).setNumberFormat('yyyy-mm-dd');
  // Дүн currency формат
  sheet.getRange(`D2:D${lastRow}`).setNumberFormat('[$₮]#,##0;[red][$₮]-#,##0');
  Logger.log('3/5 Огноо + Дүн формат');

  // ❹ Төлөв (I) болон Шийдвэр (J) dropdown
  applyDropdown(sheet, 'I', 2, lastRow, ['open', 'done', 'deleted']);
  applyDropdown(sheet, 'J', 2, lastRow, ['pending', 'approved', 'rejected', 'deferred']);
  Logger.log('4/5 Dropdown суулгасан');

  // ❺ Conditional formatting — Шийдвэр баганаар өнгөтэй
  applyConditionalFormat(sheet, lastRow);
  Logger.log('5/5 Conditional formatting');

  // Багана өргөн автоматаар тааруулах
  sheet.autoResizeColumns(1, HEADERS_MN.length);

  SpreadsheetApp.flush();
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Финанс Sheet тохируулагдсан! 18 баганат, монголоор, бэлэн.',
    '✅ Амжилттай',
    5
  );
  Logger.log('БҮГД OK ✅');
}

function applyDropdown(sheet, colLetter, startRow, endRow, options) {
  const range = sheet.getRange(`${colLetter}${startRow}:${colLetter}${endRow}`);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(options, true)
    .setAllowInvalid(false)
    .setHelpText('Сонгох утга: ' + options.join(', '))
    .build();
  range.setDataValidation(rule);
}

function applyConditionalFormat(sheet, lastRow) {
  const range = sheet.getRange(`A2:S${lastRow}`);
  const rules = sheet.getConditionalFormatRules()
    .filter(r => !r.getRanges()[0].getA1Notation().startsWith('A2'));

  // pending — шар
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$J2="pending"')
    .setBackground('#fef3c7')
    .setRanges([range]).build());

  // approved — цэнхэр
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$J2="approved"')
    .setBackground('#d1fae5')
    .setRanges([range]).build());

  // rejected — улаан + strikethrough
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$J2="rejected"')
    .setBackground('#fee2e2')
    .setFontColor('#991b1b')
    .setStrikethrough(true)
    .setRanges([range]).build());

  // deferred — нил ягаан
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$J2="deferred"')
    .setBackground('#e0e7ff')
    .setRanges([range]).build());

  // Гүйцэтгэсэн (status=done) — Холимог зүгээр өнгөгүй
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($I2="done",$J2="approved")')
    .setBackground('#dcfce7')
    .setFontColor('#166534')
    .setRanges([range]).build());

  sheet.setConditionalFormatRules(rules);
}
