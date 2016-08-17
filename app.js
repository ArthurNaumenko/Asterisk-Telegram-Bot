/*
	Application that sends messages to telegram with phone numbers when a customer
	cannot reach the call-center.
*/

//	******************************************* Dependencies *******************************************

var config = require('./config');
// Express
var express = require('express');
var app = express();
// Telegram
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(config.token, {
	polling: true
});
// Asterisk Manager
var ami = new require('asterisk-manager')(
	config.agi_port,
	config.agi_host,
	config.ami_login,
	config.ami_pass,
	true
);
ami.keepConnected();

//	******************************************* Express *******************************************

/*	Receive get-request containing a phone number sent by Askozia.
	Send message to telegram chat informing the operator about missed call and
	the number also allowing her to choose which intertal number to use to call back. */
app.get('/missed/:phone/:dura', function(req, res) {
	// Extracting and formatting number to dial
    var missedCall = req.params.phone;  
    var phoneNumber = missedCall.replace('+',"").replace('+',"");
    var duration = req.params.dura;

	var replyText = 'Missed call from +' + phoneNumber + '. Waiting time: ' + duration + ' seconds.';
	// Build a custom inline keyboard with internal telephone extentions		
	var options = {
  		reply_markup: JSON.stringify({
   			inline_keyboard: [
  				[{text:'101',callback_data:'101,'+phoneNumber},{text:'202',callback_data:'202'},{text:'301',callback_data:'301'},{text:'302',callback_data:'302'}],
  				[{text:'401',callback_data:'401'},{text:'402',callback_data:'402'},{text:'501',callback_data:'501'},{text:'502',callback_data:'502'}]
			]

  		})
	}
	// Send a message with inline buttons to the chat
	bot.sendMessage(config.chatid, replyText, options);
});

app.listen(config.app_port, function () {
  console.log('App started at ' + config.app_port + ' port!');
});

//	******************************************* Telegram *******************************************

// Respond to callback querry from the previous message 
bot.on('callback_query', function (msg) {
	// Extract internal number from JSON
	var ext = msg.data;
	var arr = ext.split(",");

	// Create different message options
	var message = msg.message.text
	var midMsg = message + "\n⚠️" + arr[0] + " dialing " + arr[1] + '...';

	/*  After a handful of attempts to make the inline keyboard stay after changing the message text
		inserting json object with keyboard in it appeared to be a fine workaround. */
	var idKboard = {message_id: msg.message.message_id, chat_id: msg.message.chat.id, reply_markup: JSON.stringify({
   			inline_keyboard: [
  				[{text:'101',callback_data:'101,'+arr[1]},{text:'202',callback_data:'202'},{text:'301',callback_data:'301'},{text:'302',callback_data:'302'}],
  				[{text:'401',callback_data:'401'},{text:'402',callback_data:'402'},{text:'501',callback_data:'501'},{text:'502',callback_data:'502'}]
			]
  		})
	};
	// Extract number to dial from  message text
	bot.answerCallbackQuery(msg.id, 'Dialing +' + arr[1] + '...',false);
	// Change the message text to assure the operator that ths number has been called
	bot.editMessageText(midMsg, idKboard);
	// Call Asterisk manager method that will initiate dialing
	dial(arr[1],arr[0], callback, message, idKboard);
});

//	******************************************* Asterisk *******************************************

/*
	Initiating a phone call. It first calls the operator and once she accepted the call it dials the customer.

	Full list of Asterisk actions may be found at:
	https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Actions
*/

function dial(num, exten, callback, message, array) {
	ami.action({
  			'action': 'originate',
  			'channel':  'SIP/' + exten,
  			'context': config.local_context,
  			'CallerId': 'Alfa Medcenter',
  			'timeout': '6000',
  			'exten': num,
  			'priority': '1'
		}, function(err_ami, res_ami) {
			if (res_ami.response === "Success") {
				callback(message + "\n✅"+exten+" reached "+num , array);
			} else {
				callback(message + "\n🚫"+exten+" couldn't reach "+num, array);
			}
		});
}

// callback function that changes message upon call result
function callback(message, array) {
	// Change the message text to assure the operator that ths number has been called
	bot.editMessageText(message, array);
}
