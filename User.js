'use strict';

module.exports = (XIBLE_REGISTRY_WRAPPER) => {
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
      return XIBLE_REGISTRY_WRAPPER.http.request('POST', '/users')
      .toJson(user);
    }

    /**
    * Resolves a user for a token, or null if the token can't be matched.
    * @param {String} token The authentication token belonging to the user.
    * @returns {Promise.<User>} A promise that resolves with the found user or null.
    */
    static getByToken(token) {
      const req = XIBLE_REGISTRY_WRAPPER.http.request('GET', '/users');
      req.headers['x-auth-token'] = token;
      return req
      .toObject(User)
      .catch((err) => {
        if (err.statusCode === 404 || err.statusCode === 401) {
          return Promise.resolve(null);
        }
        return Promise.reject(err);
      });
    }

    /**
    * Resolves with a new token. Requires "user.password" to be set.
    * @returns {Promise} A promise that resolves with the token.
    */
    async getToken() {
      if (!this.password) {
        throw new Error('No "password" set.');
      }

      if (!this.name) {
        throw new Error('No "name" set.');
      }

      const req = XIBLE_REGISTRY_WRAPPER.http.request('POST', `/users/${encodeURIComponent(this.name)}/tokens`);

      /*
       * Ensure we send this request without a token.
       * If the token wouldn't be valid anymore,
       * the registry would deny any login with this token provided.
       */
      req.headers['x-auth-token'] = null;

      return req.toJson(this);
    }

    /**
     * Deletes a token from the registry.
     * @param {String} token The token to be deleted.
     */
    async deleteToken(token) {
      if (typeof token !== 'string') {
        throw new TypeError('Argument "token" must be typeof string');
      }

      return XIBLE_REGISTRY_WRAPPER.http.request('DELETE', `/users/${encodeURIComponent(this.name)}/tokens/${encodeURIComponent(token)}`)
      .send();
    }
  }

  return User;
};
