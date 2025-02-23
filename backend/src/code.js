const SPREADSHEET_ID = "1os23-95ilkH99LN5BFW_eDo-6rqR3T68enHo-aiIhAQ"; // データを保存する Google スプレッドシートの ID
const sheetUrl =
  "https://docs.google.com/spreadsheets/d/1os23-95ilkH99LN5BFW_eDo-6rqR3T68enHo-aiIhAQ/";
const FOLDER_ID = "13QnuoOMgOyb2u_8WP4cAcV6zNzsTTI2w"; // 画像を保存する Google Drive のフォルダ ID

function doGet(e) {
  const sheetName = e.parameter.sheetName;
  const response = getSheetData(sheetName, e).getContent();

  return createTextOutput(response);
}

function getSheetData(sheetName, e) {
  const sheet = SpreadsheetApp.openByUrl(sheetUrl).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headersRow = data[0];
  const headers = {
    yearIndex: headersRow.indexOf("西暦"),
    eraIndex: headersRow.indexOf("年号"),
    categoryIndex: headersRow.indexOf("区分"),
    eventIndex: headersRow.indexOf("出来事"),
    etcIndex: headersRow.indexOf("補足情報"),
    genreIndex: headersRow.indexOf("ジャンル"),
    referenceIndex: headersRow.indexOf("出典"),
    imageIndex: headersRow.indexOf("画像URL"),
    latitude: headersRow.indexOf("緯度"),
    longitude: headersRow.indexOf("経度"),
  };
  const items = [];

  // ヘッダー行をスキップしてデータを処理
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let item;
    item = setJsonKey(row, headers);
    items.push(item);
  }

  return createTextOutput(
    JSON.stringify({
      status: "success",
      data: items,
    })
  );
}

function setJsonKey(row, headers) {
  return {
    year: row[headers.yearIndex],
    era: row[headers.eraIndex],
    category: row[headers.categoryIndex],
    event: row[headers.eventIndex],
    etc: row[headers.etcIndex],
    genre: row[headers.genreIndex],
    reference: row[headers.referenceIndex],
    image: row[headers.imageIndex],
    latitude: row[headers.latitude],
    longitude: row[headers.longitude],
  };
}

function uploadFile(formData) {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const blob = Utilities.newBlob(
    Utilities.base64Decode(formData.imageData),
    "image/jpeg",
    formData.imageName
  );
  if (formData.imageData !== "") {
    const file = folder.createFile(blob);
    const fileId = file.getId();
    return "https://lh3.googleusercontent.com/d/" + fileId;
  }
  return "";
}

function updateSheet(formData, sheetName = "wakura") {
  const fileUrl = uploadFile(formData);
  const sheet =
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  sheet.appendRow([
    formData.year,
    formData.era,
    formData.category,
    formData.event,
    formData.etc,
    formData.genre,
    formData.reference,
    fileUrl,
    formData.latitude,
    formData.longitude,
  ]);
}

function doPost(e) {
  try {
    const formData = e.parameter;
    const sheetName = e.parameter.sheetName;
    updateSheet(formData, sheetName);

    return createTextOutput(
      JSON.stringify({
        status: "success",
        data: null,
      })
    );
  } catch (error) {
    return createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    );
  }
}

function testGet() {
  const sheetName = "wakura";
  const e = { parameter: { sheetName: sheetName } };
  const result = getSheetData(sheetName, e).getContent();
  Logger.log(result);
}

function createTextOutput(content) {
  return ContentService.createTextOutput(content).setMimeType(
    ContentService.MimeType.JSON
  );
}
