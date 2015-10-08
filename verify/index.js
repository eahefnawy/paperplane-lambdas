'use strict';

var action = require('./main.js');

exports.handler = function(event, context) {
  action.run(event, context, function(error, result) {
    console.log('yooooo')
    return context.done(error, result);
  });
};
