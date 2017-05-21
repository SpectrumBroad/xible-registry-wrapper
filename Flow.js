module.exports = (XIBLE_REGISTRY_WRAPPER) => {
	const OoHttpRequest = require('oohttp').Request;

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

    static getByName(flowName) {
      if (typeof flowName !== 'string') {
        return Promise.reject(`name argument must be a string`);
      }

      let req = new OoHttpRequest('GET', `${XIBLE_REGISTRY_WRAPPER.url}/flows/${encodeURI(flowName)}`);
      return req.toObject(Flow)
        .catch((err) => {
          if (err.statusCode === 404) {
            return Promise.resolve(null);
          } else {
            return Promise.reject(err);
          }
        });
    }

    static search(searchString) {
      if (typeof searchString !== 'string') {
        return Promise.reject(`searchString argument must be a string`);
      }

      return new OoHttpRequest('GET', `${XIBLE_REGISTRY_WRAPPER.url}/flows?search=${encodeURIComponent(searchString)}`)
        .toJson()
        .then(this.mapHash);
    }

    static publish(obj, userToken) {
      return new OoHttpRequest('POST', `${XIBLE_REGISTRY_WRAPPER.url}/flows?token=${encodeURIComponent(userToken)}`)
        .toJson(obj);
    }

  }

  return Flow;
}
