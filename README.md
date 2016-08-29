# Asterisk Telegram Bot

A Node.js telephony server app for Telegram that uses [Node.js Asterisk Manager](https://github.com/pipobscure/NodeJS-AsteriskManager) to simplify the missed calls processing.
When there's a missed call Askozia sends a request to this application that is intercepted by [Express](https://github.com/expressjs/express) and it triggers the bot to
send a message to a specified chat. For my Bot I use [Node Telegram bot Api](https://github.com/yagop/node-telegram-bot-api).

# How it all works:

First we get a request from Askozia of type http://ip:port/missed/phone number/time customer waited in seconds
The following code proccesses this request:

```javascript
app.get('/missed/:phone/:duration', function(req, res) {
  // get phone and waiting time, send message with inline keyboard to telegram chat spesified in config.js
});
```
And that's what we get in Telegram:<br>
<img width="500" alt="1" src="https://cloud.githubusercontent.com/assets/12981076/17925886/6a52b882-69f7-11e6-99f3-f2e33c8b17bc.png">

The inline keyboard under the message represents operators' internal phone numbers. Clicking this button does not
result in messages sent to the char rather it works as callback querry. The bot receives it:
```javascript
bot.on('callback_query', function (msg) {
  /* The json object we receive contains callback data from the button we click here: msg.data
     Do your stuff */
});
```

Once a button has been clicked the phone call is initiated first to the operator.
The inline keyboard gets hidden so other operators are not able to call the same number that's being dialed:<br>
<img width="500" alt="snip_20160824122502" src="https://cloud.githubusercontent.com/assets/12981076/17925976/ce8e7ffc-69f7-11e6-9bcd-73a5bf698a87.png">

When the operator picks up the phone, the call is redirected to the customer.
Fancy emojis make it more intuitive for operators :) 
If a customer answered the call this is what we get (keyboard still hidden): <br>
<img width="500" alt="snip_20160824122518" src="https://cloud.githubusercontent.com/assets/12981076/17926086/456f31c0-69f8-11e6-861b-185296d9d924.png">

If either the operator or the customer hangs up after successfil dialing the message is updated and the inline keyboard is minimized
to keep the chat clean, avoid situations when operator dials clicking button by mistake. It also indicates that dialing was successful. <br>
<img width="500" alt="snip_20160824122531" src="https://cloud.githubusercontent.com/assets/12981076/17926210/c65be454-69f8-11e6-8a54-44e9ace25785.png">

If for some reason the dial was unsuccessful, the message is updated saying why the operator couldn't reach the customer and the keyboard shows up not minimized:<br>
<img width="500" alt="snip_20160824122554" src="https://cloud.githubusercontent.com/assets/12981076/17926433/c05e8b00-69f9-11e6-8e1b-3816d3b8fddd.png">

Cherry on top - final view of the chat:<br>
<img width="500" alt="asdq" src="https://cloud.githubusercontent.com/assets/12981076/17926475/ec830f80-69f9-11e6-8785-ea10ccb5fb22.png">

All of the above makes the proccess of making return calls simplier more productive.
