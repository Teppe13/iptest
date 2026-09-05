/**
 * Google Apps Script สำหรับรับข้อมูลผู้เข้าชมจาก index.html แล้วบันทึกลง Google Sheet
 * (Sheet นี้เป็นของบัญชี Google ของคุณเอง เห็นได้เฉพาะคนที่คุณแชร์ให้เท่านั้น = admin ดูคนเดียว)
 *
 * วิธีติดตั้ง:
 * 1. สร้าง Google Sheet ใหม่ (sheets.new)
 * 2. เมนู Extensions > Apps Script
 * 3. ลบโค้ดเดิมทั้งหมด แล้ววางไฟล์นี้ทั้งไฟล์ลงไปแทน
 * 4. กด Deploy > New deployment
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. กด Deploy แล้ว "Authorize access" ด้วยบัญชี Google ของคุณ
 * 6. คัดลอก Web app URL ที่ได้ (ลงท้ายด้วย /exec)
 * 7. เอา URL ไปวางแทนที่ LOG_ENDPOINT ในไฟล์ index.html
 *
 * หมายเหตุ: ทุกครั้งที่แก้โค้ดนี้ ต้องกด Deploy > Manage deployments > แก้ไข (ไอคอนดินสอ) > Version: New > Deploy ใหม่ทุกครั้ง
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "เวลา (Asia/Bangkok)", "Session ID", "ประเภท", "IP",
      "เมือง", "จังหวัด/ภูมิภาค", "ประเทศ", "รหัสไปรษณีย์", "ISP", "Timezone",
      "Lat (IP)", "Long (IP)", "Lat (GPS)", "Long (GPS)", "ความแม่นยำ GPS (m)",
      "User Agent", "หน้าที่เข้าชม", "Referrer"
    ]);
  }

  try {
    var data = JSON.parse(e.postData.contents);
    var now = Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd HH:mm:ss");

    sheet.appendRow([
      now,
      data.sessionId || "",
      data.type || "",
      data.ip || "",
      data.city || "",
      data.region || "",
      data.country || "",
      data.postal || "",
      data.isp || "",
      data.timezone || "",
      data.lat || "",
      data.lon || "",
      data.gpsLat || "",
      data.gpsLon || "",
      data.gpsAccuracy || "",
      data.userAgent || "",
      data.page || "",
      data.referrer || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
