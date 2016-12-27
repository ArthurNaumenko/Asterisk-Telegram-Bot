var exports = module.exports = {};

// Check number of lines in the message and clean
// if they are too many to keep the chat clean
exports.trimMessage = function (message) {
  var lines = message.split('\n');
  if (lines.length >= 10) {
    lines.splice(1,2);
    return lines.join('\n');
  } else {
    return message;
  }
}
