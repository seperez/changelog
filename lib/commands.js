const fs = require('fs');
const { formatDate } = require('./date');
const { CHANGELOG_FILE_PATH } = require('./config');

const handleMessage = (message) => {
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
}

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

module.exports = { handleMessage, addNewMilestone, showMilestone, count }