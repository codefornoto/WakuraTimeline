/**
* WebAPIとして呼ばれる場合のエントリポイント
// */
function doGet() {
  const spreadsheetId = "YOUR_SPREADSHEET_ID";
  const sheetName = "monzen";
  
  //アクティブシートを取得して変数sheetに格納
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues(); // 全データを取得

    const template = HtmlService.createTemplateFromFile('chronology');
    template.data = data.slice(1)
    const htmlOutput = template.evaluate()
     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return htmlOutput;
}

// function doGet() {
//   const template = HtmlService.createTemplateFromFile('chronology');
//     template.data = data.slice(1)
//      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
//     return htmlOutput;
// }

function getSpreadsheetData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues(); // 全データを取得
  return data.slice(1); // ヘッダー行を除外して返す
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/**
*
* @return {Array<string>} data jsonデータを返す
*/
function getJSONFromSheet(sheet) {
    console.time('getJSONFromSheet("' + sheet + '")');
    var result = convSheet('1yzsKxwVx-daQRxGJGSnEZQf0fd5GFuzkBWwOcIMH-Zg', sheet);
    console.timeEnd('getJSONFromSheet("' + sheet + '")');

    return JSON.stringify(result);
}