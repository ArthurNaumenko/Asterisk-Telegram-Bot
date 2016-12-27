var exports = module.exports = {};

// Create an inline keyboard with operator and customer numbers as callback data
exports.createInlineKeyboard = function (isShow) {
  if (isShow) {
    return JSON.stringify({
      inline_keyboard: [
        [
          {text:'🔽   SHOW KEYBOARD   🔽',callback_data:'show'}
        ]
      ]
    });
  } else {
    return JSON.stringify({
      inline_keyboard: [
        [
          {text:'201',callback_data:'201'},
          {text:'202',callback_data:'202'},
          {text:'301',callback_data:'301'},
          {text:'302',callback_data:'302'}
        ],
        [
          {text:'401',callback_data:'401'},
          {text:'402',callback_data:'402'},
          {text:'501',callback_data:'501'},
          {text:'502',callback_data:'502'}
        ]
      ]
    });
  }
}
