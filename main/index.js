'use strict';

var action = require('./main.js');

exports.handler = function(event, context) {
  action.run(event, context, function(error, result) {
    return context.done(error, result);
  });
};
