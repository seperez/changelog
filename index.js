const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const { handleMessage } = require('./lib/commands');
const { SESSION_FILE_PATH } = require('./lib/config');

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', handleMessage);

client.initialize();