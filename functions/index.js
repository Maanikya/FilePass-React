const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.Deletion = functions.https.onCall(async (data, context) => {
  try {
    const filePath = data.filePath;
    const password = data.pwd;
    const db = admin.database();
    const fileRef = db.ref("files");
    const snapshot = await fileRef.once("value");
    const fileData = await snapshot.val();

    const deleteRecord = async () => {
      for (const [key, value] of Object.entries(fileData)) {
        if (password === value.pwd) {
          await fileRef.child(key).remove();
        }
      }
    };

    /* Wait for 1 minute (60 seconds) before deleting the file
    and its metadata */

    setTimeout(async () => {
      try {
        await deleteRecord();
        await admin.storage().bucket().file(filePath).delete();
        console.log("File deleted from Firebase Storage:", filePath);
      } catch (error) {
        console.error("Error deleting file from Firebase Storage:", error);
      }
    }, 60000); // 1 minute in milliseconds

    return "Success";

  } catch (error) {
    console.error("Error scheduling file deletion:", error);
  }
});