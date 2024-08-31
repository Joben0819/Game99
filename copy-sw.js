const fs = require("fs");
const path = require("path");

// Get the environment argument, default to 'development'
const env = process.argv[2] || "development";
console.log('Args', process.argv)
// Define the source and destination file paths
const sourceIndex = path.join(__dirname, "public", `firebase-messaging-sw-${env}.js`);
const destIndex = path.join(__dirname, "public", "firebase-messaging-sw.js");
// Copy the source file to the destination
fs.copyFileSync(sourceIndex, destIndex);
console.log(`Copied ${sourceIndex} to ${destIndex}`);
