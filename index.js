const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, ChatTypes } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';
const CHANGELOG_FILE_PATH = './changelog.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    session: sessionData
});

// Save session values to the file upon successful auth
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

client.on('message', async (message) => {
  let body = message.body.toLocaleLowerCase();
  
  if(body.match(/ping/)){
    message.reply('pong');
  }
  const mentions = await message.getMentions();
  const mentionsToMe = mentions.filter((mention) => mention.verifiedName == "Changelog" );

  if(mentionsToMe.length > 0) {    
    if(body.match(/show/)){
      showMilestone(message);
    }
    if(body.match(/add/)){
      addNewMilestone(message);
    }
    if(body.match(/count/)){
      count(message);
    }
    
    if(body.match(/help/)){
      message.reply('*Funciones:*\n- ping: chequea estado\n- add: agrega un nuevo evento\n- show: muestra todos los eventos\n- count: devuelve la cantidad de eventos');
    }
  }
});

const addNewMilestone = async (message) => {
  const quotedMessage = await message.getQuotedMessage();
  const { body } = quotedMessage;
  const { timestamp } = message;
  const milestone = `${formatDate(timestamp)} - ${body}\n`;

  fs.appendFile(CHANGELOG_FILE_PATH, milestone, (err) => {
    if (err) {
        console.error(err);
        message.reply('No pude guardarlo 🙏');
    }
    message.reply('Recibido 😉');
  });
}

const showMilestone = (message) => {
  fs.readFile(CHANGELOG_FILE_PATH, (err, data) => {
    if (err) {
        console.error(err);
        message.reply('No puedo mostrarlo ahora 🙏');
    }
    const content = data.toString();
    if(content){
      message.reply(content);
    } else {
      message.reply('Todavía no agregaron eventos.');
    }
  });
}

const count = (message) => {
  fs.readFile(CHANGELOG_FILE_PATH, (err, content) => {
    if (err) {
        console.error(err);
        message.reply('No puedo mostrarlo ahora 🙏');
    }
    const contentString = content.toString();
    const lines = contentString.split('\n');

    message.reply(`Hay ${lines.length - 1} eventos.`);
  });
}

const formatDate = (timestamp) => {
  const dateTime = new Date(timestamp * 1000);
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth();
  var date = dateTime.getDate();
  var hour = dateTime.getHours();
  var min = dateTime.getMinutes();
  
  return `${date}/${month}/${year} ${hour}:${min}`;
}
client.initialize();