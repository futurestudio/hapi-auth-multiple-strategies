'use strict'

const { forEachSeries } = require('p-iteration')

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
      await forEachSeries(this.strategies, async strategy => {
        const authCredentials = await this.server.auth.test(strategy, request)
        credentials[strategy] = authCredentials

        if (authCredentials.scope) {
          const scopes = Array.isArray(authCredentials.scope) ? authCredentials.scope : [authCredentials.scope]
          scope.push(...scopes)
        }
      })
    } catch (err) {
      return h.unauthenticated(err)
    }

    return h.authenticated({ credentials: { scope, ...credentials } })
  }
}

module.exports = MultipleStrategiesScheme
