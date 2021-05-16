'use strict';

module.exports = (XIBLE_REGISTRY_WRAPPER) => {
  class Flow {
    constructor(obj) {
      if (obj) {
        Object.assign(this, obj);
      }
    }

    static mapHash(flows) {
      Object.keys(flows).forEach((flowName) => {
        flows[flowName] = new Flow(flows[flowName]);
      });

      return flows;
    }

    static getAll() {
      return XIBLE_REGISTRY_WRAPPER.http.request('GET', '/flows')
        .toJson()
        .then(this.mapHash);
    }

    /**
     * Legacy.
     * Will return a random flow
     * if multiple flows exist with the same name, published by different users.
     * @param {String} flowName - The name of the flow to get.
     * @returns {Promise<Flow | null>} - Returns the requested flow if it exists,
     * otherwise null.
     */
    static getByName(flowName) {
      if (typeof flowName !== 'string') {
        return Promise.reject(new Error('"flowName" argument must be a string'));
      }

      const req = XIBLE_REGISTRY_WRAPPER.http.request('GET', `/flows/${encodeURIComponent(flowName)}`);
      return req
        .toObject(Flow)
        .catch((err) => {
          if (err.statusCode === 404) {
            return Promise.resolve(null);
          }
          return Promise.reject(err);
        });
    }

    /**
     * Will return the specified flow for the given user.
     * Similar as User.getFlowByName().
     * @param {String} publishUserName - The name of the user who published the flow.
     * @param {String} flowName - The name of the flow to get.
     * @returns {Promise<Flow | null>} - Returns the requested flow if it exists,
     * otherwise null.
     */
    static getByPublisherAndName(publishUserName, flowName) {
      if (typeof publishUserName !== 'string') {
        return Promise.reject(new Error('"publishUserName" argument must be a string'));
      }

      if (typeof flowName !== 'string') {
        return Promise.reject(new Error('"flowName" argument must be a string'));
      }

      const req = XIBLE_REGISTRY_WRAPPER.http.request('GET', `/users/${encodeURIComponent(publishUserName)}/flows/${encodeURIComponent(flowName)}`);
      return req
        .toObject(Flow)
        .catch((err) => {
          if (err.statusCode === 404) {
            return Promise.resolve(null);
          }

          return Promise.reject(err);
        });
    }

    static search(searchString) {
      if (typeof searchString !== 'string') {
        return Promise.reject(new Error('"searchString" argument must be a string'));
      }

      return XIBLE_REGISTRY_WRAPPER.http.request('GET', `/flows?search=${encodeURIComponent(searchString)}`)
        .toJson()
        .then(this.mapHash);
    }

    static publish(obj) {
      const req = XIBLE_REGISTRY_WRAPPER.http.request('POST', '/flows');
      return req.toJson(obj);
    }
  }

  return Flow;
};
