const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const http = require('http');
const config = require('../config/config')();

const colors = {
    RESET: '\x1b[0m',
    BRIGHT: '\x1b[1m',
    DIM: '\x1b[2m',
    UNDERSCORE: '\x1b[4m',
    BLINK: '\x1b[5m',
    REVERSE: '\x1b[7m',
    HIDDEN: '\x1b[8m',

    BLACK: '\x1b[30m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',

    BGBLACK: '\x1b[40m',
    BGRED: '\x1b[41m',
    BGGREEN: '\x1b[42m',
    BGYELLOW: '\x1b[43m',
    BGBLUE: '\x1b[44m',
    BGMAGENTA: '\x1b[45m',
    BGCYAN: '\x1b[46m',
    BGWHITE: '\x1b[47m'
};

function sendResponse(res, statusCode, description, data = null) {
  const responseObject = {
    status: statusCode,
    status_response: http.STATUS_CODES[statusCode] || 'Unknown Status',
    description: description,
  };

  if (data) {
    responseObject.data = data;
  }

  return res.status(statusCode).json(responseObject);
}

module.exports = {
    colors,
    dotenv,
    fs,
    path,
    sendResponse
}
