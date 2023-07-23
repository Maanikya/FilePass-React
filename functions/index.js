/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.Deletion = functions.https.onCall(async (data, context) => {
  try {
    const filePath = data.filePath;

    // Wait for 1 minute (60 seconds) before deleting the file
    setTimeout(async () => {
      try {
        await admin.storage().bucket().file(filePath).delete();
        console.log("File deleted from Firebase Storage:", filePath);
      } catch (error) {
        console.error("Error deleting file from Firebase Storage:", error);
      }
    }, 60 * 1000); // 1 minute in milliseconds

    return "Success";
  } catch (error) {
    console.error("Error scheduling file deletion:", error);
  }
});

