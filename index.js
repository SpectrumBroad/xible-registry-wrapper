'use strict';	/* jshint ignore: line */

class XibleRegistryWrapper {

	constructor(obj) {

		if (obj && obj.url) {
			this.url = obj.url;
		}

		//this.Flow = require('./Flow.js')(this);
		this.NodePack = require('./NodePack.js')(this);
		this.User = require('./User.js')(this);

	}

}

module.exports = XibleRegistryWrapper;
