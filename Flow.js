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

    static getByName(flowName) {
      if (typeof flowName !== 'string') {
        return Promise.reject('name argument must be a string');
      }

      const req = XIBLE_REGISTRY_WRAPPER.http.request('GET', `/flows/${encodeURI(flowName)}`);
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
        return Promise.reject('searchString argument must be a string');
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
