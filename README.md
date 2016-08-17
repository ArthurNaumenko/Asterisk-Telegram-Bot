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
<img width="500" alt="1" src="https://cloud.githubusercontent.com/assets/12981076/17741314/6b591a26-64a4-11e6-8012-33e4c18517f6.png">

The inline keyboard under the message represents operators' internal phone numbers. Clicking this button does not
result in messages sent to the char rather it works as callback querry. The bot receives it:
```javascript
bot.on('callback_query', function (msg) {
  /* The json object we receive contains callback data from the button we click here: msg.data
     Do your stuff */
});
```

Once a button has been clicked the phone call is initiated first to the operator:<br>
<img width="500" alt="3" src="https://cloud.githubusercontent.com/assets/12981076/17741326/72960510-64a4-11e6-9ef8-cfe55cf409c6.png">

When the operator picks up the phone, the call is redirected to the customer.
Fancy emojis make it more intuitive for operators :) 
If a customer answered the call this is what we get: <br>
<img width="500" alt="4" src="https://cloud.githubusercontent.com/assets/12981076/17741329/75d9259a-64a4-11e6-9dd8-7812cb3bd550.png">

In case an operator couldn't hit the "answer" button, the bot notifies the others:<br>
<img width="500" alt="2" src="https://cloud.githubusercontent.com/assets/12981076/17741321/6feae1e6-64a4-11e6-9b9a-98e24d9394c3.png">

Finally, in case a cusomer could bot answer for some reason and droped the call we get this:<br>
<img width="500" alt="5" src="https://cloud.githubusercontent.com/assets/12981076/17741344/83970c06-64a4-11e6-9989-a4620caf8a6a.png">

...or if he didn't bother to pick up the phone:<br>
<img width="500" alt="6" src="https://cloud.githubusercontent.com/assets/12981076/17741350/8697008c-64a4-11e6-8905-2dc1c8af0c87.png">

All of the above makes the proccess of making return calls simplier more productive.
