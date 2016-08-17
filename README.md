# Asterisk Telegram Bot

A Node.js telephony server app for Telegram that uses [Node.js Asterisk Manager](https://github.com/pipobscure/NodeJS-AsteriskManager) to simplify the missed calls processing.
When there's a missed call Askozia sends a request to this application that is intercepted by [Express](https://github.com/expressjs/express) and it triggers the bot to
send a message to a specified chat. For my Bot I use [Node Telegram bot Api](https://github.com/yagop/node-telegram-bot-api).

Here's how it works:

First we get a request from Askozia of type http://ip:port/missed/phone number/time customer waited in seconds
The following code proccesses this request:

```javascript
app.get('/missed/:phone/:duration', function(req, res) {
  // get phone and waiting time, send message with inline keyboard to telegram chat spesified in config.js
});
```
And that's what we get in Telegram:<br>
<img width="376" alt="1png" src="https://cloud.githubusercontent.com/assets/12981076/17729355/8765d4e4-646c-11e6-90f9-1d9ff05abe70.png">

The inline keyboard under the message represents operators' internal phone numbers. Clicking this button does not
result in messages sent to the char rather it works as callback querry. The bot receives it:
```javascript
bot.on('callback_query', function (msg) {
  /* The json object we receive contains callback data from the button we click here: msg.data
     Do your stuff */
});
```

Once a button has been clicked the phone call is initiated first to the operator:<br>
<img width="339" alt="2" src="https://cloud.githubusercontent.com/assets/12981076/17729380/a4963b30-646c-11e6-9940-4b546961cd77.png">

Finally, when the operator picks up the phone, the call is redirected to the customer.
Fancy emojis make the proccess more intuitive for operators :) <br>
<img width="354" alt="4" src="https://cloud.githubusercontent.com/assets/12981076/17729397/ace90862-646c-11e6-87e6-b54a36752795.png">

All of the above makes the proccess of making return calls simplier and call-center operators more productive. 
