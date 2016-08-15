# Asterisk Telegram Bot

A Node.js telephony server app for Telegram that uses [Node.js Asterisk Manager](https://github.com/pipobscure/NodeJS-AsteriskManager) to simplify the missed calls processing.
When there's a missed call Askozia sends a request to this application that is intercepted by [Express](https://github.com/expressjs/express) and it triggers the bot to
send a message to a specified chat. For my Bot I use [Node Telegram bot Api](https://github.com/yagop/node-telegram-bot-api).
