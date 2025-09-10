// generate-jwt-key.js
const  crypto = require("crypto");

// Generate a 64-byte random key (can adjust length)
const jwtSecret = crypto.randomBytes(64).toString("hex");

console.log("Your new JWT_SECRET:");
console.log(jwtSecret);
