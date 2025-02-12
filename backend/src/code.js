const SPREADSHEET_ID = "1os23-95ilkH99LN5BFW_eDo-6rqR3T68enHo-aiIhAQ"; // データを保存する Google スプレッドシートの ID
const sheetUrl =
  "https://docs.google.com/spreadsheets/d/1os23-95ilkH99LN5BFW_eDo-6rqR3T68enHo-aiIhAQ/";
const FOLDER_ID = "13QnuoOMgOyb2u_8WP4cAcV6zNzsTTI2w"; // 画像を保存する Google Drive のフォルダ ID

function doGet(e) {
  const sheetName = e.parameter.sheetName;
  const response = getSheetData(sheetName, e);

  return ContentService.createTextOutput(response).setMimeType(
    ContentService.MimeType.JSON
  );
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
    image: row[headers.indexOf("画像URL")],
  };
}

function uploadFile(formData) {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const blob = Utilities.newBlob(
    Utilities.base64Decode(formData.imageData),
    "image/jpeg",
    formData.imageName
  );
  const file = folder.createFile(blob);

  const fileId = file.getId();
  const fileUrl = "https://lh3.googleusercontent.com/d/" + fileId; // 画像表示用のURL
  return fileUrl;
}

function updateSheet(formData) {
  const fileUrl = uploadFile(formData);
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Events");
  sheet.appendRow([
    formData.year,
    formData.era,
    formData.category,
    formData.event,
    formData.etc,
    formData.genre,
    formData.reference,
    fileUrl,
  ]);
}

function doPost(e) {
  try {
    const formData = e.parameter;
    const response = updateSheet(formData);

    const output = ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        data: response,
      })
    ).setMimeType(ContentService.MimeType.JSON);

    return output;
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function testUploadFile() {
  var formData = {
    year: "2025",
    era: "Reiwa",
    category: "Test",
    event: "Dummy Image Upload",
    etc: "N/A",
    genre: "Testing",
    reference: "N/A",
    imageName: "dummy.jpg",
    imageData: "R0lGODdhAQABAIABAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", // 1x1ピクセルのGIF画像
  };

  var response = uploadFile(formData);
}

function testDoPost() {
  var formData = {
    year: "2025",
    era: "Reiwa",
    category: "Test",
    event: "Dummy Image Upload",
    etc: "N/A",
    genre: "Testing",
    reference: "N/A",
    imageName: "dummyPost.jpg",
    imageData: "R0lGODdhAQABAIABAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", // 1x1ピクセルのGIF画像
  };

  var mockEvent = {
    postData: {
      contents: JSON.stringify(formData),
    },
  };

  var response = doPost(mockEvent);
}
