'use strict'

const { forEach } = require('p-iteration')

class MultipleStrategiesScheme {
  constructor (server, options) {
    const { strategies } = options

    this.server = server
    this.strategies = strategies
  }

  async authenticate (request, h) {
    const scope = []
    const credentials = {}

    try {
      await forEach(this.strategies, async strategy => {
        const authCredentials = await this.server.auth.test(strategy, request)
        credentials[strategy] = authCredentials

        if (authCredentials.scope) {
          scope.push(...authCredentials.scope)
        }
      })
    } catch (err) {
      return h.unauthenticated(err)
    }

    return h.authenticated({ credentials: { scope, ...credentials } })
  }
}

module.exports = MultipleStrategiesScheme
