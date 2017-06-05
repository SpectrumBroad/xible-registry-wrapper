module.exports = (XIBLE_REGISTRY_WRAPPER) => {
	const OoHttpRequest = require('oohttp').Request;

	OoHttpRequest.defaults.timeout = 30000;

	class NodePack {

		constructor(obj) {
			if (obj) {
				Object.assign(this, obj);
			}
			this.registryData = null;
		}

		getRegistryData() {
			if (this.registryData) {
				return Promise.resolve(this.registryData);
			}

			let req = new OoHttpRequest('GET', this.registry.url);
			return req.toJson();
		}

		getTarballUrl() {
			return this.getRegistryData().then((json) => {

				let tarballUrl = null;
				if (!json.dist && json['dist-tags']) {
					tarballUrl = json.versions[json['dist-tags'].latest].dist.tarball;
				} else if (json.dist) {
					tarballUrl = json.dist.tarball;
				}

				return tarballUrl;

			});
		}

		static mapHash(nodePacks) {
			Object.keys(nodePacks).forEach((nodePackName) => {
				nodePacks[nodePackName] = new NodePack(nodePacks[nodePackName]);
			});

			return nodePacks;
		}

		static getAll() {
			let req = new OoHttpRequest('GET', `${XIBLE_REGISTRY_WRAPPER.url}/nodepacks`);
			return req.toJson().then(this.mapHash);
		}

		static getByName(nodePackName) {
			if (typeof nodePackName !== 'string') {
				return Promise.reject(`name argument must be a string`);
			}

			let req = new OoHttpRequest('GET', `${XIBLE_REGISTRY_WRAPPER.url}/nodepacks/${encodeURI(nodePackName)}`);
			return req.toObject(NodePack)
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

			const req = new OoHttpRequest('GET', `${XIBLE_REGISTRY_WRAPPER.url}/nodepacks?search=${encodeURIComponent(searchString)}`);
			return req.toJson()
				.then(this.mapHash);
		}

		static publish(obj, userToken) {
			const req = new OoHttpRequest('POST', `${XIBLE_REGISTRY_WRAPPER.url}/nodepacks`);
			req.headers['x-auth-token'] = encodeURIComponent(userToken);
			return req.toJson(obj);
		}

	}

	return NodePack;
};
