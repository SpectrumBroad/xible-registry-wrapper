'use strict';

module.exports = (XIBLE_REGISTRY_WRAPPER) => {
  const oohttp = require('oohttp');
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

      return new oohttp.Request('GET', this.registry.url)
      .toJson();
    }

    getTarballUrl() {
      return this
      .getRegistryData()
      .then((json) => {
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
      return XIBLE_REGISTRY_WRAPPER.http.request('GET', '/nodepacks')
      .toJson()
      .then(this.mapHash);
    }

    static getByName(nodePackName) {
      if (typeof nodePackName !== 'string') {
        return Promise.reject('name argument must be a string');
      }

      const req = XIBLE_REGISTRY_WRAPPER.http.request('GET', `/nodepacks/${encodeURI(nodePackName)}`);
      return req
      .toObject(NodePack)
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

      return XIBLE_REGISTRY_WRAPPER.http.request('GET', `/nodepacks?search=${encodeURIComponent(searchString)}`)
      .toJson()
      .then(this.mapHash);
    }

    static publish(obj) {
      const req = XIBLE_REGISTRY_WRAPPER.http.request('POST', '/nodepacks');
      return req.toJson(obj);
    }
  }

  return NodePack;
};
