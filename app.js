var config = require('./config');
var express = require('express');
var app = express();
var TelegramBot = require('node-telegram-bot-api');

var bot = new TelegramBot(config.token, {
	polling: true
});

var ami = new require('asterisk-manager')(
	config.agi_port,
	config.agi_host,
	config.ami_login,
	config.ami_pass,
	true
);

ami.keepConnected();

app.get('/missed/:phone', function(req, res) {
    var missedCall = req.params.phone;
    var phoneNumber = missedCall.replace('+',"").replace('+',"");

	// ======================= TELEGRAM BOT STUFF START =======================
	var replyText = 'Позвонить по номеру +' + phoneNumber + ' используя внутренний код:';		
	var options = {
  		reply_markup: JSON.stringify({
   			inline_keyboard: [
  				[{text:'101',callback_data:'101'},{text:'202',callback_data:'202'},{text:'301',callback_data:'301'},{text:'302',callback_data:'302'}],
  				[{text:'401',callback_data:'401'},{text:'402',callback_data:'402'},{text:'501',callback_data:'501'},{text:'502',callback_data:'502'}]
			]
  		})	
	}
	bot.sendMessage(chatid, replyText, options);
	// ======================= TELEGRAM BOT STUFF END =======================
    console.log("Пропущенный звонок: " + missedCall);
});

app.listen(config.app_port, function () {
  console.log('App started at ' + config.app_port + ' port!');
});


//chatid = config.chatid;
chatid = config.testchatid;

bot.on('callback_query', function (msg) {
	var ext = msg.data;
	var id = {inline_message_id: msg.id};
	var kboard = {message_id: msg.message.message_id, chat_id: msg.message.chat.id, reply_markup: JSON.stringify({
   			inline_keyboard: [
  				[{text:'101',callback_data:'101'},{text:'202',callback_data:'202'},{text:'301',callback_data:'301'},{text:'302',callback_data:'302'}],
  				[{text:'401',callback_data:'401'},{text:'402',callback_data:'402'},{text:'501',callback_data:'501'},{text:'502',callback_data:'502'}]
			]
  		})
	};
	var number = msg.message.text.substring(21,32);
	bot.answerCallbackQuery(msg.id, 'Звоним +' + number + '...',false);
	dial(number,ext);
	bot.editMessageText("Был совершен звонок по номеру " + number + " с добавочным " + ext, kboard);
});

function dial(num, exten) {
	ami.action({
  			'action': 'originate',
  			'channel':  'SIP/' + exten,
  			'context': config.local_context,
  			'CallerId': 'Alfa Medcenter',
  			'timeout': '6000',
  			'exten': num,
  			'priority': '1'
		}, function(err_ami, res_ami) {}
	);
}