'use strict';

const oohttp = require('oohttp');

class XibleRegistryWrapper {
  constructor(obj) {
    if (typeof obj === 'string') {
      this.url = obj;
    } else if (obj && obj.url) {
      this.url = obj.url;
    }
    this.http = new oohttp.Base(this.url);

    // token if specified
    if (obj && obj.token) {
      this.setToken(obj.token);
    }

    this.Flow = require('./Flow.js')(this);
    this.NodePack = require('./NodePack.js')(this);
    this.User = require('./User.js')(this);
  }

  setToken(token) {
    this.token = token;
    this.http.headers['x-auth-token'] = this.token;
  }
}

module.exports = XibleRegistryWrapper;
