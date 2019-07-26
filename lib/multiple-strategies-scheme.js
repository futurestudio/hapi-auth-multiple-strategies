'use strict'

const Authenticator = require('./authenticator')

class MultipleStrategiesScheme {
  constructor (server, { strategies } = {}) {
    this.server = server
    this.strategies = strategies
  }

  async authenticate (request, h) {
    return new Authenticator(this.server, this.strategies).handle(request, h)
  }
}

module.exports = MultipleStrategiesScheme
