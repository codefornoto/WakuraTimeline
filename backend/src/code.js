const sheetUrl =
  "https://docs.google.com/spreadsheets/d/1xyLAGfQFpNZdFLn39wC322Qmpi_oKqEl0ZyXA7vR2cQ/";
function doGet(e) {
  const sheetName = e.parameter.sheetName;
  return getSheetData(sheetName, e);
}

function getSheetData(sheetName, e) {
  const sheet = SpreadsheetApp.openByUrl(sheetUrl).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const items = [];

  // ヘッダー行をスキップしてデータを処理
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let item;
    item = setJsonKey(row, headers);
    items.push(item);
  }

  Logger.log(items);
  // JSONとしてレスポンスを返す
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "success",
      data: items,
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function setJsonKey(row, headers) {
  return {
    year: row[headers.indexOf("西暦")],
    era: row[headers.indexOf("年号")],
    category: row[headers.indexOf("区分")],
    event: row[headers.indexOf("出来事")],
    etc: row[headers.indexOf("補足情報")],
    genre: row[headers.indexOf("ジャンル")],
    reference: row[headers.indexOf("出典")],
  };
}

function testGet() {
  const sheetName = "monzen";
  const e = { parameter: { sheetName: sheetName } };
  const result = doGet(e);
  Logger.log(result);
}
