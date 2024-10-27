const fs = require('fs');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.DB_ENCRYPTION_KEY, 'salt', 32);
const iv = Buffer.alloc(16, 0); 


function encrypt(data) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}


function decrypt(data) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}


function readDatabase() {
    try {
        const data = fs.readFileSync('./db.txt', 'utf8');
        if (data) {
            return decrypt(data);
        }
        return {}; // Return empty object if no data found
    } catch (error) {
        console.error('Error reading from db.txt:', error);
        return {};
    }
}


function writeDatabase(data) {
    try {
        const encryptedData = encrypt(data);
        fs.writeFileSync('./db.txt', encryptedData, 'utf8');
    } catch (error) {
        console.error('Error writing to db.txt:', error);
    }
}

module.exports = {
    readDatabase,
    writeDatabase
};