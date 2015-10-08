'use strict';

var AWS      = require('aws-sdk'),
    Promise  = require('bluebird');

var dynamodb = new AWS.DynamoDB();
Promise.promisifyAll(Object.getPrototypeOf(dynamodb));

module.exports.run = function(event, context, cb) {
  if (!event.code) {
    return cb(new Error('Missing code parameter'));
  }

  var handleData = function(data) {
    if (data && 'Items' in data && !data.Items[0].isVerified.BOOL) {
      var params = {
        TableName: process.env.TABLE_NAME,
        Key: {
          email: { S: data.Items[0].email.S }
        },
        AttributeUpdates: {
          isVerified: {
            Action: 'PUT',
            Value: {
              BOOL: true
            }
          }
        }
      };

      return dynamodb.updateItemAsync(params);
    } else {
      return cb(new Error('Invalid validation code'));
    }
  };

  var params = {
    TableName: process.env.TABLE_NAME,
    ScanFilter: {
      verificationCode: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [ { S: event.code }, ],
      }
    }
  };

  dynamodb.scanAsync(params)
  .then(handleData)
  .then(function(data) {
    return cb(null, {message: 'Email verified successfully'});})
  .catch(function(e) {
    return cb(new Error('Something went wrong!'));
  });
};
