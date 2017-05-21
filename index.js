'use strict';	/* jshint ignore: line */

class XibleRegistryWrapper {

	constructor(obj) {

		if (obj && obj.url) {
			this.url = obj.url;

			if(this.url.substring(this.url.length - 1) === '/') {
				this.url = this.url.substring(0, this.url.length - 1);
			}
		}

		this.Flow = require('./Flow.js')(this);
		this.NodePack = require('./NodePack.js')(this);
		this.User = require('./User.js')(this);

	}

}

module.exports = XibleRegistryWrapper;
