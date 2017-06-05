module.exports = (XIBLE_REGISTRY_WRAPPER) => {
	const OoHttpRequest = require('oohttp').Request;

	OoHttpRequest.defaults.timeout = 30000;

	class User {

		constructor(obj) {
			if (obj) {
				Object.assign(this, obj);
			}
		}

		/**
		 * Adds a user to the registry. Rejects if the user already exists.
		 * @param {User} user The user to add.
		 * @returns {Promise} A promise that resolves with a token.
		 */
		static add(user) {
			let req = new OoHttpRequest('POST', `${XIBLE_REGISTRY_WRAPPER.url}/users`);
			return req.toJson(user);
		}

		/**
		 * Resolves a user for a token, or null if the token can't be matched.
		 * @param {String} token The authentication token belonging to the user.
		 * @returns {Promise.<User>} A promise that resolves with the found user or null.
		 */
		static getByToken(token) {
			const req = new OoHttpRequest('GET', `${XIBLE_REGISTRY_WRAPPER.url}/users`);
			req.headers['x-auth-token'] = encodeURIComponent(token);
			return req.toObject(User)
				.catch((err) => {
					if (err.statusCode === 404) {
						return Promise.resolve(null);
					} else {
						return Promise.reject(err);
					}
				});
		}

		/**
		 * resolves with a token. requires "user.password" to be set
		 * @returns {Promise}  a promise that resolves with the token
		 */
		getToken() {
			if (!this.password) {
				return Promise.reject(`No "password" set.`);
			}

			if (!this.name) {
				return Promise.reject(`No "name" set.`);
			}

			let req = new OoHttpRequest('POST', `${XIBLE_REGISTRY_WRAPPER.url}/users/${encodeURIComponent(this.name)}/token`);
			return req.toJson(this);
		}

	}

	return User;
};
