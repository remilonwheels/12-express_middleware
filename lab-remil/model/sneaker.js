'use strict';

const debug = require('debug')('sneaker:sneaker');
const createError = require('http-errors');
const uuid = require('node-uuid');
const storage = require('../lib/storage.js');

const Sneaker = module.exports = function(model, brand) {
  debug('sneaker constructor');

  if (!model) return Promise.reject(createError(400, 'expected sneaker model'));
  if (!brand) return Promise.reject(createError(400, 'expected sneaker brand'));

  this.id = uuid.v4();
  this.model = model;
  this.brand = brand;
};

Sneaker.createSneaker = function(_sneaker) {
  debug('createSneaker');

  try {
    let sneaker = new Sneaker(_sneaker.model, _sneaker.brand);
    return storage.createItem('sneaker', sneaker);
  } catch (err) {
    return Promise.reject(err);
  }
};

Sneaker.fetchSneaker = function(id) {
  debug('fetchSneaker');

  return storage.fetchItem('sneaker', id);
};

Sneaker.updateSneaker = function(id, _sneaker) {
  debug('updateSneaker');

  return storage.fetchItem('sneaker', id)
  .then( sneaker => {
    for(let prop in sneaker) {
      if (prop === 'id') continue;
      if (_sneaker[prop]) sneaker[prop] = _sneaker[prop];
    }
    return storage.createItem('sneaker', sneaker);
  });
};

Sneaker.deleteSneaker = function(id) {
  debug('deleteSneaker');

  return storage.deleteItem('sneaker', id);
};

Sneaker.availSneakers = function() {
  debug('availSneakers');

  return storage.availIDs('sneaker');
};
